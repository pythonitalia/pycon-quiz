/* eslint-disable react/no-danger */
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Box, Flex, Input, Text } from "theme-ui";

type Props = {
  id: string;
  onBlur: (event: any) => void;
  onChange: (event: any) => void;
  value: string;
  error: string;
  color: string;
};

const PLACEHOLDERS = [
  /* TODO: Find a better list */
  "GuidoVanRossum",
  "AlexMartelli",
];

export const NameInput: React.FC<Props> = ({
  onBlur,
  onChange,
  value = "",
  error,
  id,
  color,
}) => {
  const [placeholder] = useState<string>(
    typeof window !== "undefined"
      ? window.__NAME_INPUT_PLACEHOLDER
      : PLACEHOLDERS[Math.floor(Math.random() * PLACEHOLDERS.length)]
  );
  const textClone = useRef<HTMLSpanElement>();
  const inputBox = useRef<HTMLInputElement>();

  useEffect(() => {
    if (!textClone.current) {
      return;
    }

    inputBox.current.style.minWidth = `${textClone.current.clientWidth + 48}px`;
  }, [textClone.current]);

  return (
    <Flex
      sx={{
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      <script
        dangerouslySetInnerHTML={{
          __html: `var __NAME_INPUT_PLACEHOLDER="${placeholder}"`,
        }}
      />
      <Box
        sx={{
          display: "inline-flex",
          border: "primary",
        }}
      >
        <Flex
          sx={{
            backgroundColor: color,
            textTransform: "uppercase",
            fontWeight: "bold",
            flex: "1 0 auto",
            px: "primaryHorizontal",
            py: "primaryVertical",
            borderRight: "primary",
            userSelect: "none",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          Name
        </Flex>
        <Input
          id={id}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          onBlur={onBlur}
          ref={inputBox}
          sx={{
            width: 0,
            textTransform: "uppercase",
            fontSize: "primary",
            flex: "0 0 auto",
          }}
          required
          maxLength={22}
        />
        <Text
          sx={{
            textTransform: "uppercase",
            fontSize: "primary",
            py: "primaryVertical",
            position: "absolute",
            bottom: 0,
            opacity: 0,
            userSelect: "none",
          }}
          as="span"
          ref={textClone}
        >
          {placeholder}
        </Text>
      </Box>

      <Text
        sx={{
          fontSize: "small",
          mt: "primary",
        }}
      >
        {error}
      </Text>
    </Flex>
  );
};
