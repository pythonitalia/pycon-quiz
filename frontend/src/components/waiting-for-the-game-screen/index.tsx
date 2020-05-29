import React from "react";
import { Box, Heading } from "theme-ui";

import { EmojiLoading } from "../emoji-loading";

type Props = {};

export const WaitingForTheGameScreen: React.SFC<Props> = (props) => (
  <Box variant="layouts.main">
    <Heading>
      The game will start soon! <EmojiLoading />
    </Heading>
  </Box>
);
