import { afterAll, afterEach, beforeEach, describe, expect, it } from "vitest";
import { mockDeep } from "vitest-mock-extended";
import { RegisterUser } from "@/modules/identity/application/useCases/RegisterUser";
import { PrismaUserRepository } from "@/modules/identity/infra/repositories/PrismaUserRepository";
import { BCryptHashProvider } from "@/shared/infra/providers";
import {
  cleanupDatabase,
  disconnectTestPrisma,
  getTestPrisma,
} from "@/shared/testing/createTestContext";
import type {
  IStorageProvider,
  IUploadTokenProvider,
} from "../../../../domain";
import { PrismaPostRepository } from "../../../../infra/repositories/PrismaPostRepository";
import { CreatePost } from "../../CreatePost";

describe("CreatePost Integration", () => {
  const prisma = getTestPrisma();
  const postRepository = new PrismaPostRepository(prisma);
  const mockStorageProvider = mockDeep<IStorageProvider>();
  const mockTokenProvider = mockDeep<IUploadTokenProvider>();
  const useCase = new CreatePost(
    postRepository,
    mockStorageProvider,
    mockTokenProvider,
  );

  let authorId: string;

  beforeEach(async () => {
    const userRepository = new PrismaUserRepository(prisma);
    const hashProvider = new BCryptHashProvider();
    const registerUser = new RegisterUser(userRepository, hashProvider);

    const user = await registerUser.execute({
      email: "post-author@test.com",
      username: "postauthor",
      password_plain: "Valid1Password!",
    });
    authorId = user.id;
  });

  afterEach(async () => {
    await cleanupDatabase();
  });

  afterAll(async () => {
    await disconnectTestPrisma();
  });

  it("should persist a post in the database with PUBLISHED status", async () => {
    mockTokenProvider.verifyToken.mockReturnValue({
      userId: authorId,
      fileKey: `temp/posts/${authorId}/file.png`,
      purpose: "post_upload",
    });
    mockStorageProvider.getFileMetadata.mockResolvedValue({
      size: 5 * 1024 * 1024,
      contentType: "image/png",
      filename: "file.png",
    });
    mockStorageProvider.moveFile.mockResolvedValue();
    mockStorageProvider.getPublicUrl.mockReturnValue(
      "https://cdn.com/file.png",
    );

    const result = await useCase.execute({
      userId: authorId,
      data: {
        title: "Integration Post",
        uploadToken: "valid-token",
        tags: ["test"],
      },
    });

    expect(result.post.title).toBe("Integration Post");
    expect(result.post.status).toBe("PUBLISHED");

    const persisted = await prisma.post.findUnique({
      where: { id: result.post.id },
    });
    expect(persisted).not.toBeNull();
    expect(persisted?.status).toBe("PUBLISHED");
    expect(persisted?.author_id).toBe(authorId);
  });

  it("should set status to FAILED if moveFile throws", async () => {
    mockTokenProvider.verifyToken.mockReturnValue({
      userId: authorId,
      fileKey: `temp/posts/${authorId}/fail.png`,
      purpose: "post_upload",
    });
    mockStorageProvider.getFileMetadata.mockResolvedValue({
      size: 5 * 1024 * 1024,
      contentType: "image/png",
      filename: "fail.png",
    });
    mockStorageProvider.moveFile.mockRejectedValue(new Error("S3 error"));

    await expect(
      useCase.execute({
        userId: authorId,
        data: { title: "Fail Post", uploadToken: "valid-token", tags: [] },
      }),
    ).rejects.toThrow();

    const posts = await prisma.post.findMany({
      where: { author_id: authorId },
    });
    const failedPost = posts.find((p) => p.title === "Fail Post");
    expect(failedPost?.status).toBe("FAILED");
  });
});
