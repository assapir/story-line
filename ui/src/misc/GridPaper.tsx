import { Grid, makeStyles, Paper } from "@material-ui/core";
import React from "react";
import CommonProps from "./CommonProps";

const useStyles = makeStyles((theme) => ({
  paper: {
    flexGrow: 1,
    padding: theme.spacing(2, 0),
    textAlign: `center`,
  },
}));

interface GridPaperProps extends CommonProps {
  text?: string;
}

export default function GridPaper(props: GridPaperProps): JSX.Element {
  const classes = useStyles();

  return (
    <div className={classes.paper}>
      <Grid item alignItems="center">
        <Paper className={classes.paper} elevation={4}>
          {props.text ? props.text : null}
          {props.children}
        </Paper>
      </Grid>
    </div>
  );
}
