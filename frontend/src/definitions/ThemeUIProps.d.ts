/** @jsx jsx */
import { jsx, SxStyleProp } from "theme-ui";

declare global {
  namespace JSX {
    interface IntrinsicAttributes {
      sx?: SxStyleProp;
    }
  }
}
