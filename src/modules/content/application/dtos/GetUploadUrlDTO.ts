import { z } from "zod";

export const GetUploadUrlSchema = z.object({
  filename: z.string().min(1, "Filename is required"),
  contentType: z.string().min(1, "Content type is required"),
  size: z.number().int().positive("File size must be a positive integer"),
});

export interface GetUploadUrlRequestDTO
  extends z.infer<typeof GetUploadUrlSchema> {}

export interface GetUploadUrlResponseDTO {
  uploadUrl: string;
  fileKey: string;
}
