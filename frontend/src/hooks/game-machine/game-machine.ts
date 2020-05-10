import { assign, Machine } from "xstate";

import { GameState, Question } from "../../types";

type Context = {
  question: Question | null;
};

export const gameMachine = Machine<Context>({
  id: "game",
  initial: "unknown",
  context: {
    question: null,
  },
  states: {
    unknown: {
      on: {
        BEFORE_START: "before_start",
        LIVE: {
          target: "live",
          actions: assign({
            question: (_, event) => event.question,
          }),
        },
        COMPLETE: "complete",
      },
    },
    before_start: {
      on: {
        LIVE: {
          target: "live",
          actions: assign({
            question: (_, event) => event.question,
          }),
        },
        COMPLETE: "complete",
      },
    },
    live: {
      on: {
        LIVE: {
          target: "live",
          actions: assign({
            question: (_, event) => event.question,
          }),
        },
        COMPLETE: {
          target: "complete",
        },
      },
    },
    complete: {
      type: "final",
    },
  },
});
