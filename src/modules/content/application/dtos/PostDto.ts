export interface PostDto {
  id: string;
  title: string;
  url: string;
  authorId: string;
  size: number;
  tags: string[];
  mimeType: string;
  status: string;
  createdAt: Date;
}
