import { afterAll, afterEach, describe, expect, it } from "vitest";
import { BCryptHashProvider, JWTokenProvider } from "@/shared/infra/providers";
import {
  cleanupDatabase,
  disconnectTestPrisma,
  getTestPrisma,
} from "@/shared/testing/createTestContext";
import {
  InvalidCredentialsError,
  type ITokenProvider,
} from "../../../../domain";
import { PrismaUserRepository } from "../../../../infra/repositories/PrismaUserRepository";
import { AuthenticateUser } from "../../AuthenticateUser";
import { RegisterUser } from "../../RegisterUser";

describe("AuthenticateUser Integration", () => {
  const prisma = getTestPrisma();
  const userRepository = new PrismaUserRepository(prisma);
  const hashProvider = new BCryptHashProvider();
  const tokenProvider = new JWTokenProvider();

  const registerUseCase = new RegisterUser(userRepository, hashProvider);
  const authUseCase = new AuthenticateUser(
    userRepository,
    hashProvider,
    tokenProvider as ITokenProvider,
  );

  afterEach(async () => {
    await cleanupDatabase();
  });

  afterAll(async () => {
    await disconnectTestPrisma();
  });

  it("should authenticate a registered user and return a JWT", async () => {
    await registerUseCase.execute({
      email: "auth@test.com",
      username: "authuser",
      password_plain: "Valid1Password!",
    });

    const result = await authUseCase.execute({
      email: "auth@test.com",
      password_plain: "Valid1Password!",
    });

    expect(result.token).toBeDefined();
    expect(result.token.split(".")).toHaveLength(3);
    expect(result.user.email).toBe("auth@test.com");
  });

  it("should reject wrong password", async () => {
    await registerUseCase.execute({
      email: "wrong@test.com",
      username: "wronguser",
      password_plain: "Valid1Password!",
    });

    await expect(
      authUseCase.execute({
        email: "wrong@test.com",
        password_plain: "WrongPassword123!",
      }),
    ).rejects.toThrow(InvalidCredentialsError);
  });

  it("should reject non-existent email", async () => {
    await expect(
      authUseCase.execute({
        email: "nobody@test.com",
        password_plain: "Valid1Password!",
      }),
    ).rejects.toThrow(InvalidCredentialsError);
  });
});
