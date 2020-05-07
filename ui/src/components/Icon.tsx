import { CircleOcticon } from "@primer/components";
import React from "react";
import { ExternalLink } from "./ExternalLink";

export interface IconProps {
  href?: string;
}

export const Icon = (props: IconProps) => {
    const child = props.href ? (
      <ExternalLink href={props.href as string} />
    ) : null;

    return <CircleOcticon icon={`git-branch`}>{child}</CircleOcticon>;
};
