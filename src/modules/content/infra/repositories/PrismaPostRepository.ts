import type { PrismaClient } from "@prisma/client";
import {
  type IPostRepository,
  type Post,
  PostFactory,
  type PostStatus,
} from "../../domain";

export class PrismaPostRepository implements IPostRepository {
  constructor(private prisma: PrismaClient) {}

  async save(post: Post): Promise<Post> {
    await this.prisma.post.upsert({
      where: { id: post.id },
      update: {
        title: post.title,
        storage_path: post.storage_path,
        filename: post.filename,
        size: post.size,
        tags: post.tags,
        mime_type: post.mime_type,
        status: post.status,
      },
      create: {
        id: post.id,
        title: post.title,
        storage_path: post.storage_path,
        filename: post.filename,
        author_id: post.author_id,
        size: post.size,
        tags: post.tags,
        mime_type: post.mime_type,
        status: post.status,
        created_at: post.created_at || new Date(),
      },
    });

    return post;
  }

  async findById(id: string): Promise<Post | null> {
    const raw = await this.prisma.post.findUnique({ where: { id } });

    if (!raw) return null;

    return PostFactory.restore(
      {
        title: raw.title,
        storage_path: raw.storage_path,
        filename: raw.filename,
        author_id: raw.author_id,
        size: raw.size,
        tags: raw.tags,
        mime_type: raw.mime_type,
        status: raw.status as PostStatus,
        created_at: raw.created_at,
      },
      raw.id,
    );
  }

  async updateStatus(id: string, status: PostStatus): Promise<void> {
    await this.prisma.post.update({
      where: { id },
      data: { status },
    });
  }
}
