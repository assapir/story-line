import React, { Component } from "react";
import * as Resources from "../resources";
import "./App.scss";
import Footer from "./Footer";

export default class App extends Component {
  public render() {
    return (
      <div className="app">
        <Footer
          author={Resources.author}
          projectName={Resources.projectName}
          github={Resources.githubAddress} />
      </div>
    );
  }
}
