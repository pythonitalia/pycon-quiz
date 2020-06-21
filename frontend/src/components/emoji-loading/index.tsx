import React from "react";

import { EmojiText as LoadingEmojiText } from "./loading-set";
import { EmojiText as ProblemEmojiText } from "./problem-set";

export enum EmojiSet {
  Loading,
  Problem,
}

type Props = {
  set?: EmojiSet;
};

const SETS = {
  [EmojiSet.Loading]: LoadingEmojiText,
  [EmojiSet.Problem]: ProblemEmojiText,
};

export const EmojiLoading: React.FC<Props> = ({ set }) => {
  return SETS[set || EmojiSet.Loading];
};
