import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { identityTypeDefs, identityResolvers } from '@/modules/identity/presentation/graphql';
import { NextRequest } from 'next/server';
import { GraphQLContext } from '@/shared/graphQlContext';
import { tokenProvider } from '@/shared/infra/providers';

const server = new ApolloServer({
  typeDefs: identityTypeDefs,
  resolvers: identityResolvers,
});

const handler = startServerAndCreateNextHandler<NextRequest>(server, {
  context: async (req: NextRequest): Promise<GraphQLContext> => {
    const authHeader = req.headers.get('authorization') || '';
    if (!authHeader) return {user:null}
    const token = authHeader.split(' ')[1];
    if (!token) return {user:null}
    const payload = tokenProvider.verifyToken(token);

    return { 
      user: payload ? { id: payload.sub, username: payload.username } : null 
    };
  },
});


export { handler as GET, handler as POST };