import type { Resolvers } from "@/generated/graphql";
import { prisma } from "@/shared";
import { CreatePost, GetUploadUrl } from "../../application/useCases";
import { UnauthorizedError } from "../../domain/errors";
import {
  JwtUploadTokenProvider,
  PrismaPostRepository,
  S3StorageProvider,
} from "../../infra";

const s3Config = {
  endpoint: process.env.STORAGE_ENDPOINT || "http://localhost:9000",
  region: process.env.STORAGE_REGION || "auto",
  accessKeyId: process.env.STORAGE_ACCESS_KEY || "minioadmin",
  secretAccessKey: process.env.STORAGE_SECRET_KEY || "minioadmin",
  bucketName: process.env.STORAGE_BUCKET_NAME || "nexusmedia-content",
  publicUrl:
    process.env.STORAGE_PUBLIC_URL ||
    "http://localhost:9000/nexusmedia-content",
};

const postRepository = new PrismaPostRepository(prisma);
const storageProvider = new S3StorageProvider(s3Config);
const tokenProvider = new JwtUploadTokenProvider();

const createPostUseCase = new CreatePost(
  postRepository,
  storageProvider,
  tokenProvider,
);
const getUploadUrlUseCase = new GetUploadUrl(storageProvider, tokenProvider);

export const contentResolvers: Resolvers = {
  Mutation: {
    getUploadUrl: async (_, { input }, context) => {
      if (!context.user) {
        throw new UnauthorizedError();
      }

      const result = await getUploadUrlUseCase.execute({
        data: input,
        userId: context.user.id,
      });

      return result;
    },

    createPost: async (_, { input }, context) => {
      if (!context.user) {
        throw new UnauthorizedError();
      }
      const data = {
        ...input,
        tags: input.tags || [],
      };

      const result = await createPostUseCase.execute({
        data,
        userId: context.user.id,
      });

      return {
        post: {
          ...result.post,
          createdAt: result.post.createdAt.toISOString(),
        },
      };
    },
  },
};
