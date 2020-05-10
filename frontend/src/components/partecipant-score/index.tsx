import React from "react";
import { Box, Flex } from "theme-ui";

type Props = {};

export const PartecipantScore: React.SFC<Props> = (props) => {
  return (
    <Flex
      sx={{
        border: "primary",
        width: ["auto", "42rem"],
      }}
    >
      <Box
        sx={{
          flexGrow: 1,
          px: "primaryHorizontal",
          py: "primaryVertical",
          textTransform: "uppercase",
          backgroundColor: "orange",
          display: "flex",
          alignItems: "center",
        }}
      >
        Splact
      </Box>
      <Box
        sx={{
          flexShrink: 0,
          py: "1rem",
          px: "3.6rem",
          borderLeft: "primary",
          display: "flex",
          alignItems: "center",
        }}
      >
        31
      </Box>
    </Flex>
  );
};
