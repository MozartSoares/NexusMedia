import type { IFeedRepository } from "../../domain";
import { FeedCursor } from "../../domain/valueObjects";
import { type GetFeedRequestDTO, type GetFeedResponseDTO, GetFeedSchema } from "../dtos";

export class GetFeed {
  constructor(private feedRepository: IFeedRepository) {}

  async execute(data: GetFeedRequestDTO): Promise<GetFeedResponseDTO> {
    const validated = GetFeedSchema.parse(data);

    const cursor = validated.cursor
      ? FeedCursor.decode(validated.cursor)
      : undefined;

    const result = await this.feedRepository.query({
      limit: validated.limit,
      cursor,
      filters: {
        authorId: validated.authorId,
        tags: validated.tags,
      },
    });

    return result;
  }
}
