import { createRandomId } from "@/shared/idGenerator";
import { MediaAttachment } from "../../domain";
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

    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const fileKey = `uploads/posts/${userId}/${year}/${month}/${day}/${createRandomId()}/${media.filename}.${media.extension}`;

    const uploadUrl = await this.storageProvider.generatePresignedUploadUrl({
      fileKey,
      contentType: media.mimeType,
      size: media.size,
      expiresInSeconds: 300,
    });

    return { uploadUrl, fileKey };
  }
}
