/*
  Warnings:

  - You are about to drop the column `deliveryMsg` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `message` on the `Order` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "ClientMessage" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "content" TEXT NOT NULL,
    "orderId" INTEGER NOT NULL,
    CONSTRAINT "ClientMessage_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DeliveryMessage" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "content" TEXT NOT NULL,
    "orderId" INTEGER NOT NULL,
    CONSTRAINT "DeliveryMessage_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order" ("id") ON DELETE CASCADE ON UPDATE CASCADE
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
    "snapshotAddress" TEXT NOT NULL,
    "snapshotPhone" TEXT NOT NULL,
    "snapshotName" TEXT NOT NULL,
    CONSTRAINT "Order_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Order" ("channel", "clientId", "createdAt", "deliveryPerson", "id", "info", "paymentMethod", "product", "snapshotAddress", "snapshotName", "snapshotPhone", "value") SELECT "channel", "clientId", "createdAt", "deliveryPerson", "id", "info", "paymentMethod", "product", "snapshotAddress", "snapshotName", "snapshotPhone", "value" FROM "Order";
DROP TABLE "Order";
ALTER TABLE "new_Order" RENAME TO "Order";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
