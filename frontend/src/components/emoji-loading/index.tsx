import React from "react";

import { EmojiText as LoadingEmojiText } from "./loading-set";

export enum EmojiSet {
  Loading,
}

type Props = {
  set?: EmojiSet;
};

const SETS = {
  [EmojiSet.Loading]: LoadingEmojiText,
};

export const EmojiLoading: React.FC<Props> = ({ set }) => {
  return SETS[set || EmojiSet.Loading];
};
