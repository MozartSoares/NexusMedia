import { faker } from "@faker-js/faker";
import type { FeedItem, FeedResult } from "../../../../domain";

export const createMockFeedItem = (overrides?: Partial<FeedItem>): FeedItem => {
  return {
    id: faker.string.uuid(),
    title: faker.lorem.sentence(),
    url: faker.internet.url(),
    authorId: faker.string.uuid(),
    tags: [faker.word.sample(), faker.word.sample()],
    mimeType: "image/jpeg",
    createdAt: faker.date.recent(),
    ...overrides,
  };
};

export const createMockFeedResult = (
  overrides?: Partial<FeedResult>,
): FeedResult => {
  return {
    items: [createMockFeedItem(), createMockFeedItem()],
    nextCursor: faker.string.alphanumeric(10),
    hasMore: faker.datatype.boolean(),
    ...overrides,
  };
};
