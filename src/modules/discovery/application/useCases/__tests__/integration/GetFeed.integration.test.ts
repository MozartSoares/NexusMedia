import { afterAll, afterEach, beforeEach, describe, expect, it } from "vitest";
import { RegisterUser } from "@/modules/identity/application/useCases/RegisterUser";
import { PrismaUserRepository } from "@/modules/identity/infra/repositories/PrismaUserRepository";
import {
  BCryptHashProvider,
  S3ConnectionProvider,
} from "@/shared/infra/providers";
import {
  cleanupDatabase,
  disconnectTestPrisma,
  getTestPrisma,
} from "@/shared/testing/createTestContext";
import { PrismaFeedRepository } from "../../../../infra/repositories/PrismaFeedRepository";
import { GetFeed } from "../../GetFeed";

describe("GetFeed Integration", () => {
  const prisma = getTestPrisma();
  const s3Connection = new S3ConnectionProvider();
  const feedRepository = new PrismaFeedRepository(prisma, s3Connection);
  const useCase = new GetFeed(feedRepository);

  let authorId: string;

  beforeEach(async () => {
    const userRepository = new PrismaUserRepository(prisma);
    const hashProvider = new BCryptHashProvider();
    const registerUser = new RegisterUser(userRepository, hashProvider);

    const user = await registerUser.execute({
      email: "feed-author@test.com",
      username: "feedauthor",
      password_plain: "Valid1Password!",
    });
    authorId = user.id;

    await prisma.post.createMany({
      data: [
        {
          id: "post-1",
          title: "First Post",
          storage_path: "uploads/posts/1.jpg",
          filename: "1.jpg",
          author_id: authorId,
          size: 1000,
          tags: ["nature", "photo"],
          mime_type: "image/jpeg",
          status: "PUBLISHED",
          created_at: new Date("2026-02-20T10:00:00Z"),
        },
        {
          id: "post-2",
          title: "Second Post",
          storage_path: "uploads/posts/2.jpg",
          filename: "2.jpg",
          author_id: authorId,
          size: 2000,
          tags: ["tech"],
          mime_type: "image/jpeg",
          status: "PUBLISHED",
          created_at: new Date("2026-02-21T10:00:00Z"),
        },
        {
          id: "post-3",
          title: "Third Post",
          storage_path: "uploads/posts/3.jpg",
          filename: "3.jpg",
          author_id: authorId,
          size: 3000,
          tags: ["nature"],
          mime_type: "image/jpeg",
          status: "PUBLISHED",
          created_at: new Date("2026-02-22T10:00:00Z"),
        },
        {
          id: "post-draft",
          title: "Draft Post",
          storage_path: "uploads/posts/draft.jpg",
          filename: "draft.jpg",
          author_id: authorId,
          size: 500,
          tags: [],
          mime_type: "image/jpeg",
          status: "PROCESSING",
          created_at: new Date("2026-02-22T11:00:00Z"),
        },
      ],
    });
  });

  afterEach(async () => {
    await cleanupDatabase();
  });

  afterAll(async () => {
    await disconnectTestPrisma();
  });

  it("should return posts ordered by newest first", async () => {
    const result = await useCase.execute({ limit: 10 });

    expect(result.items.length).toBe(3);
    expect(result.items[0]?.title).toBe("Third Post");
    expect(result.items[1]?.title).toBe("Second Post");
    expect(result.items[2]?.title).toBe("First Post");
    expect(result.hasMore).toBe(false);
  });

  it("should exclude non-PUBLISHED posts", async () => {
    const result = await useCase.execute({ limit: 10 });

    const titles = result.items.map((i) => i.title);
    expect(titles).not.toContain("Draft Post");
  });

  it("should paginate with cursor", async () => {
    const firstPage = await useCase.execute({ limit: 2 });

    expect(firstPage.items.length).toBe(2);
    expect(firstPage.hasMore).toBe(true);
    expect(firstPage.nextCursor).toBeDefined();

    const secondPage = await useCase.execute({
      limit: 2,
      cursor: firstPage.nextCursor!,
    });

    expect(secondPage.items.length).toBe(1);
    expect(secondPage.hasMore).toBe(false);
    expect(secondPage.items[0]?.title).toBe("First Post");
  });

  it("should filter by tags", async () => {
    const result = await useCase.execute({
      limit: 10,
      tags: ["nature"],
    });

    expect(result.items.length).toBe(2);
    const titles = result.items.map((i) => i.title);
    expect(titles).toContain("First Post");
    expect(titles).toContain("Third Post");
  });

  it("should filter by authorId", async () => {
    const result = await useCase.execute({
      limit: 10,
      authorId,
    });

    expect(result.items.length).toBe(3);
  });
});
