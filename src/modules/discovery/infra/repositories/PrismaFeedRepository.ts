import type { PrismaClient } from "@prisma/client";
import type { S3ConnectionProvider } from "@/shared/infra/providers";
import type {
  FeedItem,
  FeedQuery,
  FeedResult,
  IFeedRepository,
} from "../../domain";
import { FeedCursor } from "../../domain/valueObjects";

export class PrismaFeedRepository implements IFeedRepository {
  constructor(
    private prisma: PrismaClient,
    private s3Connection: S3ConnectionProvider,
  ) {}

  async query(feedQuery: FeedQuery): Promise<FeedResult> {
    const { limit, cursor, filters } = feedQuery;

    const where: Record<string, unknown> = {
      status: "PUBLISHED",
    };

    if (filters?.authorId) {
      where.author_id = filters.authorId;
    }

    if (filters?.tags && filters.tags.length > 0) {
      where.tags = { hasEvery: filters.tags };
    }

    if (cursor) {
      where.OR = [
        { created_at: { lt: cursor.createdAt } },
        {
          created_at: cursor.createdAt,
          id: { lt: cursor.id },
        },
      ];
    }

    const rows = await this.prisma.post.findMany({
      where,
      orderBy: [{ created_at: "desc" }, { id: "desc" }],
      take: limit + 1,
    });

    const hasMore = rows.length > limit;
    const items = rows.slice(0, limit);

    const feedItems: FeedItem[] = items.map((row) => ({
      id: row.id,
      title: row.title,
      url: this.s3Connection.getPublicUrl(row.storage_path),
      authorId: row.author_id,
      tags: row.tags,
      mimeType: row.mime_type,
      createdAt: row.created_at,
    }));

    const lastItem = items[items.length - 1];
    const nextCursor =
      hasMore && lastItem
        ? FeedCursor.encode(lastItem.created_at, lastItem.id)
        : null;

    return { items: feedItems, nextCursor, hasMore };
  }
}
