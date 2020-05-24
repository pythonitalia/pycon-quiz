import React from "react";
import { Box, Heading } from "theme-ui";

type Props = {};

export const WaitingForTheGameScreen: React.SFC<Props> = (props) => (
  <Box variant="layouts.main">
    <Heading>
      The game will start soon!{" "}
      <span role="img" aria-label="Snake emoji">
        🐍
      </span>
    </Heading>
  </Box>
);
