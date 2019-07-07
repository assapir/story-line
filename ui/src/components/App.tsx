import React, { Component } from "react";
import * as Resources from "../resources";
import "./App.scss";
import "./Common.scss";
import Footer from "./Footer";
import Main from "./Main";
import NavBar from "./NavBar";

export default class App extends Component {
  public componentWillMount() {
    document.body.style.backgroundColor = `#A40606`;
  }

  public componentWillUnmount() {
    document.body.style.backgroundColor = null;
  }

  public render() {
    return (
      <div className="app">
        <NavBar />
        <Main />
        <Footer
          author={Resources.author}
          projectName={Resources.projectName}
          github={Resources.githubAddress} />
      </div>
    );
  }
}
