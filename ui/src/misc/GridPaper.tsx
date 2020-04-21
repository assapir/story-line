import { Grid, makeStyles, Paper } from "@material-ui/core";
import React from "react";

const useStyles = makeStyles((theme) => ({
  paper: {
    flexGrow: 1,
    padding: theme.spacing(2),
    textAlign: `center`,
    color: theme.palette.text.secondary,
  },
}));

interface GridPaperProps {
  text?: string;
  children?: JSX.Element;
}

export default function GridPaper(props: GridPaperProps): JSX.Element {
  const classes = useStyles();

  return (
    <div className={classes.paper}>
      <Grid container item xs={12} spacing={3}>
        <Paper className={classes.paper}>
          <span>{props.text}</span>
          {props.children}
        </Paper>
      </Grid>
    </div>
  );
}
