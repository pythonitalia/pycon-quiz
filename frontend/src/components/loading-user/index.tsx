import React from "react";
import { Box, Heading } from "theme-ui";

import { EmojiLoading } from "../emoji-loading";

type Props = {};

export const LoadingUser: React.SFC<Props> = (props) => (
  <Box variant="layouts.main">
    <Heading>
      Please wait while we find you <EmojiLoading />
    </Heading>
  </Box>
);
