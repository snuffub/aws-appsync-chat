import { API, graphqlOperation, Auth } from "aws-amplify";
import {
  getUserAndConversations as GetUserAndConversations,
  createUser,
  createConvo,
  createConvoLink,
} from "../graphql";

import { observable, decorate } from "mobx";

class User {
  username = "";
  email = "";
  myActivityId = "";

  async init() {
    try {
      const user = await Auth.currentAuthenticatedUser();
      this.username = user.username;
      this.email = user.signInUserSession.idToken.payload.email;
    } catch (err) {
      console.log("error getting user data... ", err);
    }
    // check if user exists in db, if not then create user
    if (this.username !== "") {
      this.checkIfUserExists(this.username);
    }
  }

  async checkIfUserExists(id) {
    try {
      const user = await API.graphql(
        graphqlOperation(GetUserAndConversations, { id })
      );
      const { getUser } = user.data;
      if (!getUser) {
        this.createUser();
      } else {
        this.myActivityId = getUser.conversations.items[0].conversation.id;
      }
    } catch (err) {
      console.log("error fetching user: ", err);
    }
  }

  async createUser() {
    try {
      console.log("Creating User: ", this.username);
      await API.graphql(
        graphqlOperation(createUser, { username: this.username })
      );
    } catch (err) {
      console.log("Error creating user! :", err);
    }
    try {
      const username = this.username;
      const members = [username];
      const conversationName = members + "'s Activity";
      const convo = { name: conversationName, members };
      const conversation = await API.graphql(
        graphqlOperation(createConvo, convo)
      );
      const {
        data: {
          createConvo: { id: convoLinkConversationId },
        },
      } = conversation;
      const relation = { convoLinkUserId: username, convoLinkConversationId };
      await API.graphql(graphqlOperation(createConvoLink, relation));
      this.myActivityId = convoLinkConversationId;
    } catch (err) {
      console.log("error creating conversation...", err);
    }
  }
}

decorate(User, {
  username: observable,
  email: observable,
  myActivityId: observable,
});

export default new User();
