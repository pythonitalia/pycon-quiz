import React from "react";
import { Box, Grid, Heading } from "theme-ui";

import { LeaderboardPartecipant } from "../../types";
import { PartecipantScore } from "../partecipant-score";

type Props = {
  leaderboard: LeaderboardPartecipant[];
};

export const Leaderboard: React.SFC<Props> = ({ leaderboard }) => {
  return (
    <Box
      sx={{
        maxWidth: "46rem",
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

      <Grid sx={{ gridTemplateColumn: "1fr", gridGap: "3rem" }}>
        {leaderboard.map((partecipant) => (
          <PartecipantScore key={partecipant.name} partecipant={partecipant} />
        ))}
      </Grid>
    </Box>
  );
};
