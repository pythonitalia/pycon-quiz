import React from "react";
import { Box, Grid, Heading } from "theme-ui";

import { LeaderboardPartecipant } from "../../types";
import { PartecipantScore } from "../partecipant-score";

type Props = {
  leaderboard: LeaderboardPartecipant[];
};

export const Leaderboard: React.SFC<Props> = ({ leaderboard }) => (
  <Box
    sx={{
      maxWidth: "52rem",
      mx: "auto",
      px: "primary",
      flexDirection: "column",
      height: "auto",
      minHeight: "100vh",
    }}
    variant="layouts.center"
  >
    <Heading
      sx={{
        letterSpacing: "0.3em",
        textAlign: "center",
        mt: "10rem",
        mb: "6rem",
      }}
    >
      Leaderboard
    </Heading>

    <Grid
      sx={{
        gridTemplateColumn: "1fr",
        gridGap: "3rem",
        justifyItems: ["center", "flex-end"],
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
