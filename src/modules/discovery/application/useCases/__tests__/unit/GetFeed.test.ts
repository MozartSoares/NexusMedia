import { beforeEach, describe, expect, it } from "vitest";
import { mockDeep, mockReset } from "vitest-mock-extended";
import type { IFeedRepository } from "../../../../domain";
import { FeedCursor } from "../../../../domain";
import { GetFeed } from "../../GetFeed";
import { createMockFeedItem, createMockFeedResult } from "../utils/mocks";

describe("GetFeed UseCase", () => {
  const mockFeedRepository = mockDeep<IFeedRepository>();

  let useCase: GetFeed;

  beforeEach(() => {
    mockReset(mockFeedRepository);
    useCase = new GetFeed(mockFeedRepository);
  });

  it("should fetch feed without cursor", async () => {
    const mockResult = createMockFeedResult({
      items: [createMockFeedItem({ id: "post-1", title: "Post 1" })],
      nextCursor: "cursor-1",
      hasMore: false,
    });

    mockFeedRepository.query.mockResolvedValue(mockResult);

    const result = await useCase.execute({ limit: 10 });

    expect(result).toEqual(mockResult);
    expect(mockFeedRepository.query).toHaveBeenCalledWith({
      limit: 10,
      cursor: undefined,
      filters: { authorId: undefined, tags: undefined },
    });
  });

  it("should fetch feed with cursor and filters", async () => {
    const mockResult = createMockFeedResult({
      items: [],
      nextCursor: null,
      hasMore: false,
    });

    const cursor = FeedCursor.encode(
      new Date("2026-02-22T09:00:00Z"),
      "post-2",
    );
    mockFeedRepository.query.mockResolvedValue(mockResult);

    const result = await useCase.execute({
      limit: 5,
      authorId: "user-2",
      tags: ["test"],
      cursor,
    });

    expect(result).toEqual(mockResult);
    expect(mockFeedRepository.query).toHaveBeenCalledWith({
      limit: 5,
      cursor: expect.any(Object),
      filters: { authorId: "user-2", tags: ["test"] },
    });
  });

  it("should throw for invalid limits", async () => {
    await expect(useCase.execute({ limit: 200 })).rejects.toThrow();
  });
});
