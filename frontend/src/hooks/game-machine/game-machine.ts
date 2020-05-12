import { assign, Machine } from "xstate";

import { GameState, LeaderboardPartecipant, Question } from "../../types";

type Context = {
  question: Question | null;
  leaderboard: LeaderboardPartecipant[] | null;
};

export const gameMachine = Machine<Context>({
  id: "game",
  initial: "unknown",
  context: {
    question: null,
    leaderboard: null,
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
        COMPLETE: {
          target: "complete",
          actions: assign({
            leaderboard: (_, event) => event.leaderboard,
          }),
        },
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
        COMPLETE: {
          target: "complete",
          actions: assign({
            leaderboard: (_, event) => event.leaderboard,
          }),
        },
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
          actions: assign({
            leaderboard: (_, event) => event.leaderboard,
          }),
        },
      },
    },
    complete: {
      type: "final",
    },
  },
});
