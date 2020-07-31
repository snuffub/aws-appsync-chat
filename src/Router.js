import React from "react";
import { BrowserRouter } from "react-router-dom";
import { Hub } from "aws-amplify";
import { withAuthenticator  } from '@aws-amplify/ui-react';

import UserStore from "./mobx/UserStore";
import Header from "./components/Header";
import Routes from "./Routes";
import { primary } from "./theme";

class Router extends React.Component {
  state = {
    view: "convos"
  };
  componentDidMount() {
    UserStore.init();
    Hub.listen("auth", data => {
      const { payload } = data;
      this.onAuthEvent(payload);
      console.log(
        "A new auth event has happened: ",
        data.payload.data.username + " has " + data.payload.event
      );
    });
  }
  onAuthEvent(payload) {
    if(payload.event === "signOut"){
      this.setState(() => ({view: "users"}))
    }
  }
  toggleDisplay = view => {
    this.setState(() => ({
      view
    }));
  };
  render() {
    return <Routes />;
  }
}

const routeConfig = {
  theme: {
    button: {
      backgroundColor: primary,
      color: "black"
    },
    a: {
      color: "black"
    }
  }
};

const RouterWithAuth = withAuthenticator(Router, routeConfig);

const AppRouter = () => {
  return (
    <BrowserRouter>
      <div>
        <Header />
        <RouterWithAuth />
      </div>
    </BrowserRouter>
  );
};

export default AppRouter;
