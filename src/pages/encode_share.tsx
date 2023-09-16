import React, { FC, useState } from "react";
import { navigate, type HeadFC, type PageProps } from "gatsby";
import { Button, Typography, Card } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import config from "../../config";
import "../stylesheets/encode_share.css";

const isBrowser = typeof window !== "undefined";

export const Head: HeadFC = () => <title>encode share | hidden</title>;

const EncodeSharePage: FC<PageProps> = (props) => {
  // get state from props
  interface CustomStateType {
    selectedImageState: {
      selectedImage: string;
      selectedImageName: string;
      selectedImageType: string;
    };
    newDataURL: string;
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
  let newDataURL;
  if (isCustomStateType(props.location.state)) {
    selectedImageStateProps = props.location.state.selectedImageState;
    newDataURL = props.location.state.newDataURL;
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
          backgroundImage: `url("${newDataURL}")`,
        }}
      >
        <Card className="inside-main">
          <Typography align="justify">
            your message was hidden successfully. to do this{" "}
            <Typography variant="button">120</Typography> pixels of the image
            were modified and around{" "}
            <Typography variant="button">0.12%</Typography> of the image is
            slightly different now.
          </Typography>
          <Button>download modified image?</Button>
          <Button>share modified image?</Button>
          <Button>start over?</Button>
        </Card>
      </main>
    </ThemeProvider>
  );
};
export default EncodeSharePage;
