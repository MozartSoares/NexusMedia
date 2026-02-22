import type { Resolvers } from "@/generated/graphql";
import { prisma, s3ConnectionProvider } from "@/shared";
import { GetFeed } from "../../application/useCases";
import { PrismaFeedRepository } from "../../infra";

const feedRepository = new PrismaFeedRepository(prisma, s3ConnectionProvider);

const getFeedUseCase = new GetFeed(feedRepository);

export const discoveryResolvers: Resolvers = {
  Query: {
    feed: async (_, { input }) => {
      const result = await getFeedUseCase.execute({
        cursor: input.cursor ?? undefined,
        tags: input.tags ?? undefined,
        authorId: input.authorId ?? undefined,
        limit: input.limit ?? 20,
      });

      return {
        ...result,
        items: result.items.map((item) => ({
          ...item,
          createdAt: item.createdAt.toISOString(),
        })),
      };
    },
  },
};
