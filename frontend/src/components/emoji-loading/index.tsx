/** @jsx jsx */

import { keyframes } from "@emotion/core";
import React from "react";
import { jsx } from "theme-ui";

type Props = {};

const EMOJIS = ["🐍", "✨", "🍕", "👩‍💻", "🎱", "🎉"];

const ANIMATION = keyframes`
  0% {
    transform: scale(1);
  }

  ${EMOJIS.map(
    (_, index) => `
      ${((index + 1) * 100) / EMOJIS.length}% {
        content: attr(data-emoji-${index});
      }
    `
  )}
`;

const EmojiText = jsx(
  "span",
  EMOJIS.reduce(
    (props, emoji, index) => {
      // eslint-disable-next-line no-param-reassign
      props[`data-emoji-${index}`] = emoji;
      return props;
    },
    {
      sx: {
        "&:after": {
          content: "attr(data-emoji-0)",
          display: "inline-block",
          animation: `${ANIMATION} 3s infinite forwards`,
        },
      },
    }
  )
);

export const EmojiLoading: React.FC<Props> = (props) => {
  return EmojiText;
};
