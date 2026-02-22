import { InvalidCursorError } from "../errors";

export interface FeedCursorPayload {
  createdAt: Date;
  id: string;
}

export class FeedCursor {
  private constructor(
    public readonly createdAt: Date,
    public readonly id: string
  ) {}

  static decode(cursor: string): FeedCursor {
    try {
      const decoded = JSON.parse(Buffer.from(cursor, "base64url").toString());
      return new FeedCursor(new Date(decoded.createdAt), decoded.id);
    } catch {
      throw new InvalidCursorError();
    }
  }

  static encode(createdAt: Date, id: string): string {
    return Buffer.from(
      JSON.stringify({ createdAt: createdAt.toISOString(), id }),
    ).toString("base64url");
  }
}
