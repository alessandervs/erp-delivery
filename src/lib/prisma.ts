import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3"

declare global {
    var cachedPrisma: PrismaClient;
}

let db: PrismaClient;

if (process.env.NODE_ENV == "production") {
    const sqlite = new PrismaBetterSqlite3({ url: process.env.DATABASE_URL });
    db = new PrismaClient({ adapter: sqlite });
} else {
    const sqlite = new PrismaBetterSqlite3({ url: process.env.DATABASE_URL });
    if (!global.cachedPrisma) {
        global.cachedPrisma = new PrismaClient({ adapter: sqlite });
    }

    db = global.cachedPrisma;
}

export const prisma = db;