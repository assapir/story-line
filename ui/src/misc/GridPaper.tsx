import { Grid, makeStyles, Paper } from "@material-ui/core";
import React from "react";
import CommonProps from "./CommonProps";

const useStyles = makeStyles((theme) => ({
  paper: {
    flexGrow: 1,
    padding: theme.spacing(2),
    textAlign: `center`,
    color: theme.palette.text.secondary,
  },
}));

interface GridPaperProps extends CommonProps {
  text?: string;
}

export default function GridPaper(props: GridPaperProps): JSX.Element {
  const classes = useStyles();

  return (
    <div className={classes.paper}>
      <Grid container item xs={12} spacing={3}>
        <Paper className={classes.paper}>
          {props.text ? <span>{props.text}</span> : null}
          {props.children}
        </Paper>
      </Grid>
    </div>
  );
}
