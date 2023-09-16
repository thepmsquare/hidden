import React, { FC, useState } from "react";
import { navigate } from "gatsby";
import type { HeadFC, PageProps } from "gatsby";
import { Button, Card } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import config from "../../config";
import ThemeToggle from "../components/ThemeToggle";
import CustomSnackbar from "../components/CustomSnackbar";
import type CustomSnackbarStateType from "../types/CustomSnackbarStateType";
import "../stylesheets/index.css";
import "../stylesheets/common.css";
import getSelectedImage from "../utils/getSelectedImage";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

const isBrowser = typeof window !== "undefined";

export const Head: HeadFC = () => <title>hidden</title>;

const IndexPage: FC<PageProps> = () => {
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
  const [snackbarState, changeSnackbarState] =
    useState<CustomSnackbarStateType>({
      isOpen: false,
      message: "",
      severity: "error",
    });

  // functions

  const customChangeThemeState = (newThemeState: "dark" | "light") => {
    changeThemeState(newThemeState);
    if (isBrowser) {
      window.localStorage.setItem("theme", newThemeState);
    }
  };

  const uploadPhoto = () => {
    let inputDOM = document.createElement("input");
    inputDOM.setAttribute("type", "file");
    inputDOM.setAttribute("accept", "image/png,image/jpeg");
    inputDOM.addEventListener("change", (e) =>
      getSelectedImage(
        e,
        async (
          selectedImage: string,
          selectedImageName: string,
          selectedImageType: string
        ) => {
          await navigate("/step2/", {
            state: {
              selectedImageState: {
                selectedImage,
                selectedImageName,
                selectedImageType,
              },
            },
          });
        },
        changeSnackbarState
      )
    );
    inputDOM.click();
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
    <ThemeProvider theme={currentTheme}>
      <Card className="main" square>
        <div className="index-card">
          <Button
            onClick={uploadPhoto}
            variant="contained"
            size="large"
            className="index-start-button"
          >
            select an image
          </Button>
          <ThemeToggle
            themeState={themeState}
            customChangeThemeState={customChangeThemeState}
          />
        </div>
      </Card>
      <CustomSnackbar
        snackbarState={snackbarState}
        changeSnackbarState={changeSnackbarState}
      />
    </ThemeProvider>
  );
};

export default IndexPage;
