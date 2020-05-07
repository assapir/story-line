import { Link } from "@primer/components";
import React from "react";

interface ExternalLinkProps {
  href: string;
  text: string;
  newTab?: boolean;
}

export const ExternalLink = (props: ExternalLinkProps) => {
  const target: string = props.newTab ? `_blank` : `_self`;
  const rel: string | undefined = props.newTab
    ? `noreferrer noopener`
    : undefined;

  return (
    <Link href={props.href} target={target} rel={rel}>
      {props.text}
    </Link>
  );
};
