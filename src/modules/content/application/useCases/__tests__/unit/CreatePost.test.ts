import { beforeEach, describe, expect, it } from "vitest";
import { mockDeep, mockReset } from "vitest-mock-extended";
import type {
  IPostRepository,
  IStorageProvider,
  IUploadTokenProvider,
} from "../../../../domain";
import {
  FileNotFoundError,
  FileProcessingError,
  UnauthorizedError,
} from "../../../../domain";
import { CreatePost } from "../../CreatePost";

describe("CreatePost UseCase", () => {
  const mockPostRepository = mockDeep<IPostRepository>();
  const mockStorageProvider = mockDeep<IStorageProvider>();
  const mockTokenProvider = mockDeep<IUploadTokenProvider>();

  let useCase: CreatePost;

  beforeEach(() => {
    mockReset(mockPostRepository);
    mockReset(mockStorageProvider);
    mockReset(mockTokenProvider);
    useCase = new CreatePost(
      mockPostRepository,
      mockStorageProvider,
      mockTokenProvider,
    );
  });

  it("should successfully create a post", async () => {
    mockTokenProvider.verifyToken.mockReturnValue({
      userId: "user-123",
      fileKey: "temp/posts/user-123/file.png",
      purpose: "post_upload",
    });
    mockStorageProvider.getFileMetadata.mockResolvedValue({
      size: 5 * 1024 * 1024,
      contentType: "image/png",
      filename: "file.png",
    });
    mockPostRepository.save.mockImplementation(async (post) => post);
    mockStorageProvider.moveFile.mockResolvedValue();
    mockPostRepository.updateStatus.mockResolvedValue();
    mockStorageProvider.getPublicUrl.mockReturnValue(
      "https://cdn.com/file.png",
    );

    const result = await useCase.execute({
      userId: "user-123",
      data: { title: "My post", uploadToken: "valid-token", tags: ["nexus"] },
    });

    expect(result.post.title).toBe("My post");
    expect(result.post.authorId).toBe("user-123");
    expect(result.post.status).toBe("PUBLISHED");
    expect(mockStorageProvider.moveFile).toHaveBeenCalledOnce();
  });

  it("should rollback on moveFile failure", async () => {
    mockTokenProvider.verifyToken.mockReturnValue({
      userId: "user-123",
      fileKey: "temp/posts/user-123/file.png",
      purpose: "post_upload",
    });
    mockStorageProvider.getFileMetadata.mockResolvedValue({
      size: 5 * 1024 * 1024,
      contentType: "image/png",
      filename: "file.png",
    });
    mockPostRepository.save.mockImplementation(async (post) => post);
    mockStorageProvider.moveFile.mockRejectedValue(new Error("S3 error"));

    await expect(
      useCase.execute({
        userId: "user-123",
        data: { title: "Fail post", uploadToken: "valid-token", tags: [] },
      }),
    ).rejects.toThrow(FileProcessingError);

    expect(mockPostRepository.updateStatus).toHaveBeenCalledWith(
      expect.any(String),
      "FAILED",
    );
  });

  it("should throw UnauthorizedError if token is invalid", async () => {
    mockTokenProvider.verifyToken.mockReturnValue(null);

    await expect(
      useCase.execute({
        userId: "user-123",
        data: { title: "Post", uploadToken: "bad-token", tags: [] },
      }),
    ).rejects.toThrow(UnauthorizedError);
  });

  it("should throw UnauthorizedError if token user mismatch", async () => {
    mockTokenProvider.verifyToken.mockReturnValue({
      userId: "other-user",
      fileKey: "temp/posts/other/file.png",
      purpose: "post_upload",
    });

    await expect(
      useCase.execute({
        userId: "user-123",
        data: { title: "Post", uploadToken: "wrong-user-token", tags: [] },
      }),
    ).rejects.toThrow(UnauthorizedError);
  });

  it("should throw FileNotFoundError if file missing", async () => {
    mockTokenProvider.verifyToken.mockReturnValue({
      userId: "user-123",
      fileKey: "temp/posts/user-123/missing.png",
      purpose: "post_upload",
    });
    mockStorageProvider.getFileMetadata.mockRejectedValue(
      new Error("Not found"),
    );

    await expect(
      useCase.execute({
        userId: "user-123",
        data: { title: "Post", uploadToken: "valid-token", tags: [] },
      }),
    ).rejects.toThrow(FileNotFoundError);
  });
});
