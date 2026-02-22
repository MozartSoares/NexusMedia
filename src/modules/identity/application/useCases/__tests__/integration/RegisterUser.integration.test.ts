import { afterAll, afterEach, describe, expect, it } from "vitest";
import { BCryptHashProvider } from "@/shared/infra/providers";
import {
  cleanupDatabase,
  disconnectTestPrisma,
  getTestPrisma,
} from "@/shared/testing/createTestContext";
import { UserAlreadyExistsError } from "../../../../domain";
import { PrismaUserRepository } from "../../../../infra/repositories/PrismaUserRepository";
import { RegisterUser } from "../../RegisterUser";

describe("RegisterUser Integration", () => {
  const prisma = getTestPrisma();
  const userRepository = new PrismaUserRepository(prisma);
  const hashProvider = new BCryptHashProvider();
  const useCase = new RegisterUser(userRepository, hashProvider);

  afterEach(async () => {
    await cleanupDatabase();
  });

  afterAll(async () => {
    await disconnectTestPrisma();
  });

  it("should persist a user in the database", async () => {
    const result = await useCase.execute({
      email: "integration@test.com",
      username: "integrationuser",
      password_plain: "Valid1Password!",
    });

    expect(result.id).toBeDefined();
    expect(result.email).toBe("integration@test.com");
    expect(result.username).toBe("integrationuser");

    const persisted = await prisma.user.findUnique({
      where: { id: result.id },
    });
    expect(persisted).not.toBeNull();
    expect(persisted?.email).toBe("integration@test.com");
  });

  it("should hash the password before storing", async () => {
    const result = await useCase.execute({
      email: "hash@test.com",
      username: "hashuser",
      password_plain: "Valid1Password!",
    });

    const persisted = await prisma.user.findUnique({
      where: { id: result.id },
    });
    expect(persisted?.password_hash).not.toBe("Valid1Password!");
    expect(persisted?.password_hash.length).toBeGreaterThan(20);
  });

  it("should reject duplicate email", async () => {
    await useCase.execute({
      email: "dup@test.com",
      username: "user1",
      password_plain: "Valid1Password!",
    });

    await expect(
      useCase.execute({
        email: "dup@test.com",
        username: "user2",
        password_plain: "Valid1Password!",
      }),
    ).rejects.toThrow(UserAlreadyExistsError);
  });

  it("should reject duplicate username", async () => {
    await useCase.execute({
      email: "first@test.com",
      username: "sameuser",
      password_plain: "Valid1Password!",
    });

    await expect(
      useCase.execute({
        email: "second@test.com",
        username: "sameuser",
        password_plain: "Valid1Password!",
      }),
    ).rejects.toThrow(UserAlreadyExistsError);
  });
});
