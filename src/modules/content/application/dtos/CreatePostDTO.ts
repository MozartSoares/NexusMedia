import { z } from "zod";
import type { PostDto } from "./PostDto";

export const CreatePostSchema = z.object({
  title: z.string().min(1, "Title is required"),
  fileKey: z.string().min(1, "File key is required"),
  tags: z.array(z.string()).default([]),
});

export interface CreatePostRequestDTO
  extends z.infer<typeof CreatePostSchema> {}

export interface CreatePostResponseDTO {
  post: PostDto;
}
