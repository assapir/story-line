import Grid from "@primer/components/src/Grid";
import React from "react";
import { ExternalLink } from "./ExternalLink";
import GridBox from "./GridBox";

interface FooterProps {
  author: string;
  projectName: string;
  github: string;
}

export const Footer = (props: FooterProps) => {
  const copyrightText = `©  ${props.author}`;

  return (
      <Grid gridTemplateColumns="repeat(3, auto)" gridGap={0}>
        <GridBox text="Under MIT License" />
        <GridBox text={copyrightText} />
        <GridBox>
          <ExternalLink
            href={props.github}
            text={props.projectName}
            newTab={true}
          />
        </GridBox>
      </Grid>
  );
};
