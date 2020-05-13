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

export const NameInput: React.SFC<Props> = ({
  onBlur,
  onChange,
  value = "",
  error,
  id,
  color,
}) => {
  const [placeholder, setPlaceholder] = useState<string>();
  const textClone = useRef<HTMLSpanElement>();
  const inputBox = useRef<HTMLInputElement>();

  useEffect(() => {
    setPlaceholder(
      PLACEHOLDERS[Math.floor(Math.random() * PLACEHOLDERS.length)]
    );
  }, []);

  useEffect(() => {
    if (!textClone.current) {
      return;
    }

    const ro = new ResizeObserver((entries) => {
      if (entries.length < 1) {
        return;
      }

      inputBox.current.style.width = `${entries[0].contentRect.width + 48}px`;
    });

    ro.observe(textClone.current);

    return () => {
      ro.disconnect();
    };
  }, [textClone]);

  const currentValueOrPlaceholder = value.length > 0 ? value : placeholder;

  return (
    <Flex
      sx={{
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          display: "inline-flex",
          border: "primary",
        }}
      >
        <Box
          sx={{
            backgroundColor: color,
            textTransform: "uppercase",
            fontWeight: "bold",
            flex: "1 0 auto",
            px: "primaryHorizontal",
            py: "primaryVertical",
            borderRight: "primary",
            userSelect: "none",
          }}
        >
          Name
        </Box>
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
          {currentValueOrPlaceholder}
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
