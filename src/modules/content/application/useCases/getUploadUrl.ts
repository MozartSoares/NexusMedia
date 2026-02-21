import { MediaAttachment, StoragePath } from "../../domain";
import type { IStorageProvider } from "../../domain/interfaces";
import {
  type GetUploadUrlRequestDTO,
  type GetUploadUrlResponseDTO,
  GetUploadUrlSchema,
} from "../dtos";

export class GetUploadUrl {
  constructor(private storageProvider: IStorageProvider) {}

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

    return { uploadUrl, fileKey: storagePath.value }; // todo later we need to implement UploadToken so we dont expose url
  }
}
