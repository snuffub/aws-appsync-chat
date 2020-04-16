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

import ExerciseModal from "./AddExerciseDialog.js";
import FoodModal from "./AddFoodDialog.js";
import HealthModal from "./AddHealthDialog.js";

import UserStore from "../mobx/UserStore";
import {
  getConvo,
  createMessage as CreateMessage,
  onCreateMessage as OnCreateMessage
} from "../graphql";

class MyLog extends React.Component {
  state = {
    messageContent: "",
    openExerciseModal: false,
    openFoodModal: false,
    openHealthModal: false
  };

  handleOpenModal = modalStateName => {
    this.setState({ [modalStateName]: true });
  };

  handleCloseModal = modalStateName => {
    this.setState({ [modalStateName]: false });
  };
  handleSaveModal = (values, modalStateName) => {
    this.handleCloseModal(modalStateName);
    this.createMessage(values);
  };

  componentDidMount() {
    this.props.subscribeToNewMessages();
  }

  createMessage = values => {
    const contents = JSON.stringify(values);
    const { username } = UserStore;
    const { myActivityId } = UserStore;
    const message = {
      id: uuid(),
      createdAt: Date.now(),
      messageConversationId: myActivityId,
      content: contents,
      authorId: username,
      members: username
    };
    this.props.createMessage(message);
  };

  render() {
    const { username } = UserStore;
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
          {messages.map((m, i) => {
            return (
              <div
                key={i}
                {...css([
                  styles.message,
                  checkSenderForMessageStyle(username, m)
                ])}>
                <p
                  {...css([
                    styles.messageText,
                    checkSenderForTextStyle(username, m)
                  ])}>
                  {m.content}
                </p>
              </div>
            );
          })}
          <div ref={val => (this.div = val)} {...css(styles.scroller)} />
        </div>
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

function checkSenderForMessageStyle(username, message) {
  if (username === message.authorId) {
    return {
      backgroundColor: "#1b86ff",
      marginLeft: 50
    };
  } else {
    return { marginRight: 50 };
  }
}

function checkSenderForTextStyle(username, message) {
  if (username === message.authorId) {
    return {
      color: "white"
    };
  }
}

const styles = {
  conversationNameContainer: {
    backgroundColor: "#fafafa",
    padding: 20,
    borderBottom: "1px solid #ddd",
    display: "flex"
  },
  buttonGroup: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textDecoration: "none",
    color: "black"
  },
  button: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textDecoration: "none",
    color: "black"
  },

  conversationName: {
    margin: 0,
    fontSize: 16,
    fontWeight: 500
  },
  scroller: {
    float: "left",
    clear: "both"
  },
  messagesContainer: {
    height: "calc(100vh - 219px)",
    overflow: "scroll"
  },
  message: {
    backgroundColor: "#ededed",
    borderRadius: 10,
    margin: 10,
    padding: 20,
    overflowWrap: "break-word"
  },
  messageText: {
    margin: 0
  },
  container: {
    padding: 10
  }
};

const MyLogWithData = flowright(
  graphql(getConvo, {
    options: props => {
      const { myActivityId } = UserStore;
      return {
        variables: {
          id: myActivityId
        },
        fetchPolicy: "cache-and-network"
      };
    },
    props: props => {
      const { myActivityId } = UserStore;
      let messages = props.data.getConvo
        ? props.data.getConvo.messages.items
        : [];
      return {
        messages,
        data: props.data,
        subscribeToNewMessages: params => {
          props.data.subscribeToMore({
            document: OnCreateMessage,
            variables: { messageConversationId: myActivityId },
            updateQuery: (
              prev,
              {
                subscriptionData: {
                  data: { onCreateMessage }
                }
              }
            ) => {
              let messageArray = prev.getConvo.messages.items.filter(
                message => message.id !== onCreateMessage.id
              );
              messageArray = [...messageArray, onCreateMessage];

              return {
                ...prev,
                getConvo: {
                  ...prev.getConvo,
                  messages: {
                    ...prev.getConvo.messages,
                    items: messageArray
                  }
                }
              };
            }
          });
        }
      };
    }
  }),
  graphql(CreateMessage, {
    options: props => {
      const { myActivityId } = UserStore;
      return {
        update: (dataProxy, { data: { createMessage } }) => {
          const query = getConvo;
          const data = dataProxy.readQuery({
            query,
            variables: { id: myActivityId }
          });

          data.getConvo.messages.items = data.getConvo.messages.items.filter(
            m => m.id !== createMessage.id
          );

          data.getConvo.messages.items.push(createMessage);

          dataProxy.writeQuery({
            query,
            data,
            variables: { id: myActivityId }
          });
        }
      };
    },
    props: props => ({
      createMessage: message => {
        props.mutate({
          variables: message,
          optimisticResponse: {
            createMessage: { ...message, __typename: "Message" }
          }
        });
      }
    })
  })
  // graphqlMutation(createMessage, getConvo, 'Message')
)(MyLog);

export default observer(MyLogWithData);
