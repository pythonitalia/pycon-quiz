/* eslint-disable jsx-a11y/accessible-emoji */
import { keyframes } from "@emotion/core";
import React from "react";
import { Box, Flex, Text } from "theme-ui";

import { LeaderboardPartecipant } from "../../types";

type Props = {
  partecipant: LeaderboardPartecipant;
  position: number;
  showCurrentPlayerMarker: boolean;
  ref: React.Ref<HTMLDivElement>;
};

const animation = keyframes`
  0% {
    transform: translateY(0);
  }

  100% {
    transform: translateX(-1rem);
  }
`;

export const PartecipantScore: React.ForwardRefExoticComponent<Props> = React.forwardRef<
  HTMLDivElement,
  Props
>(({ partecipant, position, showCurrentPlayerMarker }, ref) => (
  <Flex
    ref={ref}
    sx={{
      width: "100%",
      position: "relative",
      justifyContent: "flex-end",
    }}
  >
    <Text
      variant="layouts.center"
      as="span"
      sx={{
        fontSize: "header",
        mr: "primary",
        width: ["1.5rem", "3.5rem"],
        animation: `${animation} 500ms linear alternate infinite`,
      }}
      role="img"
      aria-label="Your name marker"
    >
      {showCurrentPlayerMarker && "👉"}
    </Text>
    <Flex
      sx={{
        border: "primary",
        width: [
          position === 0 ? "100%" : "calc(100% - 5rem)",
          position === 0 ? "100%" : "calc(100% - 10rem)",
        ],
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
          wordBreak: "break-all",
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
  </Flex>
));
