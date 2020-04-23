import { Container, createStyles, makeStyles } from "@material-ui/core";
import React from "react";
import CommonProps from "../misc/CommonProps";

interface MainProps extends CommonProps {
  text?: string;
}

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      textAlign: `justify`,
      margin: theme.spacing(0, `auto`),
    },
  }),
);

export default function Main(props: MainProps): JSX.Element {
  const classes = useStyles();

  return (
    <Container className={classes.root} maxWidth="sm">
      {props.children}
    </Container>
  );
}
