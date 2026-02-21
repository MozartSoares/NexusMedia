export interface GraphQLContext {
  user: {
    id: string;
    username: string;
  } | null;
}
