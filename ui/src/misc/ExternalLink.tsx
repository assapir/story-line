import React from "react";
import "./ExternalLink.scss";

interface ExternalLinkProps {
  src: string;
  text: string;
  newTab?: boolean;
}

export default function ExternalLink(props: ExternalLinkProps) {
  const target: string = props.newTab ? `_blank` : `_self`;
  const rel: string | undefined = props.newTab
    ? `noreferrer noopener`
    : undefined;
  return (
    <a href={props.src} target={target} rel={rel}>
      {props.text}
    </a>
  );
}
