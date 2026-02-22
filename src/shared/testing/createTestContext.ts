import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";

const TEST_DATABASE_URL =
  "postgresql://johndoe:randompassword@localhost:5432/mydb_test?schema=public";

let testPrisma: PrismaClient | null = null;

export function getTestPrisma(): PrismaClient {
  if (!testPrisma) {
    testPrisma = new PrismaClient({
      adapter: new PrismaPg(new Pool({ connectionString: TEST_DATABASE_URL })),
    });
  }
  return testPrisma;
}

export async function cleanupDatabase(): Promise<void> {
  const prisma = getTestPrisma();

  await prisma.$executeRawUnsafe('TRUNCATE TABLE "Post", "User" CASCADE');
}

export async function disconnectTestPrisma(): Promise<void> {
  if (testPrisma) {
    await testPrisma.$disconnect();
    testPrisma = null;
  }
}
