import { beforeEach, describe, expect, it } from "vitest";
import { mockDeep, mockReset } from "vitest-mock-extended";
import { createMockUser } from "@/shared/testing/mocks";
import type {
  IHashProvider,
  ITokenProvider,
  IUserRepository,
} from "../../../domain";
import { InvalidCredentialsError } from "../../../domain";
import { AuthenticateUser } from "../AuthenticateUser";

describe("AuthenticateUser UseCase", () => {
  const mockUserRepository = mockDeep<IUserRepository>();
  const mockHashProvider = mockDeep<IHashProvider>();
  const mockTokenProvider = mockDeep<ITokenProvider>();

  let useCase: AuthenticateUser;

  beforeEach(() => {
    mockReset(mockUserRepository);
    mockReset(mockHashProvider);
    mockReset(mockTokenProvider);
    useCase = new AuthenticateUser(
      mockUserRepository,
      mockHashProvider,
      mockTokenProvider,
    );
  });

  it("should successfully authenticate user and return token", async () => {
    const mockUser = createMockUser({
      id: "user-123",
      email: "test@example.com",
      username: "testuser",
      password_hash: "hashed_password",
    });

    mockUserRepository.findByEmail.mockResolvedValue(mockUser);
    mockHashProvider.compare.mockResolvedValue(true);
    mockTokenProvider.generateToken.mockReturnValue("valid-jwt-token");

    const result = await useCase.execute({
      email: "test@example.com",
      password_plain: "Valid1Password!",
    });

    expect(result.token).toBe("valid-jwt-token");
    expect(result.user.id).toBe("user-123");
    expect(result.user.username).toBe("testuser");

    expect(mockHashProvider.compare).toHaveBeenCalledWith(
      "Valid1Password!",
      "hashed_password",
    );
    expect(mockTokenProvider.generateToken).toHaveBeenCalledWith({
      sub: "user-123",
      username: "testuser",
    });
  });

  it("should throw InvalidCredentialsError if user is not found", async () => {
    mockUserRepository.findByEmail.mockResolvedValue(null);

    await expect(
      useCase.execute({
        email: "test@example.com",
        password_plain: "Valid1Password!",
      }),
    ).rejects.toThrow(InvalidCredentialsError);

    expect(mockHashProvider.compare).not.toHaveBeenCalled();
    expect(mockTokenProvider.generateToken).not.toHaveBeenCalled();
  });

  it("should throw InvalidCredentialsError if password does not match", async () => {
    const mockUser = createMockUser({
      id: "user-123",
      email: "test@example.com",
      username: "testuser",
      password_hash: "hashed_password",
    });

    mockUserRepository.findByEmail.mockResolvedValue(mockUser);
    mockHashProvider.compare.mockResolvedValue(false);

    await expect(
      useCase.execute({
        email: "test@example.com",
        password_plain: "WrongPassword!",
      }),
    ).rejects.toThrow(InvalidCredentialsError);

    expect(mockTokenProvider.generateToken).not.toHaveBeenCalled();
  });

  it("should throw if validation fails", async () => {
    await expect(
      useCase.execute({
        email: "invalid-email",
        password_plain: "",
      }),
    ).rejects.toThrow();

    expect(mockUserRepository.findByEmail).not.toHaveBeenCalled();
  });
});
