import { beforeEach, describe, expect, it } from "vitest";
import { mockDeep, mockReset } from "vitest-mock-extended";
import type {
  IStorageProvider,
  IUploadTokenProvider,
} from "../../../domain/interfaces";
import { GetUploadUrl } from "../GetUploadUrl";

describe("GetUploadUrl UseCase", () => {
  const mockStorageProvider = mockDeep<IStorageProvider>();
  const mockTokenProvider = mockDeep<IUploadTokenProvider>();

  let useCase: GetUploadUrl;

  beforeEach(() => {
    mockReset(mockStorageProvider);
    mockReset(mockTokenProvider);
    useCase = new GetUploadUrl(mockStorageProvider, mockTokenProvider);
  });

  it("should successfully generate an upload url and token", async () => {
    mockStorageProvider.generatePresignedUploadUrl.mockResolvedValue(
      "https://mock-s3-bucket.com/upload-url",
    );
    mockTokenProvider.generateToken.mockReturnValue("valid-upload-token");

    const result = await useCase.execute({
      userId: "user-123",
      data: {
        filename: "image.png",
        contentType: "image/png",
        size: 5 * 1024 * 1024,
      },
    });

    expect(result.uploadUrl).toBe("https://mock-s3-bucket.com/upload-url");
    expect(result.uploadToken).toBe("valid-upload-token");

    expect(
      mockStorageProvider.generatePresignedUploadUrl,
    ).toHaveBeenCalledOnce();
    expect(mockTokenProvider.generateToken).toHaveBeenCalledOnce();
  });

  it("should throw an error for unsupported media types", async () => {
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
    expect(mockTokenProvider.generateToken).not.toHaveBeenCalled();
  });

  it("should throw an error if file size exceeds maximum limit", async () => {
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
    expect(mockTokenProvider.generateToken).not.toHaveBeenCalled();
  });
});
