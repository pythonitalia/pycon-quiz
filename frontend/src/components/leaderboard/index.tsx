import React from "react";
import { Box, Grid, Heading } from "theme-ui";

import { LeaderboardPartecipant } from "../../types";
import { PartecipantScore } from "../partecipant-score";

type Props = {
  leaderboard: LeaderboardPartecipant[];
};

export const Leaderboard: React.FC<Props> = ({ leaderboard }) => (
  <Box
    sx={{
      maxWidth: "52rem",
    }}
    variant="layouts.main"
  >
    <Heading
      sx={{
        textAlign: "center",
        mt: ["3rem", "10rem"],
        mb: ["3rem", "6rem"],
      }}
    >
      Leaderboard
    </Heading>

    <Grid
      sx={{
        gridTemplateColumn: "1fr",
        gridGap: "3rem",
        justifyItems: "flex-end",
        width: "100%",
      }}
    >
      {leaderboard.map((partecipant, position) => (
        <PartecipantScore
          key={partecipant.name}
          partecipant={partecipant}
          position={position}
        />
      ))}
    </Grid>
  </Box>
);
