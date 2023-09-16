import React, { FC, useState } from "react";
import { navigate, type HeadFC, type PageProps } from "gatsby";
import { Button, Typography } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import config from "../../config";
import "../stylesheets/decode_share.css";

const isBrowser = typeof window !== "undefined";

export const Head: HeadFC = () => <title>decode share | hidden</title>;

const DecodeSharePage: FC<PageProps> = (props) => {
  // get stuff from local storage
  let localStorageTheme;
  if (isBrowser) {
    localStorageTheme = window.localStorage.getItem("theme");
  } else {
    localStorageTheme = null;
  }
  let defaultThemeState: "dark" | "light";
  if (localStorageTheme !== null) {
    defaultThemeState = localStorageTheme === "dark" ? "dark" : "light";
  } else {
    defaultThemeState = config.defaultThemeState;
    if (isBrowser) {
      window.localStorage.setItem("theme", config.defaultThemeState);
    }
  }

  // state
  const [themeState, changeThemeState] = useState(defaultThemeState);

  // misc
  let currentTheme = createTheme({
    palette: {
      mode: themeState,
    },
    typography: {
      fontFamily: config.defaultFont,
    },
  });
  return (
    <ThemeProvider theme={currentTheme}>
      <main
        className="main"
        style={{
          backgroundImage: ``,
        }}
      >
        <div className="inside-main">decode_share</div>
      </main>
    </ThemeProvider>
  );
};
export default DecodeSharePage;
