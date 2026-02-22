import { beforeEach, describe, expect, it } from "vitest";
import { mockDeep, mockReset } from "vitest-mock-extended";
import type {
  IStorageProvider,
  IUploadTokenProvider,
} from "../../../../domain/interfaces";
import { GetUploadUrl } from "../../GetUploadUrl";

describe("GetUploadUrl UseCase", () => {
  const mockStorageProvider = mockDeep<IStorageProvider>();
  const mockTokenProvider = mockDeep<IUploadTokenProvider>();

  let useCase: GetUploadUrl;

  beforeEach(() => {
    mockReset(mockStorageProvider);
    mockReset(mockTokenProvider);
    useCase = new GetUploadUrl(mockStorageProvider, mockTokenProvider);
  });

  it("should generate an upload url and token", async () => {
    mockStorageProvider.generatePresignedUploadUrl.mockResolvedValue(
      "https://s3.com/upload",
    );
    mockTokenProvider.generateToken.mockReturnValue("upload-token");

    const result = await useCase.execute({
      userId: "user-123",
      data: {
        filename: "image.png",
        contentType: "image/png",
        size: 5 * 1024 * 1024,
      },
    });

    expect(result.uploadUrl).toBe("https://s3.com/upload");
    expect(result.uploadToken).toBe("upload-token");
    expect(
      mockStorageProvider.generatePresignedUploadUrl,
    ).toHaveBeenCalledOnce();
  });

  it("should throw for unsupported media types", async () => {
    await expect(
      useCase.execute({
        userId: "user-123",
        data: {
          filename: "document.pdf",
          contentType: "application/pdf",
          size: 5 * 1024 * 1024,
        },
      }),
    ).rejects.toThrow();

    expect(
      mockStorageProvider.generatePresignedUploadUrl,
    ).not.toHaveBeenCalled();
  });

  it("should throw if file size exceeds limit", async () => {
    await expect(
      useCase.execute({
        userId: "user-123",
        data: {
          filename: "image.png",
          contentType: "image/png",
          size: 200 * 1024 * 1024,
        },
      }),
    ).rejects.toThrow();

    expect(
      mockStorageProvider.generatePresignedUploadUrl,
    ).not.toHaveBeenCalled();
  });
});
