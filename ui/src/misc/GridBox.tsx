import Box from "@primer/components/src/Box";
import React from "react";
import CommonProps from "./CommonProps";

interface GridPaperProps extends CommonProps {
  text?: string;
}

export default function GridBox(props: GridPaperProps): JSX.Element {
  const divStyle = {
    textAlign: `center` as const,
  };

  return (
    <div style={divStyle}>
      <Box padding={3} margin={0}>
        {props.text ? props.text : null}
        {props.children}
      </Box>
    </div>
  );
}
