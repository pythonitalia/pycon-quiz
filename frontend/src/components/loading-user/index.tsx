import React from "react";
import { Box, Heading } from "theme-ui";

type Props = {};

export const LoadingUser: React.SFC<Props> = (props) => (
  <Box variant="layouts.center">
    <Heading>
      Please wait while we find you{" "}
      <span aria-label="Woman Detective emoji" role="img">
        🕵️‍♀️
      </span>
    </Heading>
  </Box>
);
