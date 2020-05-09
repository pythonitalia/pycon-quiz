/* eslint-disable react/no-array-index-key */
/** @jsx jsx */
import { keyframes } from "@emotion/core";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Box, Flex, jsx, Text } from "theme-ui";

import { TwitchLogo } from "../twitch-logo";

type Props = {};

const TEXT_TO_DISPLAY = "Watch live on Twitch /";

const animation = keyframes`
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(-100%, 0);
  }
`;

const MarqueeText = React.forwardRef((props, ref) => (
  <Text
    sx={{
      mr: ".5rem",
      flexShrink: 0,
      willChange: "transform",
      animation: `${animation} 10s linear infinite`,
    }}
    ref={ref}
    as="span"
    {...props}
  >
    {TEXT_TO_DISPLAY}
  </Text>
));

export const TwitchBar: React.SFC<Props> = (props) => {
  const referenceText = useRef<HTMLSpanElement>(null);
  const [textsToRender, setTextsToRender] = useState<null[]>([]);

  useEffect(() => {
    const handleResize = () => {
      const textWidth = referenceText.current.clientWidth;
      const countTextsNeededToCoverScreen =
        Math.round(window.innerWidth / textWidth) + 1;

      setTextsToRender(Array(countTextsNeededToCoverScreen).fill(null, 0));
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [referenceText.current]);

  return (
    <Flex
      sx={{
        width: "100%",
        position: "absolute",
        bottom: 0,
        left: 0,
        backgroundColor: "black",
        color: "white",
        textTransform: "uppercase",
        userSelect: "none",
      }}
    >
      <Flex
        sx={{
          flexShrink: 0,
          alignItems: "center",
          justifyContent: "center",
          p: "small",
          m: ".4rem",
          backgroundColor: "red",
        }}
      >
        <TwitchLogo
          sx={{
            width: "2.1rem",
            height: "2.4rem",
          }}
        />
      </Flex>
      <Flex
        sx={{
          alignItems: "center",
          overflow: "hidden",
        }}
      >
        <MarqueeText
          sx={{
            opacity: 0,
            position: "absolute",
          }}
          key="main"
          ref={referenceText}
        />
        {textsToRender.map((_, i) => (
          <MarqueeText key={`rep-${i}`} />
        ))}
      </Flex>
    </Flex>
  );
};
