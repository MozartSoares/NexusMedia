import { beforeEach, describe, expect, it } from "vitest";
import { mockDeep, mockReset } from "vitest-mock-extended";
import {
  createMockFeedItem,
  createMockFeedResult,
} from "@/shared/testing/mocks";
import type { IFeedRepository } from "../../../domain";
import { FeedCursor } from "../../../domain";
import { GetFeed } from "../GetFeed";

describe("GetFeed UseCase", () => {
  const mockFeedRepository = mockDeep<IFeedRepository>();

  let useCase: GetFeed;

  beforeEach(() => {
    mockReset(mockFeedRepository);
    useCase = new GetFeed(mockFeedRepository);
  });

  it("should successfully fetch feed without cursor", async () => {
    const mockResult = createMockFeedResult({
      items: [
        createMockFeedItem({
          id: "post-1",
          title: "Post 1",
          url: "https://cdn.com/1.png",
          authorId: "user-1",
          createdAt: new Date("2026-02-22T10:00:00Z"),
        }),
      ],
      nextCursor: "encoded-cursor-1",
      hasMore: false,
    });

    mockFeedRepository.query.mockResolvedValue(mockResult);

    const result = await useCase.execute({
      limit: 10,
    });

    expect(result).toEqual(mockResult);
    expect(mockFeedRepository.query).toHaveBeenCalledWith({
      limit: 10,
      cursor: undefined,
      filters: { authorId: undefined, tags: undefined },
    });
  });

  it("should successfully fetch feed with cursor and filters", async () => {
    const mockResult = createMockFeedResult({
      items: [],
      nextCursor: null,
      hasMore: false,
    });

    const mockDate = new Date("2026-02-22T09:00:00Z");
    const validEncodedCursor = FeedCursor.encode(mockDate, "post-2");

    mockFeedRepository.query.mockResolvedValue(mockResult);

    const result = await useCase.execute({
      limit: 5,
      authorId: "user-2",
      tags: ["test"],
      cursor: validEncodedCursor,
    });

    expect(result).toEqual(mockResult);
    expect(mockFeedRepository.query).toHaveBeenCalledWith({
      limit: 5,
      cursor: expect.any(Object),
      filters: { authorId: "user-2", tags: ["test"] },
    });
  });

  it("should throw an error if limits/filters are invalid", async () => {
    await expect(
      useCase.execute({
        limit: 200,
      }),
    ).rejects.toThrow();
  });
});
