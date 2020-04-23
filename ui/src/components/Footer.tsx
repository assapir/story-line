import { Grid } from "@material-ui/core";
import React from "react";
import ExternalLink from "../misc/ExternalLink";
import GridPaper from "../misc/GridPaper";

interface FooterProps {
  author: string;
  projectName: string;
  github: string;
}

export default function Footer(props: FooterProps): JSX.Element {
  const copyrightText = `©  ${props.author}`;

  return (
    <Grid container justify="center">
      <GridPaper text="Under MIT License" />
      <GridPaper text={copyrightText} />
      <GridPaper>
        <ExternalLink
          src={props.github}
          text={props.projectName}
          newTab={true}
        />
      </GridPaper>
    </Grid>
  );
}
