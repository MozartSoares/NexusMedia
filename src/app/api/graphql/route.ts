import { ApolloServer } from "@apollo/server";
import { unwrapResolverError } from "@apollo/server/errors";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import type { GraphQLFormattedError } from "graphql";
import type { NextRequest } from "next/server";
import { treeifyError, ZodError } from "zod";
import {
  contentResolvers,
  contentTypeDefs,
} from "@/modules/content/presentation";
import {
  identityResolvers,
  identityTypeDefs,
} from "@/modules/identity/presentation";
import { AppError } from "@/shared";
import type { GraphQLContext } from "@/shared/graphQlContext";
import { tokenProvider } from "@/shared/infra/singletons";

const server = new ApolloServer<GraphQLContext>({
  typeDefs: [identityTypeDefs, contentTypeDefs],
  resolvers: [identityResolvers, contentResolvers],
  formatError: (
    formattedError: GraphQLFormattedError,
    error: unknown,
  ): GraphQLFormattedError => {
    const originalError = unwrapResolverError(error);
    if (originalError instanceof AppError) {
      return {
        ...formattedError,
        message: originalError.message,
        extensions: {
          ...formattedError.extensions,
          code: originalError.code,
        },
      };
    }

    if (originalError instanceof ZodError) {
      return {
        ...formattedError,
        message: "Validation error on input data.",
        extensions: {
          ...formattedError.extensions,
          code: "BAD_USER_INPUT",
          fieldErrors: treeifyError(originalError),
        },
      };
    }
    if (process.env.NODE_ENV !== "production") {
      console.error("[GraphQL Error]:", originalError || error);
    } else {
      console.error("Internal server error"); //Sentry.captureException(error);
    }

    return {
      message: "Internal server error",
      extensions: { code: "INTERNAL_SERVER_ERROR" },
    };
  },
});

const handler = startServerAndCreateNextHandler<NextRequest, GraphQLContext>(
  server,
  {
    context: async (req: NextRequest): Promise<GraphQLContext> => {
      const authHeader = req.headers.get("authorization") || "";
      if (!authHeader) return { user: null };
      const token = authHeader.split(" ")[1];
      if (!token) return { user: null };
      const payload = tokenProvider.verifyToken(token);

      return {
        user: payload
          ? { id: payload.sub as string, username: payload.username as string }
          : null,
      };
    },
  },
);

export { handler as GET, handler as POST };
