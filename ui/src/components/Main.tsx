import {
  Container,
  createStyles,
  makeStyles,
  Typography,
} from "@material-ui/core";
import React from "react";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      textAlign: `justify`,
      margin: theme.spacing(0, `auto`),
    },
  }),
);

export default function Main(): JSX.Element {
  const classes = useStyles();

  return (
    <Container className={classes.root}>
      <Typography
        component="div"
        style={{ backgroundColor: `#cfe8fc`, height: `100vh` }}
      />
    </Container>
  );
}
