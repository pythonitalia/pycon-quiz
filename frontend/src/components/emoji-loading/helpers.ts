import { keyframes } from "@emotion/core";

export const createAnimation = (EMOJIS) => keyframes`
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
