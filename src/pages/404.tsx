import React, { FC, useState, StrictMode } from "react";
import { type HeadFC, type PageProps, navigate } from "gatsby";
import { Button, Typography, Card, StyledEngineProvider } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import config from "../../config";
import { ThemeToggle } from "squarecomponents";
import "../stylesheets/404.css";
import "../stylesheets/common.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
const isBrowser = typeof window !== "undefined";

export const Head: HeadFC = () => <title>Not found</title>;

const NotFoundPage: FC<PageProps> = (props) => {
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

  // functions

  const customChangeThemeState = (newThemeState: "dark" | "light") => {
    changeThemeState(newThemeState);
    if (isBrowser) {
      window.localStorage.setItem("theme", newThemeState);
    }
  };

  const navtigateToHome = async () => {
    await navigate("/");
  };

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
    <StrictMode>
      <ThemeProvider theme={currentTheme}>
        <StyledEngineProvider injectFirst>
          <Card className="main" square>
            <div className="inside-main">
              <Typography align="center" color="error" variant="h1">
                404
              </Typography>{" "}
              <Typography align="center" color="error" variant="subtitle1">
                {props.location.pathname.length > 10
                  ? props.location.pathname.slice(0, 10) + "..."
                  : props.location.pathname}{" "}
                page does not exist.
              </Typography>
              <Button
                variant="contained"
                size="large"
                onClick={navtigateToHome}
              >
                go to home page
              </Button>
              <ThemeToggle
                themeState={themeState}
                customChangeThemeState={customChangeThemeState}
              />
            </div>
          </Card>
        </StyledEngineProvider>
      </ThemeProvider>
    </StrictMode>
  );
};

export default NotFoundPage;
