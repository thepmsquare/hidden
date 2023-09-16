import React, { FC, useState } from "react";
import { navigate, type HeadFC, type PageProps } from "gatsby";
import { Button, Divider, Typography, Card } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import config from "../../config";
import ThemeToggle from "../components/ThemeToggle";
import CustomSnackbar from "../components/CustomSnackbar";
import type CustomSnackbarStateType from "../types/CustomSnackbarStateType";
import "../stylesheets/step2.css";
import "../stylesheets/common.css";
import getSelectedImage from "../utils/getSelectedImage";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import ImageIcon from "@mui/icons-material/Image";
import LockIcon from "@mui/icons-material/Lock";
import KeyIcon from "@mui/icons-material/Key";

const isBrowser = typeof window !== "undefined";

export const Head: HeadFC = () => <title>hidden</title>;

const Step2Page: FC<PageProps> = (props) => {
  // get state from props
  interface CustomStateType {
    selectedImageState: {
      selectedImage: string;
      selectedImageName: string;
      selectedImageType: string;
    };
    [key: string]: any;
  }
  function isCustomStateType(obj: any): obj is CustomStateType {
    if (obj !== null) {
      return "selectedImageState" in obj;
    } else {
      return false;
    }
  }
  let selectedImageStateProps;
  if (isCustomStateType(props.location.state)) {
    selectedImageStateProps = props.location.state.selectedImageState;
  } else {
    navigate("/");
    return "";
  }

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
  const [selectedImageState, changeSelectedImageState] = useState(
    selectedImageStateProps
  );

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
    inputDOM.addEventListener("change", (e) => {
      getSelectedImage(
        e,
        (selectedImage, selectedImageName, selectedImageType) => {
          changeSelectedImageState({
            selectedImage,
            selectedImageName,
            selectedImageType,
          });
        },
        changeSnackbarState
      );
    });
    inputDOM.click();
  };

  const navigateToEncode = async () => {
    if (selectedImageState) {
      await navigate("/encode/", {
        state: {
          selectedImageState,
        },
      });
    } else {
      changeSnackbarState({
        isOpen: true,
        message: "Unexpected error.",
        severity: "error",
      });
    }
  };

  const navigateToDecode = async () => {
    if (selectedImageState) {
      await navigate("/decode/", {
        state: {
          selectedImageState,
        },
      });
    } else {
      changeSnackbarState({
        isOpen: true,
        message: "Unexpected error.",
        severity: "error",
      });
    }
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
      <main
        className="main"
        style={{
          backgroundImage: `url("${selectedImageState?.selectedImage}")`,
        }}
      >
        <Card className="inside-main">
          <Typography align="center">
            selected image:{" "}
            <Typography
              title={`${selectedImageState.selectedImageName}.${selectedImageState?.selectedImageType}`}
              color="primary"
              variant="button"
            >
              {selectedImageState.selectedImageName.length >
              config.step2FileNameLength.max
                ? `${
                    selectedImageState.selectedImageName.slice(
                      0,
                      config.step2FileNameLength.visibleEnds
                    ) +
                    "..." +
                    selectedImageState.selectedImageName.slice(
                      -config.step2FileNameLength.visibleEnds
                    )
                  }.${selectedImageState.selectedImageType}`
                : `${selectedImageState.selectedImageName}.${selectedImageState.selectedImageType}`}
            </Typography>
          </Typography>

          <div className="button-group-container">
            <Button
              onClick={navigateToEncode}
              variant="contained"
              size="large"
              startIcon={<LockIcon />}
            >
              hide text in image
            </Button>
            <Divider orientation="vertical" className="divider-vertical">
              or
            </Divider>
            <Divider orientation="horizontal" className="divider-horizontal">
              or
            </Divider>
            <Button
              variant="contained"
              onClick={navigateToDecode}
              disabled={selectedImageState.selectedImageType !== "png"}
              size="large"
              startIcon={<KeyIcon />}
            >
              get hidden text from image
            </Button>
          </div>
          <Button
            onClick={uploadPhoto}
            variant="outlined"
            startIcon={<ImageIcon />}
          >
            change selected image
          </Button>
          <ThemeToggle
            themeState={themeState}
            customChangeThemeState={customChangeThemeState}
          />
        </Card>
        <CustomSnackbar
          snackbarState={snackbarState}
          changeSnackbarState={changeSnackbarState}
        />
      </main>
    </ThemeProvider>
  );
};
export default Step2Page;
