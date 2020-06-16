export const theme = {
  fontSizes: {
    small: "2rem",
    primary: "2.4rem",
    header: "3.6rem",
    xxl: "30rem",
  },
  fonts: {
    body: "aktiv-grotesk, sans-serif",
    heading: "aktiv-grotesk, sans-serif",
  },
  sizes: {},
  boxes: {},
  fontWeights: {
    body: 500,
    heading: 500,
    bold: 500,
  },
  lineHeights: {
    body: 1.5,
    heading: 1.125,
    intro: "4rem",
  },
  space: {
    primary: "2rem",
    secondary: "4rem",
    small: "1.4rem",
    primaryHorizontal: "2.4rem",
    primaryVertical: "1.6rem",
    intro: "12rem",
  },
  layouts: {
    main: {
      width: "100%",
      height: "auto",
      minHeight: "100vh",

      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",

      mx: "auto",
      px: "primary",
      py: "secondary",
    },
    center: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
  },
  colors: {
    text: "#000",
    background: "#fff",
    white: "#fff",
    grey: "#F5F5F5",
    black: "#000",
    purple: "#8E76AC",
    orange: "#EEB255",
    mint: "#38E4B8",
    red: "#E38065",
    azure: "#8CCBDE",
    cornflowerBlue: "#6C81E8",
  },
  text: {
    heading: {
      fontSize: ["primary", "header"],
      textAlign: "center",
      textTransform: "uppercase",
    },
    text: {
      textTransform: "uppercase",
    },
  },
  shadows: {},
  radii: {
    primary: "1rem",
  },
  borders: {
    primary: "4px solid black",
  },
  letterSpacings: {
    body: "normal",
  },
  buttons: {
    primary: {
      px: "primaryHorizontal",
      py: "primaryVertical",
      backgroundColor: "orange",
      textTransform: "uppercase",
      fontWeight: "bold",
      fontSize: ["small", "primary"],
      fontFamily: "body",
      cursor: "pointer",
      border: "primary",
      color: "black",
      borderRadius: "0",

      "&:disabled": {
        opacity: "0.5",
      },
    },
  },
  forms: {
    input: {
      width: "auto",
      px: "primaryHorizontal",
      py: "primaryVertical",

      backgroundColor: "white",
      fontSize: ["small", "primary"],
      fontWeight: "body",
      borderRadius: "0",
      border: "0",
    },
  },
  styles: {
    root: {
      fontFamily: "body",
      fontWeight: "body",
      fontSize: ["small", "primary"],
    },
  },
};
