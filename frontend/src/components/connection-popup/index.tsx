import React from "react";
import { animated, useSpring } from "react-spring";
import { Box } from "theme-ui";

import { EmojiLoading, EmojiSet } from "../emoji-loading";

type Props = {
  visible: boolean;
};

const AnimatedBox = animated(Box);

export const ConnectionPopup: React.SFC<Props> = ({ visible }) => {
  const props = useSpring({
    display: visible ? "block" : "none",
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(100%)",
  });

  return (
    <AnimatedBox
      sx={{
        position: "absolute",
        bottom: ["0", "6rem"],
        left: ["0", "7rem"],

        maxWidth: ["none", "50rem"],
        width: "100%",
        px: "primaryHorizontal",
        py: "primaryVertical",

        backgroundColor: "black",
        color: "white",

        fontSize: "small",
      }}
      style={props}
    >
      Something went wrong{" "}
      <span role="img" aria-label="problems emoji">
        <EmojiLoading set={EmojiSet.Problem} />
      </span>
      ! Please try refreshing the page
    </AnimatedBox>
  );
};
