import { execSync } from "node:child_process";

const TEST_DATABASE_URL =
  "postgresql://johndoe:randompassword@localhost:5432/mydb_test?schema=public";

export async function setup() {
  process.env.DATABASE_URL = TEST_DATABASE_URL;
  process.env.JWT_SECRET = "test-secret-key-for-integration-tests";

  execSync(`npx prisma db push --url "${TEST_DATABASE_URL}" --force-reset`, {
    stdio: "inherit",
  });
}
