import React, { FC, useState, StrictMode } from "react";
import { navigate, type HeadFC, type PageProps } from "gatsby";
import {
  Button,
  Typography,
  Card,
  CardMedia,
  TextField,
  StyledEngineProvider,
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import config from "../../config";
import ThemeToggle from "../components/ThemeToggle";
import CustomSnackbar from "../components/CustomSnackbar";
import type CustomSnackbarStateType from "../types/CustomSnackbarStateType";
import "../stylesheets/decode_share.css";
import "../stylesheets/common.css";
import DoneIcon from "@mui/icons-material/Done";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
const isBrowser = typeof window !== "undefined";

export const Head: HeadFC = () => <title>decode share | hidden</title>;

const DecodeSharePage: FC<PageProps> = (props) => {
  // get state from props
  interface CustomPropsType {
    selectedImageState: {
      selectedImage: Blob;
      selectedImageName: string;
      selectedImageType: string;
    };
    finalMessage: string;
    [key: string]: any;
  }
  function isCustomStateType(obj: any): obj is CustomPropsType {
    if (obj && obj !== null) {
      return "selectedImageState" in obj && "finalMessage" in obj;
    } else {
      return false;
    }
  }
  let selectedImageURL: string;
  let finalMessage: string;
  if (isCustomStateType(props.location.state)) {
    selectedImageURL = URL.createObjectURL(
      props.location.state.selectedImageState.selectedImage
    );
    finalMessage = props.location.state.finalMessage;
  } else {
    if (isBrowser) {
      navigate("/");
    }
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
  const [isCopiedTrue, changeIsCopiedTrue] = useState(false);

  // functions
  const customChangeThemeState = (newThemeState: "dark" | "light") => {
    changeThemeState(newThemeState);
    if (isBrowser) {
      window.localStorage.setItem("theme", newThemeState);
    }
  };

  const navigateToHome = async () => {
    await navigate("/");
  };
  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(finalMessage);
    changeIsCopiedTrue(true);
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
          <main
            className="main"
            style={{
              backgroundImage: `url("${selectedImageURL}")`,
            }}
          >
            <Card className="inside-main">
              <CardMedia className="custom-card-media">
                <DoneIcon color="success" fontSize="large" />
                <Typography>your message was decoded successfully.</Typography>
              </CardMedia>
              <TextField
                label="message"
                disabled
                multiline
                rows={3}
                value={finalMessage}
              />
              <Button
                variant={isCopiedTrue ? "outlined" : "contained"}
                startIcon={<ContentCopyIcon />}
                onClick={copyToClipboard}
              >
                {isCopiedTrue ? "copy message again" : "copy message"}
              </Button>
              <Button
                onClick={navigateToHome}
                variant="outlined"
                startIcon={<RestartAltIcon />}
              >
                start over
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
        </StyledEngineProvider>
      </ThemeProvider>
    </StrictMode>
  );
};
export default DecodeSharePage;
