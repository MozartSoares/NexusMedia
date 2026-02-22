import { gql } from "graphql-tag";

export const contentTypeDefs = gql`
  type Post {
    id: ID!
    title: String!
    url: String!
    authorId: String!
    size: Int!
    tags: [String!]!
    mimeType: String!
    status: String!
    createdAt: String!
  }

  type UploadUrlResponse {
    uploadUrl: String!
    uploadToken: String!
  }

  type CreatePostResponse {
    post: Post!
  }

  input GetUploadUrlInput {
    filename: String!
    contentType: String!
    size: Int!
  }

  input CreatePostInput {
    title: String!
    uploadToken: String!
    tags: [String!]
  }

  extend type Mutation {
    getUploadUrl(input: GetUploadUrlInput!): UploadUrlResponse!
    createPost(input: CreatePostInput!): CreatePostResponse!
  }
`;

