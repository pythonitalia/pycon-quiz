import { useMachine } from "@xstate/react";
import { useEffect, useRef } from "react";

import { GameStateSubscription, useGameStateSubscription } from "../../types";
import { gameMachine } from "./game-machine";

const newGameMessageHandler = (prev, response) => response;

export const useGameMachine = (sessionId: string) => {
  const [{ data, fetching, error }] = useGameStateSubscription<
    GameStateSubscription
  >(
    {
      variables: {
        sessionId,
      },
    },
    newGameMessageHandler
  );

  const [current, send] = useMachine(gameMachine);

  useEffect(() => {
    if (!data) {
      return;
    }

    switch (data.playGame.status) {
      case "draft": {
        send("BEFORE_START");
        break;
      }
      case "show-correct-answer":
      case "live": {
        send("LIVE", {
          question: data.playGame.currentQuestion,
          currentQuestionChanged: data.playGame.currentQuestionChanged,
          secondsToAnswerQuestion: data.playGame.secondsToAnswerQuestion,
          canAnswerQuestion: data.playGame.canAnswerQuestion,
        });
        break;
      }
      case "show-leaderboard": {
        send("SHOW_LEADERBOARD", {
          leaderboard: data.playGame.leaderboard,
        });
        break;
      }
      case "complete": {
        send("COMPLETE", { leaderboard: data.playGame.leaderboard });
        break;
      }
      default:
        break;
    }
  }, [data]);

  return current;
};
