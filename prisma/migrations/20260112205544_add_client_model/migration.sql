/*
  Warnings:

  - You are about to drop the column `address` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `clientName` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `Order` table. All the data in the column will be lost.
  - Added the required column `clientId` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `snapshotAddress` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `snapshotName` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `snapshotPhone` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Client" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "address" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Order" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "clientId" INTEGER NOT NULL,
    "channel" TEXT NOT NULL,
    "product" TEXT NOT NULL,
    "info" TEXT,
    "deliveryPerson" TEXT,
    "paymentMethod" TEXT NOT NULL,
    "value" REAL NOT NULL,
    "message" TEXT,
    "deliveryMsg" TEXT,
    "snapshotAddress" TEXT NOT NULL,
    "snapshotPhone" TEXT NOT NULL,
    "snapshotName" TEXT NOT NULL,
    CONSTRAINT "Order_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Order" ("channel", "createdAt", "deliveryMsg", "deliveryPerson", "id", "info", "message", "paymentMethod", "product", "value") SELECT "channel", "createdAt", "deliveryMsg", "deliveryPerson", "id", "info", "message", "paymentMethod", "product", "value" FROM "Order";
DROP TABLE "Order";
ALTER TABLE "new_Order" RENAME TO "Order";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Client_name_key" ON "Client"("name");
