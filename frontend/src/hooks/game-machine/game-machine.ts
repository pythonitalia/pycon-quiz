import { Machine } from "xstate";
import { GameState } from "../../types";

type Context = {
  game: GameState | null;
};

export const gameMachine = Machine<Context>({
  id: "game",
  initial: "unknown",
  states: {
    unknown: {
      on: {
        BEFORE_START: "before_start",
        LIVE: "live",
        COMPLETE: "complete",
      },
    },
    before_start: {
      on: { LIVE: "live" },
    },
    live: {
      on: { NEW_QUESTION: "live", END: "complete" },
    },
    complete: {
      type: "final",
    },
  },
});
