/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateConvoLink = /* GraphQL */ `
  subscription OnCreateConvoLink($convoLinkUserId: ID!) {
    onCreateConvoLink(convoLinkUserId: $convoLinkUserId) {
      id
      user {
        id
        username
        createdAt
        updatedAt
      }
      convoLinkUserId
      conversation {
        id
        name
        members
        createdAt
        updatedAt
      }
      convoLinkConversationId
      createdAt
      updatedAt
    }
  }
`;
export const onCreateMessage = /* GraphQL */ `
  subscription OnCreateMessage($messageConversationId: ID!) {
    onCreateMessage(messageConversationId: $messageConversationId) {
      id
      author {
        id
        username
        createdAt
        updatedAt
      }
      authorId
      members
      content
      conversation {
        id
        name
        members
        createdAt
        updatedAt
      }
      messageConversationId
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteMessage = /* GraphQL */ `
  subscription OnDeleteMessage($messageConversationId: ID!) {
    onDeleteMessage(messageConversationId: $messageConversationId) {
      id
      author {
        id
        username
        createdAt
        updatedAt
      }
      authorId
      members
      content
      conversation {
        id
        name
        members
        createdAt
        updatedAt
      }
      messageConversationId
      createdAt
      updatedAt
    }
  }
`;
export const onCreateUser = /* GraphQL */ `
  subscription OnCreateUser($id: String!) {
    onCreateUser(id: $id) {
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
export const onUpdateUser = /* GraphQL */ `
  subscription OnUpdateUser($id: String!) {
    onUpdateUser(id: $id) {
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
export const onDeleteUser = /* GraphQL */ `
  subscription OnDeleteUser($id: String!) {
    onDeleteUser(id: $id) {
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
