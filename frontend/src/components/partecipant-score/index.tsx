import React from "react";
import { Box, Flex } from "theme-ui";

import { LeaderboardPartecipant } from "../../types";

type Props = {
  partecipant: LeaderboardPartecipant;
  position: number;
};

export const PartecipantScore: React.SFC<Props> = ({
  partecipant,
  position,
}) => (
  <Flex
    sx={{
      border: "primary",
      width: position === 0 ? "100%" : "calc(100% - 5rem)",
    }}
  >
    <Box
      sx={{
        flexGrow: 1,
        px: "primaryHorizontal",
        py: "primaryVertical",
        textTransform: "uppercase",
        backgroundColor: partecipant.color,
        display: "flex",
        alignItems: "center",
      }}
    >
      {partecipant.name}
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
      {partecipant.score}
    </Box>
  </Flex>
);
