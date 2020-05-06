import Grid from "@primer/components/src/Grid";
import React from "react";
import ExternalLink from "../misc/ExternalLink";
import GridBox from "../misc/GridBox";

interface FooterProps {
  author: string;
  projectName: string;
  github: string;
}

export const Footer = (props: FooterProps) => {
  const copyrightText = `©  ${props.author}`;

  return (
    <Grid>
      <GridBox text="Under MIT License" />
      <GridBox text={copyrightText} />
      <GridBox>
        <ExternalLink
          src={props.github}
          text={props.projectName}
          newTab={true}
        />
      </GridBox>
    </Grid>
  );
};
