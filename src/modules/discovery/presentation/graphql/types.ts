import { gql } from "graphql-tag";

export const discoveryTypeDefs = gql`
  type FeedItem {
    id: ID!
    title: String!
    url: String!
    authorId: String!
    tags: [String!]!
    mimeType: String!
    createdAt: String!
  }

  type FeedResponse {
    items: [FeedItem!]!
    nextCursor: String
    hasMore: Boolean!
  }

  input FeedInput {
    cursor: String
    limit: Int
    authorId: String
    tags: [String!]
  }

  extend type Query {
    feed(input: FeedInput!): FeedResponse!
  }
`;
