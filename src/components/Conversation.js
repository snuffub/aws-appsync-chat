import React from "react";

import { graphql } from "react-apollo";
import flowright from "lodash.flowright";
import { observer } from "mobx-react";
import { css } from "glamor";
import uuid from "uuid/v4";

import { LogItemFood, LogItemHealth, LogItemExercise } from "./LogItems.js";

import UserStore from "../mobx/UserStore";
import {
  getConvo,
  createMessage as CreateMessage,
  onCreateMessage as OnCreateMessage,
  deleteMessage as DeleteMessage,
  onDeleteMessage as OnDeleteMessage,
} from "../graphql";

class Conversation extends React.Component {
  state = {
    message: "",
  };
  componentDidMount() {
    this.props.subscribeToNewMessages();
    this.props.subscribeToDeleteMessages();
  }
  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };
  createMessage = (e) => {
    if (e.key !== "Enter") {
      return;
    }
    if (this.state.message === "") return;
    const { username } = UserStore;
    const { conversationId } = this.props.match.params;
    const message = {
      id: uuid(),
      createdAt: Date.now(),
      messageConversationId: conversationId,
      content: this.state.message,
      authorId: username,
      members: this.props.data.getConvo.members,
    };
    this.props.createMessage(message);
    this.setState({ message: "" });
  };

  render() {
    const { conversationName } = this.props.match.params;
    let { messages } = this.props;
    messages = messages.sort((a, b) => b.createdAt - a.createdAt);

    return (
      <div>
        <div {...css(styles.conversationNameContainer)}>
          <p {...css(styles.conversationName)}>{conversationName}</p>
        </div>
        <div {...css(styles.messagesContainer)}>
          {messages.map((m, i) => {
            return (
              <div key={i}>
                {JSON.parse(m.content).logEntrytype === "Food" && (
                  <LogItemFood content={JSON.parse(m.content)} />
                )}
                {JSON.parse(m.content).logEntrytype === "Exercise" && (
                  <LogItemExercise content={JSON.parse(m.content)} />
                )}
                {JSON.parse(m.content).logEntrytype === "Health" && (
                  <LogItemHealth content={JSON.parse(m.content)} />
                )}
              </div>
            );
          })}
          <div ref={(val) => (this.div = val)} {...css(styles.scroller)} />
        </div>
      </div>
    );
  }
}

const styles = {
  conversationNameContainer: {
    backgroundColor: "#fafafa",
    padding: 20,
    borderBottom: "1px solid #ddd",
  },
  conversationName: {
    margin: 0,
    fontSize: 16,
    fontWeight: 500,
  },
  scroller: {
    float: "left",
    clear: "both",
  },
  messagesContainer: {
    height: "calc(100vh - 166px)",
    overflow: "scroll",
  },
  message: {
    backgroundColor: "#ededed",
    borderRadius: 10,
    margin: 10,
    padding: 20,
  },
  messageText: {
    margin: 0,
  },
};

const ConversationWithData = flowright(
  graphql(getConvo, {
    options: (props) => {
      const { conversationId } = props.match.params;
      return {
        variables: {
          id: conversationId,
        },
        fetchPolicy: "cache-and-network",
      };
    },
    props: (props) => {
      const { conversationId } = props.ownProps.match.params;
      let messages = props.data.getConvo
        ? props.data.getConvo.messages.items
        : [];
      return {
        messages,
        data: props.data,
        subscribeToNewMessages: (params) => {
          props.data.subscribeToMore({
            document: OnCreateMessage,
            variables: { messageConversationId: conversationId },
            updateQuery: (
              prev,
              {
                subscriptionData: {
                  data: { onCreateMessage },
                },
              }
            ) => {
              let messageArray = prev.getConvo.messages.items.filter(
                (message) => message.id !== onCreateMessage.id
              );
              messageArray = [...messageArray, onCreateMessage];

              return {
                ...prev,
                getConvo: {
                  ...prev.getConvo,
                  messages: {
                    ...prev.getConvo.messages,
                    items: messageArray,
                  },
                },
              };
            },
          });
        },
        subscribeToDeleteMessages: (params) => {
          props.data.subscribeToMore({
            document: OnDeleteMessage,
            variables: { messageConversationId: conversationId },
            updateQuery: (
              prev,
              {
                subscriptionData: {
                  data: { onDeleteMessage },
                },
              }
            ) => {
              let messageArray = prev.getConvo.messages.items.filter(
                (message) => message.id !== onDeleteMessage.id
              );
              return {
                ...prev,
                getConvo: {
                  ...prev.getConvo,
                  messages: {
                    ...prev.getConvo.messages,
                    items: messageArray,
                  },
                },
              };
            },
          });
        },
      };
    },
  }),
  graphql(CreateMessage, {
    options: (props) => {
      const { conversationId } = props.match.params;
      return {
        update: (dataProxy, { data: { createMessage } }) => {
          const query = getConvo;
          const data = dataProxy.readQuery({
            query,
            variables: { id: conversationId },
          });

          data.getConvo.messages.items = data.getConvo.messages.items.filter(
            (m) => m.id !== createMessage.id
          );

          data.getConvo.messages.items.push(createMessage);

          dataProxy.writeQuery({
            query,
            data,
            variables: { id: conversationId },
          });
        },
      };
    },
    props: (props) => ({
      createMessage: (message) => {
        props.mutate({
          variables: message,
          optimisticResponse: {
            createMessage: { ...message, __typename: "Message" },
          },
        });
      },
    }),
  }),
  graphql(DeleteMessage, {
    options: (props) => {
      const { conversationId } = props.match.params;
      return {
        update: (dataProxy, { data: { deleteMessage } }) => {
          const query = getConvo;
          const data = dataProxy.readQuery({
            query,
            variables: { id: conversationId },
          });

          data.getConvo.messages.items = data.getConvo.messages.items.filter(
            (m) => m.id !== deleteMessage.id
          );

          dataProxy.writeQuery({
            query,
            data,
            variables: { id: conversationId },
          });
        },
      };
    },
    props: (props) => ({
      deleteMessage: (input) => {
        props.mutate({
          variables: input,
          optimisticResponse: {
            deleteMessage: { ...input.input, __typename: "Message" },
          },
        });
      },
    }),
  })
  // graphqlMutation(createMessage, getConvo, 'Message')
)(Conversation);

export default observer(ConversationWithData);
