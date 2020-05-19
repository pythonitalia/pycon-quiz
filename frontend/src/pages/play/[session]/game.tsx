import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { Box } from "theme-ui";

import { getSessionInfo } from "../../../api/get-session-info";
import { GameLayout } from "../../../components/game-layout";
import { Leaderboard } from "../../../components/leaderboard";
import { LoadingUser } from "../../../components/loading-user";
import { QuestionScreen } from "../../../components/question-screen";
import { WaitingForTheGameScreen } from "../../../components/waiting-for-the-game-screen";
import { useGameMachine } from "../../../hooks/use-game-machine";
import { usePlayerData } from "../../../hooks/use-player-data";
import { QuizSession } from "../../../types";

type Props = {
  quizSession: QuizSession;
};

export const Game: React.FC<Props> = ({ quizSession }) => {
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
    <GameLayout quizSession={quizSession}>
      {gameState.value === "before_start" && <WaitingForTheGameScreen />}
      {gameState.value === "live" && (
        <QuestionScreen
          question={gameState.context.question}
          sessionId={session}
          playerData={playerData}
        />
      )}
      {gameState.value === "complete" && (
        <Leaderboard leaderboard={gameState.context.leaderboard} />
      )}
    </GameLayout>
  );
};

export default Game;

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const quizSession = await getSessionInfo(params.session as string);
  return {
    props: {
      quizSession,
    },
  };
};
