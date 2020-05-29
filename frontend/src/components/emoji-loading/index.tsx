import React from "react";

type Props = {};

export const EmojiLoading: React.FC<Props> = (props) => {
  return (
    <span role="img" aria-label="loading emoji">
      🐍
    </span>
  );
};
