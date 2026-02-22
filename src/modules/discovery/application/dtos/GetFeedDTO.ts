import { z } from "zod";
import type { FeedItem } from "../../domain";

export const GetFeedSchema = z.object({
  cursor: z.string().optional(),
  limit: z.number().int().min(1).max(50).default(20),
  authorId: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export interface GetFeedRequestDTO extends z.infer<typeof GetFeedSchema> {}

export interface GetFeedResponseDTO {
  items: FeedItem[];
  nextCursor: string | null;
  hasMore: boolean;
}
