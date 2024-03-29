/* eslint-disable react/no-array-index-key */
/** @jsx jsx */
import { keyframes } from "@emotion/core";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { Box, Flex, jsx, Text } from "theme-ui";

import { useHover } from "../../hooks/use-hover";
import { TwitchLogo } from "../twitch-logo";

type Props = {
  url: string;
};

const TEXT_TO_DISPLAY = "Watch live /";
const animation = keyframes`
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(-100%, 0);
  }
`;

const MarqueeContainer: React.FC = ({ children }) => (
  <Flex
    sx={{
      flexShrink: 0,
      willChange: "transform",
      animation: `${animation} 20s linear 100ms infinite`,
    }}
  >
    {children}
  </Flex>
);

const MarqueeText = React.forwardRef((props, ref) => (
  <Text
    sx={{
      mr: ".5rem",
      flexShrink: 0,
    }}
    ref={ref}
    as="span"
    {...props}
  >
    {TEXT_TO_DISPLAY}
  </Text>
));

export const TwitchBar: React.FC<Props> = ({ url }) => {
  const router = useRouter();
  const referenceText = useRef<HTMLSpanElement>(null);
  const [textsToRender, setTextsToRender] = useState<null[]>([]);

  const [twitchLogoRef, twitchLogoHover] = useHover();

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

  const closed = router.route === "/play/[session]/game";
  const barIsClosed = closed && !twitchLogoHover;

  return (
    <Flex
      sx={{
        width: "100%",
        position: "fixed",
        bottom: 0,
        left: 0,
        textTransform: "uppercase",
        userSelect: "none",
      }}
    >
      <Box
        as="a"
        target="_blank"
        href={url}
        rel="noopener noreferrer"
        sx={{
          flexShrink: 0,
          backgroundColor: "black",
          zIndex: 2,
        }}
      >
        <Flex
          ref={twitchLogoRef}
          sx={{
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
      </Box>
      <Flex
        as="a"
        target="_blank"
        href={url}
        rel="noopener noreferrer"
        sx={{
          color: "white",
          textDecoration: "none",
          alignItems: "center",
          overflow: "hidden",
          backgroundColor: "black",
          transform: `translateX(${barIsClosed ? "-100%" : 0})`,
          transition: "transform .3s cubic-bezier(0.65, 0, 0.35, 1)",
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
        <MarqueeContainer>
          {textsToRender.map((_, i) => (
            <MarqueeText key={`rep-${textsToRender.length}-${i}`} />
          ))}
        </MarqueeContainer>
        <MarqueeContainer>
          {textsToRender.map((_, i) => (
            <MarqueeText key={`rep-${textsToRender.length}-${i}`} />
          ))}
        </MarqueeContainer>
      </Flex>
    </Flex>
  );
};
