-- CreateTable
CREATE TABLE "Order" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "clientName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "channel" TEXT NOT NULL,
    "product" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "info" TEXT,
    "deliveryPerson" TEXT,
    "paymentMethod" TEXT NOT NULL,
    "value" REAL NOT NULL,
    "message" TEXT,
    "deliveryMsg" TEXT
);
