import Box from "@primer/components/src/Box";
import React from "react";
import CommonProps from "../misc/CommonProps";

interface GridBoxProps extends CommonProps {
  text?: string;
}

export default function GridBox(props: GridBoxProps): JSX.Element {
  const boxStyle = {
    textAlign: `center` as const,
  };

  return (
    <Box padding={3} margin={0} style={boxStyle}>
      {props.text ? props.text : null}
      {props.children}
    </Box>
  );
}
