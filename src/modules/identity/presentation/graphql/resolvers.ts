import { PrismaUserRepository } from "../../infra/repositories";
import { hashProvider,tokenProvider,prisma } from "@/shared";
import { RegisterUser,AuthenticateUser,FindUser } from "../../application/useCases";
import type { Resolvers } from "@/generated/graphql";

// --- COMPOSITION ROOT  ---
const userRepository = new PrismaUserRepository(prisma);

// use cases
const registerUser = new RegisterUser(userRepository, hashProvider);
const authenticateUser = new AuthenticateUser(userRepository, hashProvider, tokenProvider);
const findUser = new FindUser(userRepository);

export const identityResolvers: Resolvers = {
  Mutation: {
    register: async (_, {input}) => {
      return await registerUser.execute(input);
    },

    login: async (_, {input}) => {
      return await authenticateUser.execute(input);
    }
  },

  Query: {
    me: async (_, __, context) => {
      if (!context.user) {
        throw new Error("Unauthorized");
      }
      
      return await findUser.execute(context.user.id);
    }
  }
};