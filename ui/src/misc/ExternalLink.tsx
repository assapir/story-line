import { makeStyles } from "@material-ui/core";
import React from "react";

const useStyles = makeStyles((theme) => ({
  link: {
    color: theme.palette.text.secondary,
  },
}));

interface ExternalLinkProps {
  src: string;
  text: string;
  newTab?: boolean;
}

export default function ExternalLink(props: ExternalLinkProps): JSX.Element {
  const target: string = props.newTab ? `_blank` : `_self`;
  const rel: string | undefined = props.newTab
    ? `noreferrer noopener`
    : undefined;

  const classes = useStyles();
  return (
    <a href={props.src} target={target} rel={rel} className={classes.link}>
      {props.text}
    </a>
  );
}
