import { Grid, makeStyles } from "@material-ui/core";
import React from "react";
import ExternalLink from "../misc/ExternalLink";
import GridPaper from "../misc/GridPaper";

interface FooterProps {
  author: string;
  projectName: string;
  github: string;
}

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
  },
}));

export default function Footer(props: FooterProps): JSX.Element {
  const classes = useStyles();
  const copyrightText = `©  ${props.author}`;

  return (
    <div className={classes.root}>
      <Grid container spacing={1}>
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
    </div>
  );
}
