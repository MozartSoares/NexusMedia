import { MediaAttachment, StoragePath } from "../../domain";
import type {
  IStorageProvider,
  IUploadTokenProvider,
} from "../../domain/interfaces";
import {
  type GetUploadUrlRequestDTO,
  type GetUploadUrlResponseDTO,
  GetUploadUrlSchema,
} from "../dtos";

export class GetUploadUrl {
  constructor(
    private storageProvider: IStorageProvider,
    private tokenProvider: IUploadTokenProvider,
  ) {}

  async execute({
    data,
    userId,
  }: {
    data: GetUploadUrlRequestDTO;
    userId: string;
  }): Promise<GetUploadUrlResponseDTO> {
    const validated = GetUploadUrlSchema.parse(data);

    const media = MediaAttachment.create({
      filename: validated.filename,
      contentType: validated.contentType,
      size: validated.size,
    });

    const storagePath = StoragePath.build({
      prefix: "temp",
      userId,
      extension: media.extension,
    });

    const uploadUrl = await this.storageProvider.generatePresignedUploadUrl({
      fileKey: storagePath.value,
      contentType: media.mimeType,
      size: media.size,
      expiresInSeconds: 300,
      filename: media.filename,
    });

    const uploadToken = this.tokenProvider.generateToken({
      userId,
      fileKey: storagePath.value,
      purpose: "post_upload",
    });

    return { uploadUrl, uploadToken };
  }
}
