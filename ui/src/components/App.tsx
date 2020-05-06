import { BaseStyles } from "@primer/components";
import React from "react";
import * as Resources from "../resources";
import { AppBar } from "./AppBar";
import { Footer } from "./Footer";
import { Main } from "./Main";

export const App = () => {
  return (
    <div>
      <BaseStyles>
        <AppBar appName={Resources.projectName} buttonText="login" />
        <Main />
        <Footer
          author={Resources.author}
          projectName={Resources.projectName}
          github={Resources.githubAddress}
        />
      </BaseStyles>
    </div>
  );
};
