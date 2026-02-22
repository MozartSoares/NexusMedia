export interface FeedItem {
  id: string;
  title: string;
  url: string;
  authorId: string;
  tags: string[];
  mimeType: string;
  createdAt: Date;
}
