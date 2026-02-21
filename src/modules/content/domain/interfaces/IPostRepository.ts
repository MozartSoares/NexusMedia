import type { Post } from "../entities";
import type { PostStatus } from "../entities/Post";

export interface IPostRepository {
  save(post: Post): Promise<Post>;
  findById(id: string): Promise<Post | null>;
  updateStatus(id: string, status: PostStatus): Promise<void>;
}
