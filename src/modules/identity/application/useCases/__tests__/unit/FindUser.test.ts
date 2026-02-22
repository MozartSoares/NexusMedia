import { beforeEach, describe, expect, it } from "vitest";
import { mockDeep, mockReset } from "vitest-mock-extended";
import type { IUserRepository } from "../../../../domain";
import { FindUser } from "../../FindUser";
import { createMockUser } from "../utils/mocks";

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
      username: "testuser",
    });
    mockUserRepository.findById.mockResolvedValue(mockUser);

    const result = await useCase.execute("user-123");

    expect(result).toBeDefined();
    expect(result?.id).toBe("user-123");
    expect(result?.username).toBe("testuser");
  });

  it("should return null if user is not found", async () => {
    mockUserRepository.findById.mockResolvedValue(null);

    const result = await useCase.execute("non-existent-id");

    expect(result).toBeNull();
  });
});
