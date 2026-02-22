import type { FeedCursorPayload } from "../valueObjects";
import type { FeedItem } from "../entities";

export interface FeedQuery {
  limit: number;
  cursor?: FeedCursorPayload;
  filters?: {
    authorId?: string;
    tags?: string[];
  };
}

export interface FeedResult {
  items: FeedItem[];
  nextCursor: string | null;
  hasMore: boolean;
}

export interface IFeedRepository {
  query(feedQuery: FeedQuery): Promise<FeedResult>;
}
