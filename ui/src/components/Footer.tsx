import { Container, createStyles, Grid, makeStyles, Theme } from "@material-ui/core";
import React from "react";
import ExternalLink from "../misc/ExternalLink";
import GridPaper from "../misc/GridPaper";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
  }),
);
interface FooterProps {
  author: string;
  projectName: string;
  github: string;
}

export default function Footer(props: FooterProps): JSX.Element {
const classes = useStyles();
const copyrightText = `©  ${props.author}`;

return (
    <Container className={classes.root}>
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
    </Container>
  );
}
