import React from "react";

import { graphql } from "react-apollo";
import flowright from "lodash.flowright";
import { observer } from "mobx-react";
import { css } from "glamor";
import uuid from "uuid/v4";

import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import KitchenOutlinedIcon from "@material-ui/icons/KitchenOutlined";
import LocalHospitalIcon from "@material-ui/icons/LocalHospital";
import FitnessCenterIcon from "@material-ui/icons/FitnessCenter";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";

import ExerciseModal from "./AddExerciseDialog.js";
import FoodModal from "./AddFoodDialog.js";
import HealthModal from "./AddHealthDialog.js";
import { LogItemFood, LogItemHealth, LogItemExercise } from "./LogItems.js";

import {
  SwipeableList,
  SwipeableListItem,
} from "@sandstreamdev/react-swipeable-list";
import "@sandstreamdev/react-swipeable-list/dist/styles.css";

import UserStore from "../mobx/UserStore";
import {
  getConvo,
  createMessage as CreateMessage,
  onCreateMessage as OnCreateMessage,
  deleteMessage as DeleteMessage,
  onDeleteMessage as OnDeleteMessage,
} from "../graphql";

class MyLog extends React.Component {
  state = {
    messageContent: "",
    openExerciseModal: false,
    openFoodModal: false,
    openHealthModal: false,
  };

  handleOpenModal = (modalStateName) => {
    this.setState({ [modalStateName]: true });
  };

  handleCloseModal = (modalStateName) => {
    this.setState({ [modalStateName]: false });
  };
  handleSaveModal = (values, modalStateName) => {
    console.log("save:", values);
    this.handleCloseModal(modalStateName);
    this.createMessage(values);
  };

  componentDidMount() {
    this.props.subscribeToNewMessages();
    this.props.subscribeToDeleteMessages();
  }

  createMessage = (values) => {
    const contents = JSON.stringify(values);
    const { username } = UserStore;
    const { myActivityId } = UserStore;
    const message = {
      id: uuid(),
      createdAt: Date.now(),
      messageConversationId: myActivityId,
      content: contents,
      authorId: username,
      members: username,
    };
    this.props.createMessage(message);
  };

  deleteMessage = (id) => {
    const input = {
      input: {
        id: id,
      },
    };
    this.props.deleteMessage(input);
  };

  render() {
    let { messages } = this.props;
    messages = messages.sort((a, b) => b.createdAt - a.createdAt);

    return (
      <div {...css(styles.container)}>
        <div {...css(styles.conversationNameContainer)}>
          <ButtonGroup
            {...css(styles.buttonGroup)}
            size="small"
            aria-label="small outlined button group">
            <Button
              onClick={() => this.handleOpenModal("openExerciseModal")}
              {...css(styles.button)}
              color="primary"
              aria-label="add exercise"
              startIcon={<FitnessCenterIcon />}>
              {" "}
              Exercise
            </Button>
            <Button
              onClick={() => this.handleOpenModal("openFoodModal")}
              {...css(styles.button)}
              color="primary"
              aria-label="add Food"
              startIcon={<KitchenOutlinedIcon />}>
              Food
            </Button>
            <Button
              onClick={() => this.handleOpenModal("openHealthModal")}
              {...css(styles.button)}
              color="primary"
              aria-label="add health data"
              startIcon={<LocalHospitalIcon />}>
              Health
            </Button>
          </ButtonGroup>
        </div>
        <div {...css(styles.messagesContainer)}>
          <SwipeableList>
            {messages.map((m, i) => {
              return (
                <SwipeableListItem
                  key={i}
                  swipeRight={{
                    content: (
                      <div {...css(styles.swipeDelete)}>
                        <DeleteOutlineIcon />
                      </div>
                    ),
                    action: () => this.deleteMessage(m.id),
                  }}>
                  {JSON.parse(m.content).logEntrytype === "Food" && (
                    <LogItemFood content={JSON.parse(m.content)} />
                  )}
                  {JSON.parse(m.content).logEntrytype === "Exercise" && (
                    <LogItemExercise content={JSON.parse(m.content)} />
                  )}
                  {JSON.parse(m.content).logEntrytype === "Health" && (
                    <LogItemHealth content={JSON.parse(m.content)} />
                  )}
                </SwipeableListItem>
              );
            })}
          </SwipeableList>
        </div>
        <div ref={(val) => (this.div = val)} {...css(styles.scroller)} />
        <ExerciseModal
          {...this.state}
          onCloseModal={this.handleCloseModal}
          onSaveModal={this.handleSaveModal}
          modalStateName="openExerciseModal"
        />
        <FoodModal
          {...this.state}
          onCloseModal={this.handleCloseModal}
          onSaveModal={this.handleSaveModal}
          modalStateName="openFoodModal"
        />
        <HealthModal
          {...this.state}
          onCloseModal={this.handleCloseModal}
          onSaveModal={this.handleSaveModal}
          modalStateName="openHealthModal"
        />
      </div>
    );
  }
}

const styles = {
  conversationNameContainer: {
    backgroundColor: "#fafafa",
    padding: 20,
    borderBottom: "1px solid #ddd",
    display: "flex",
  },
  buttonGroup: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textDecoration: "none",
    color: "black",
  },
  button: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textDecoration: "none",
    color: "black",
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
    height: "calc(100vh - 177px)",
    overflow: "auto",
  },
  message: {
    borderRadius: 10,
    margin: 10,
    padding: 20,
    overflowWrap: "break-word",
    width: "calc(100vw - 100px)",
  },
  swipeDelete: {
    backgroundColor: "Red",
    color: "white",
    padding: 20,
    alignItems: "center",
    display: "flex",
    height: "100%",
    width: "100%",
    textAlign: "right",
  },
  messageText: {
    margin: 0,
  },
};

const MyLogWithData = flowright(
  graphql(getConvo, {
    options: (props) => {
      const { myActivityId } = UserStore;
      return {
        variables: {
          id: myActivityId,
        },
        fetchPolicy: "cache-and-network",
      };
    },
    props: (props) => {
      const { myActivityId } = UserStore;
      let messages = props.data.getConvo
        ? props.data.getConvo.messages.items
        : [];
      return {
        messages,
        data: props.data,
        subscribeToNewMessages: (params) => {
          props.data.subscribeToMore({
            document: OnCreateMessage,
            variables: { messageConversationId: myActivityId },
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
            variables: { messageConversationId: myActivityId },
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
      const { myActivityId } = UserStore;
      return {
        update: (dataProxy, { data: { createMessage } }) => {
          const query = getConvo;
          const data = dataProxy.readQuery({
            query,
            variables: { id: myActivityId },
          });

          data.getConvo.messages.items = data.getConvo.messages.items.filter(
            (m) => m.id !== createMessage.id
          );

          data.getConvo.messages.items.push(createMessage);

          dataProxy.writeQuery({
            query,
            data,
            variables: { id: myActivityId },
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
      const { myActivityId } = UserStore;
      return {
        update: (dataProxy, { data: { deleteMessage } }) => {
          const query = getConvo;
          const data = dataProxy.readQuery({
            query,
            variables: { id: myActivityId },
          });

          data.getConvo.messages.items = data.getConvo.messages.items.filter(
            (m) => m.id !== deleteMessage.id
          );

          dataProxy.writeQuery({
            query,
            data,
            variables: { id: myActivityId },
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
)(MyLog);

export default observer(MyLogWithData);
