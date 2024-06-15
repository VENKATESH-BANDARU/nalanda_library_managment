const { buildSchema } = require('graphql');

module.exports = buildSchema(`
  type User {
    id: ID!
    name: String!
    email: String!
    role: String!
  }

  type Book {
    id: ID!
    title: String!
    author: String!
    ISBN: String!
    publicationDate: String!
    genre: String!
    copies: Int!
  }

  type Borrow {
    id: ID!
    user: User!
    book: Book!
    borrowDate: String!
    returnDate: String
  }

  type Query {
    users: [User!]
    books(genre: String, author: String, page: Int, limit: Int): [Book!]
    borrowHistory: [Borrow!]
  }

  type Mutation {
    register(name: String!, email: String!, password: String!): AuthPayload!
    login(email: String!, password: String!): AuthPayload!
    addBook(title: String!, author: String!, ISBN: String!, publicationDate: String!, genre: String!, copies: Int!): Book!
    updateBook(id: ID!, title: String, author: String, ISBN: String, publicationDate: String, genre: String, copies: Int): Book!
    deleteBook(id: ID!): String!
    borrowBook(bookId: ID!): Borrow!
    returnBook(borrowId: ID!): Borrow!
  }

  type AuthPayload {
    token: String!
    user: User!
  }
`);