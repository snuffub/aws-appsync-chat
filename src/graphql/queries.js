/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getUser = /* GraphQL */ `
  query GetUser($id: ID!) {
    getUser(id: $id) {
      id
      username
      conversations {
        nextToken
      }
      messages {
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
export const listUsers = /* GraphQL */ `
  query ListUsers(
    $filter: ModelUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        username
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getConvo = /* GraphQL */ `
  query GetConvo($id: ID!) {
    getConvo(id: $id) {
      id
      messages {
        nextToken
      }
      associated {
        nextToken
      }
      name
      members
      createdAt
      updatedAt
    }
  }
`;
