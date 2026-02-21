import type { Post } from "../entities";

export interface IPostRepository {
  save(post: Post): Promise<Post>;
  findById(id: string): Promise<Post | null>;
}
