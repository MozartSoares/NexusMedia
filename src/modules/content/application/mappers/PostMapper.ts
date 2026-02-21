import type { Post } from "../../domain";
import type { PostDto } from "../dtos";

export class PostMapper {
  static toDTO(post: Post, url: string): PostDto {
    return {
      id: post.id,
      title: post.title,
      url,
      authorId: post.author_id,
      size: post.size,
      tags: post.tags,
      mimeType: post.mime_type,
      status: post.status,
      createdAt: post.created_at!,
    };
  }
}
