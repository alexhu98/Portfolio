import gql from 'graphql-tag'

export const typeDefs = gql`
  type User {
    id: ID!
    email: String!
    createdAt: Int!
  }

  input SignUpInput {
    email: String!
    password: String!
  }

  input SignInInput {
    email: String!
    password: String!
  }

  type SignUpPayload {
    user: User!
  }

  type SignInPayload {
    user: User!
  }

  type Article {
    id: String!
    title: String!
    summary: String!
    content: String!
  }

  input CreateArticleInput {
    title: String!
    summary: String!
    content: String!
  }

  input UpdateArticleInput {
    id: String!
    title: String!
    summary: String!
    content: String!
  }

  input DeleteArticleInput {
    id: String!
  }

  type Query {
    # user(id: ID!): User!
    users: [User]!
    viewer: User
    articles: [Article]!
    article(id: String!): Article!
  }

  type Mutation {
    signUp(input: SignUpInput!): SignUpPayload!
    signIn(input: SignInInput!): SignInPayload!
    signOut: Boolean!

    createArticle(input: CreateArticleInput!): Article!
    updateArticle(input: UpdateArticleInput!): Article!
    deleteArticle(input: DeleteArticleInput!): Boolean!
  }
`
