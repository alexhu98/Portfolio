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
    id: ID!
    title: String!
    summary: String!
    content: String!
    sectionName: String!
    createdAt: Int!
    updatedAt: Int!
  }

  type Query {
    # user(id: ID!): User!
    users: [User]!
    viewer: User
    articles: [Article]!
  }

  type Mutation {
    signUp(input: SignUpInput!): SignUpPayload!
    signIn(input: SignInInput!): SignInPayload!
    signOut: Boolean!
  }
`