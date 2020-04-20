import React from "react";
import * as Resources from "../resources";
import "./App.scss";
import "./Common.scss";
import Footer from "./Footer";
import Main from "./Main";
import NavBar from "./NavBar";

export default function App() {
  return (
    <div className="app">
      <NavBar />
      <Main />
      <Footer
        author={Resources.author}
        projectName={Resources.projectName}
        github={Resources.githubAddress}
      />
    </div>
  );
}
