import { gql } from "graphql-tag";

export const identityTypeDefs = gql`
  type User {
    id: ID!
    email: String!
    username: String!
  }

  type AuthPayload {
    user: User!
    token: String!
  }

  input RegisterInput {
    email: String!
    username: String!
    password_plain: String!
  }

  input LoginInput {
    email: String!
    password_plain: String!
  }

  type Mutation {
    register(input: RegisterInput!): User!
    login(input: LoginInput!): AuthPayload!
  }

  type Query {
    me: User
  }
`;

export const schema = identityTypeDefs;
