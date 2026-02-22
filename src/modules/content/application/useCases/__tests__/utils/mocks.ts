import { faker } from "@faker-js/faker";
import { vi } from "vitest";
import type { Post } from "../../../../domain";

export const createMockPost = (overrides?: Partial<Post>): Post => {
  return {
    id: faker.string.uuid(),
    title: faker.lorem.sentence(),
    storage_path: `uploads/posts/${faker.string.uuid()}.jpg`,
    filename: faker.system.fileName(),
    author_id: faker.string.uuid(),
    size: faker.number.int({ min: 1000, max: 10_000_000 }),
    tags: [faker.word.sample(), faker.word.sample()],
    mime_type: "image/jpeg",
    status: "PUBLISHED" as const,
    created_at: faker.date.recent(),
    updateStatus: vi?.fn(),
    ...overrides,
  } as Post;
};
