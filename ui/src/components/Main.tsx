import { createStyles, makeStyles, Paper } from "@material-ui/core";
import React from "react";
import CommonProps from "../misc/CommonProps";

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      flexGrow: 1,
    },
  }),
);

export default function Main(props: CommonProps): JSX.Element {
  const classes = useStyles();

  return (
    <Paper className={classes.root} square>
      {props.children}
    </Paper>
  );
}
