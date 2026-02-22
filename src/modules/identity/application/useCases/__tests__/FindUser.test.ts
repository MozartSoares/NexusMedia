import { beforeEach, describe, expect, it } from "vitest";
import { mockDeep, mockReset } from "vitest-mock-extended";
import { createMockUser } from "@/shared/testing/mocks";
import type { IUserRepository } from "../../../domain";
import { FindUser } from "../FindUser";

describe("FindUser UseCase", () => {
  const mockUserRepository = mockDeep<IUserRepository>();

  let useCase: FindUser;

  beforeEach(() => {
    mockReset(mockUserRepository);
    useCase = new FindUser(mockUserRepository);
  });

  it("should return a user if found", async () => {
    const mockUser = createMockUser({
      id: "user-123",
      email: "test@example.com",
      username: "testuser",
    });

    mockUserRepository.findById.mockResolvedValue(mockUser);

    const result = await useCase.execute("user-123");

    expect(result).toBeDefined();
    expect(result?.id).toBe("user-123");
    expect(result?.username).toBe("testuser");
    expect(mockUserRepository.findById).toHaveBeenCalledWith("user-123");
  });

  it("should return null if user is not found", async () => {
    mockUserRepository.findById.mockResolvedValue(null);

    const result = await useCase.execute("non-existent-id");

    expect(result).toBeNull();
    expect(mockUserRepository.findById).toHaveBeenCalledWith("non-existent-id");
  });
});
