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
      case "live": {
        send("LIVE", { question: data.playGame.currentQuestion });
        break;
      }
      default:
        break;
    }
  }, [data]);

  return current;
};
