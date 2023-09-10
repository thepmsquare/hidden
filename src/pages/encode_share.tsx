import React, { FC, useState } from "react";
import { type HeadFC, type PageProps } from "gatsby";
import {
  FluentProvider,
  webDarkTheme,
  webLightTheme,
  Toaster,
} from "@fluentui/react-components";

import config from "../../config";
import "../stylesheets/encode_share.css";
const isBrowser = typeof window !== "undefined";
export const Head: HeadFC = () => <title>encode share | hidden</title>;

const EncodeSharePage: FC<PageProps> = (props) => {
  // get stuff from local storage
  let localStorageTheme;
  if (isBrowser) {
    localStorageTheme = window.localStorage.getItem("theme");
  } else {
    localStorageTheme = null;
  }
  let defaultThemeState: { theme: ["dark" | "light"] };
  if (localStorageTheme !== null) {
    defaultThemeState = {
      theme: [localStorageTheme === "dark" ? "dark" : "light"],
    };
  } else {
    defaultThemeState = config.defaultThemeState;
    if (isBrowser) {
      window.localStorage.setItem("theme", config.defaultThemeState.theme[0]);
    }
  }

  // state
  const [themeState, changeThemeState] = useState(defaultThemeState);

  // misc
  let currentTheme;
  if (themeState.theme[0] === "dark") {
    currentTheme = webDarkTheme;
  } else {
    currentTheme = webLightTheme;
  }
  return (
    <FluentProvider theme={currentTheme}>
      <main
        className="main"
        style={{
          backgroundImage: ``,
        }}
      >
        <div className="inside-main">encode_share</div>
      </main>
    </FluentProvider>
  );
};
export default EncodeSharePage;
