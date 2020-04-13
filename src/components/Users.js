import React from "react";
import { graphql } from "react-apollo";

import flowright from "lodash.flowright";
import { css } from "glamor";
import { FaUser, FaChevronRight } from "react-icons/fa";
import { observer } from "mobx-react";
import { Link } from "react-router-dom";

import { primary } from "../theme";
import { listUsers, onCreateUser as OnCreateUser } from "../graphql";
import UserStore from "../mobx/UserStore";

class Users extends React.Component {
  state = { userForConvo: {} };
  componentDidMount() {
    this.props.subscribeToNewMessages();
  }
  render() {
    const { username } = UserStore;
    const users = this.props.users.filter(u => u.username !== username);
    return (
      <div {...css(styles.container)}>
        <p {...css(styles.title)}>Supporters</p>
        {users.map((u, i) => (
          <Link
            to={`conversation/${
              u.conversations.items[0]
                ? u.conversations.items[0].conversation.id
                : ""
            }/${u.username + "'s Activity"}`}
            {...css(styles.link)}
            key={i}
            {...css(styles.user)}>
            <FaUser />
            <p {...css(styles.username)}>{u.username}</p>
            <div {...css(styles.plusIconContainer)}>
              <FaChevronRight />
            </div>
          </Link>
        ))}
      </div>
    );
  }
}

const styles = {
  link: {
    textDecoration: "none",
    color: "black"
  },
  plusIconContainer: {
    display: "flex",
    flex: 1,
    justifyContent: "flex-end"
  },
  username: {
    margin: 0,
    marginLeft: 10
  },
  user: {
    display: "flex",
    padding: 15,
    backgroundColor: "#ededed",
    borderRadius: 20,
    marginTop: 10,
    cursor: "pointer"
  },
  container: {
    padding: 10
  },
  title: {
    fontSize: 20,
    fontWeight: 500,
    margin: 0,
    borderBottom: `2px solid ${primary}`,
    paddingBottom: 4
  }
};

const UsersWithData = flowright(
  graphql(listUsers, {
    options: {
      fetchPolicy: "cache-and-network"
    },
    props: props => {
      return {
        users: props.data.listUsers ? props.data.listUsers.items : [],
        subscribeToNewMessages: () => {
          props.data.subscribeToMore({
            document: OnCreateUser,
            updateQuery: (
              prev,
              {
                subscriptionData: {
                  data: { onCreateUser }
                }
              }
            ) => {
              let userArray = prev.listUsers.items.filter(
                u => u.id !== onCreateUser.id
              );
              userArray = [...userArray, onCreateUser];
              console.log("userArray:", userArray);

              return {
                ...prev,
                listUsers: {
                  ...prev.listUsers,
                  items: userArray
                }
              };
            }
          });
        }
      };
    }
  })
)(Users);

export default observer(UsersWithData);
