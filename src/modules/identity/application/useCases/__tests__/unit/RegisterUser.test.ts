import { beforeEach, describe, expect, it } from "vitest";
import { mockDeep, mockReset } from "vitest-mock-extended";
import type { IHashProvider, IUserRepository } from "../../../../domain";
import { UserAlreadyExistsError } from "../../../../domain";
import { RegisterUser } from "../../RegisterUser";
import { createMockUser } from "../utils/mocks";

describe("RegisterUser UseCase", () => {
  const mockUserRepository = mockDeep<IUserRepository>();
  const mockHashProvider = mockDeep<IHashProvider>();

  let useCase: RegisterUser;

  beforeEach(() => {
    mockReset(mockUserRepository);
    mockReset(mockHashProvider);
    useCase = new RegisterUser(mockUserRepository, mockHashProvider);
  });

  it("should successfully register a user", async () => {
    mockUserRepository.findByEmail.mockResolvedValue(null);
    mockUserRepository.findByUsername.mockResolvedValue(null);
    mockHashProvider.hash.mockResolvedValue("hashed_password");
    mockUserRepository.save.mockImplementation(async (user) => user);

    const result = await useCase.execute({
      email: "test@example.com",
      username: "testuser",
      password_plain: "Valid1Password!",
    });

    expect(result).toHaveProperty("id");
    expect(result.email).toBe("test@example.com");
    expect(result.username).toBe("testuser");
    expect(mockUserRepository.save).toHaveBeenCalledOnce();
    expect(mockHashProvider.hash).toHaveBeenCalledWith("Valid1Password!");
  });

  it("should throw if email already exists", async () => {
    mockUserRepository.findByEmail.mockResolvedValue(
      createMockUser({ email: "test@example.com" }),
    );
    mockUserRepository.findByUsername.mockResolvedValue(null);

    await expect(
      useCase.execute({
        email: "test@example.com",
        username: "testuser",
        password_plain: "Valid1Password!",
      }),
    ).rejects.toThrow(UserAlreadyExistsError);

    expect(mockUserRepository.save).not.toHaveBeenCalled();
  });

  it("should throw if username already exists", async () => {
    mockUserRepository.findByEmail.mockResolvedValue(null);
    mockUserRepository.findByUsername.mockResolvedValue(
      createMockUser({ username: "testuser" }),
    );

    await expect(
      useCase.execute({
        email: "test@example.com",
        username: "testuser",
        password_plain: "Valid1Password!",
      }),
    ).rejects.toThrow(UserAlreadyExistsError);

    expect(mockUserRepository.save).not.toHaveBeenCalled();
  });

  it("should throw if validation fails", async () => {
    await expect(
      useCase.execute({
        email: "invalid-email",
        username: "usr",
        password_plain: "short",
      }),
    ).rejects.toThrow();

    expect(mockUserRepository.save).not.toHaveBeenCalled();
  });
});
