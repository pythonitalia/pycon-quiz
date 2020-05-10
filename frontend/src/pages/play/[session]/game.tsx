import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { Box } from "theme-ui";

import { Leaderboard } from "../../../components/leaderboard";
import { LoadingUser } from "../../../components/loading-user";
import { QuestionScreen } from "../../../components/question-screen";
import { WaitingForTheGameScreen } from "../../../components/waiting-for-the-game-screen";
import { usePlayerData } from "../../../hooks/auth";
import { useGameMachine } from "../../../hooks/game-machine";

export const Game = () => {
  const router = useRouter();
  const { session } = router.query as { session: string };
  const { playerData } = usePlayerData(session);

  const gameState = useGameMachine(session);

  useEffect(() => {
    if (playerData.token === null) {
      router.push("/play/[session]", `/play/${session}`);
    }
  }, [playerData, session]);

  if (!playerData.loaded) {
    return <LoadingUser />;
  }

  return (
    <Box>
      {gameState.value === "before_start" && <WaitingForTheGameScreen />}
      {gameState.value === "live" && (
        <QuestionScreen
          question={gameState.context.question}
          sessionId={session}
          playerData={playerData}
        />
      )}
      {gameState.value === "complete" && <Leaderboard />}
    </Box>
  );
};

export default Game;

export const getServerSideProps: GetServerSideProps = async (context) => ({
  props: {},
});
