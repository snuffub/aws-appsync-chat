/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createUser = /* GraphQL */ `
  mutation CreateUser(
    $input: CreateUserInput!
    $condition: ModelUserConditionInput
  ) {
    createUser(input: $input, condition: $condition) {
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
export const updateUser = /* GraphQL */ `
  mutation UpdateUser(
    $input: UpdateUserInput!
    $condition: ModelUserConditionInput
  ) {
    updateUser(input: $input, condition: $condition) {
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
export const deleteUser = /* GraphQL */ `
  mutation DeleteUser(
    $input: DeleteUserInput!
    $condition: ModelUserConditionInput
  ) {
    deleteUser(input: $input, condition: $condition) {
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
export const createConvo = /* GraphQL */ `
  mutation CreateConvo(
    $input: CreateConversationInput!
    $condition: ModelConversationConditionInput
  ) {
    createConvo(input: $input, condition: $condition) {
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
export const createMessage = /* GraphQL */ `
  mutation CreateMessage(
    $input: CreateMessageInput!
    $condition: ModelMessageConditionInput
  ) {
    createMessage(input: $input, condition: $condition) {
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
export const updateMessage = /* GraphQL */ `
  mutation UpdateMessage(
    $input: UpdateMessageInput!
    $condition: ModelMessageConditionInput
  ) {
    updateMessage(input: $input, condition: $condition) {
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
export const deleteMessage = /* GraphQL */ `
  mutation DeleteMessage(
    $input: DeleteMessageInput!
    $condition: ModelMessageConditionInput
  ) {
    deleteMessage(input: $input, condition: $condition) {
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
export const createConvoLink = /* GraphQL */ `
  mutation CreateConvoLink(
    $input: CreateConvoLinkInput!
    $condition: ModelConvoLinkConditionInput
  ) {
    createConvoLink(input: $input, condition: $condition) {
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
export const updateConvoLink = /* GraphQL */ `
  mutation UpdateConvoLink(
    $input: UpdateConvoLinkInput!
    $condition: ModelConvoLinkConditionInput
  ) {
    updateConvoLink(input: $input, condition: $condition) {
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
