import React from "react";
import ExternalLink from "../misc/ExternalLink";
import "./Footer.scss";

interface FooterProps {
  author: string;
  projectName: string;
  github: string;
}

export default function Footer(props: FooterProps) {
  return (
    <footer className="common">
      <span>Under MIT License</span>
      <span>© {props.author}</span>
      <ExternalLink src={props.github} text={props.projectName} newTab={true} />
    </footer>
  );
}
