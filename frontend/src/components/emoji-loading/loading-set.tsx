/** @jsx jsx */
import { jsx } from "theme-ui";

import { createAnimation } from "./helpers";

const EMOJIS = ["🐍", "✨", "🍕", "👩‍💻", "🎱", "🎉"];

export const EmojiText = jsx(
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
          animation: `${createAnimation(EMOJIS)} 3s infinite forwards`,
        },
      },
    }
  )
);
