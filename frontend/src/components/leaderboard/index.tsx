import React, { useState } from "react";
import { Box, Grid, Heading, Text } from "theme-ui";

import { LeaderboardParticipant } from "../../types";
import { NamePositionScrollHelper } from "../name-position-scroll-helper";
import { ParticipantScore } from "../participant-score";

type Props = {
  leaderboard: LeaderboardParticipant[];
  playerName: string;
};

const pluralRules = new Intl.PluralRules("default", {
  type: "ordinal",
});

const ordinalSuffix = {
  one: "st",
  two: "nd",
  few: "rd",
  other: "th",
};

const leaderboardPositionToEmoji = (position) => {
  if (position >= 1 && position <= 3) {
    return "🎉";
  }

  if (position > 3 && position <= 5) {
    return "✨";
  }

  if (position > 5 && position <= 10) {
    return "👌";
  }

  return "😢";
};

const formatOrdinalNumber = (number) =>
  `${number}${ordinalSuffix[pluralRules.select(number)]}`;

export const Leaderboard: React.FC<Props> = ({ leaderboard, playerName }) => {
  const [currentPlayerTag, setCurrentPlayerTag] = useState(null);
  const userPosition = leaderboard.findIndex((p) => p.name === playerName) + 1;
  const emoji = leaderboardPositionToEmoji(userPosition);

  return (
    <Box
      sx={{
        maxWidth: "55rem",
      }}
      variant="layouts.main"
    >
      <Heading
        sx={{
          textAlign: "center",
          mt: ["3rem", "10rem"],
          mb: ["1rem", "2rem"],
        }}
      >
        Leaderboard
      </Heading>

      <Text
        sx={{
          mb: ["3rem", "6rem"],
        }}
      >
        Well done{" "}
        <span role="img" aria-label="emoji">
          {emoji}
        </span>{" "}
        You are {formatOrdinalNumber(userPosition)}!
      </Text>

      <Grid
        sx={{
          gridTemplateColumn: "1fr",
          gridGap: "3rem",
          justifyItems: "flex-end",
          width: "100%",
        }}
      >
        {leaderboard.map((participant, position) => (
          <ParticipantScore
            ref={playerName === participant.name ? setCurrentPlayerTag : null}
            showCurrentPlayerMarker={playerName === participant.name}
            key={participant.name}
            participant={participant}
            position={position}
          />
        ))}
      </Grid>

      <NamePositionScrollHelper currentPlayerTag={currentPlayerTag} />
    </Box>
  );
};
