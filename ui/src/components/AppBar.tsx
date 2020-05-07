import Flex from "@primer/components/src/Flex";
import React from "react";
import { Icon } from "./Icon";

interface ButtonAppBarProps {
  appName: string;
  buttonText: string;
}

export const AppBar = (props: ButtonAppBarProps) => {
  return (
    <Flex flexWrap="nowrap">
      <Icon />
    </Flex>
  );
};
