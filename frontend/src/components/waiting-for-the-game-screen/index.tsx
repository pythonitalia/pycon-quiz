import React from "react";
import { Box, Heading } from "theme-ui";

type Props = {};

export const WaitingForTheGameScreen: React.SFC<Props> = (props) => (
  <Box variant="layouts.center">
    <Heading>The game will start soon! 🐍</Heading>
  </Box>
);
