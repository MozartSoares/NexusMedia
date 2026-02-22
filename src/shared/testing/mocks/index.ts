import { faker } from "@faker-js/faker";
import { vi } from "vitest";
import type { Post } from "@/modules/content/domain";
import type { FeedItem, FeedResult } from "@/modules/discovery/domain";
import type { User } from "@/modules/identity/domain";

export const createMockUser = (overrides?: Partial<User>): User => {
  return {
    id: faker.string.uuid(),
    email: faker.internet.email(),
    username: faker.internet.username(),
    password_hash: faker.internet.password(),
    created_at: faker.date.recent(),
    ...overrides,
  } as User;
};

export const createMockPost = (overrides?: Partial<Post>): Post => {
  return {
    id: faker.string.uuid(),
    title: faker.lorem.sentence(),
    storage_path: `posts/${faker.string.uuid()}`,
    filename: faker.system.fileName(),
    author_id: faker.string.uuid(),
    size: faker.number.int({ min: 1000, max: 1000000 }),
    tags: [faker.word.sample(), faker.word.sample()],
    mime_type: "image/jpeg",
    status: "PUBLISHED",
    created_at: faker.date.recent(),
    // mock methods
    updateStatus: vi?.fn(),
    ...overrides,
  } as Post;
};

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
