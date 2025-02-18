import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import { VCalendar } from "vuetify/labs/VCalendar";
import { aliases, mdi } from "vuetify/iconsets/mdi-svg";

export default createVuetify({
  components: {
    VCalendar,
    ...components,
  },
  directives,
  theme: {
    defaultTheme: "dark",
    themes: {
      dark: {
        colors: {
          // Background
          background: "#1E2030", // The dark editor background
          surface: "#242842", // Slightly lighter background

          // Syntax Colors
          primary: "#C792EA", // Pink/purple used for tags/elements
          secondary: "#89DDFF", // Light blue used for attributes
          accent: "#A6ACCD", // Grayish white for text

          // String values
          "string-color": "#89DDFF", // Light blue for strings
          "keyword-color": "#F07178", // Coral/pink for keywords

          "on-surface": "#A6ACCD", // Default text color
          "on-surface-variant": "#676E95", // Dimmed text color
        },
      },
    },
    icons: {
      defaultSet: "mdi",
      aliases,
      sets: {
        mdi,
      },
    },
  },
});
