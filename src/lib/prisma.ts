import { copyFileSync, existsSync } from "fs";
import path from "path";
import { PrismaClient } from "@prisma/client";

/**
 * Vercel serverless has a read-only FS except /tmp.
 * We ship a seeded SQLite file from build, then copy it to /tmp on cold start.
 * Fine for demos; use Postgres (Neon) for a real client with persistent data.
 */
function resolveDatabaseUrl(): string {
  if (!process.env.VERCEL) {
    return process.env.DATABASE_URL || "file:./dev.db";
  }

  const tmpDb = "/tmp/clinic.db";
  const bundledDb = path.join(process.cwd(), "prisma", "dev.db");

  if (!existsSync(tmpDb)) {
    if (existsSync(bundledDb)) {
      copyFileSync(bundledDb, tmpDb);
    } else {
      console.error(
        "[db] Bundled prisma/dev.db missing. Build must run db push + seed."
      );
    }
  }

  return `file:${tmpDb}`;
}

const databaseUrl = resolveDatabaseUrl();
process.env.DATABASE_URL = databaseUrl;

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    datasources: { db: { url: databaseUrl } },
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
