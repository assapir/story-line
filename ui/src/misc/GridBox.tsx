import Box from "@primer/components/src/Box";
import Grid from "@primer/components/src/Grid";
import React from "react";
import CommonProps from "./CommonProps";

interface GridPaperProps extends CommonProps {
  text?: string;
}

export default function GridBox(props: GridPaperProps): JSX.Element {

  return (
    <div>
      <Grid>
        <Box p={3} m={0}>
          {props.text ? props.text : null}
          {props.children}
        </Box>
      </Grid>
    </div>
  );
}
