import { AppBar, Button, Container, IconButton, Toolbar, Typography } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import MenuIcon from "@material-ui/icons/Menu";
import React from "react";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
  }),
);

interface ButtonAppBarProps {
  appName: string;
  buttonText: string;
}

export default function ButtonAppBar(props: ButtonAppBarProps): JSX.Element {
  const classes = useStyles();

  return (
    <Container maxWidth="lg">
      <AppBar position="static" color="transparent">
          <Toolbar>
            <IconButton
              edge="start"
              className={classes.menuButton}
              color="inherit"
              aria-label="menu"
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              {props.appName}
            </Typography>
            <Button color="inherit">{props.buttonText}</Button>
          </Toolbar>
      </AppBar>
    </Container>
  );
}
