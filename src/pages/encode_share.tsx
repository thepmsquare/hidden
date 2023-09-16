import React, { FC, useState } from "react";
import { navigate, type HeadFC, type PageProps } from "gatsby";
import {
  Button,
  Typography,
  Card,
  CardMedia,
  CardContent,
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import config from "../../config";
import ThemeToggle from "../components/ThemeToggle";
import CustomSnackbar from "../components/CustomSnackbar";
import type CustomSnackbarStateType from "../types/CustomSnackbarStateType";
import "../stylesheets/common.css";
import "../stylesheets/encode_share.css";
import DoneIcon from "@mui/icons-material/Done";
import SaveIcon from "@mui/icons-material/Save";
import ShareIcon from "@mui/icons-material/Share";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { downloadZip } from "client-zip";

const isBrowser = typeof window !== "undefined";

export const Head: HeadFC = () => <title>encode share | hidden</title>;

const EncodeSharePage: FC<PageProps> = (props) => {
  // get state from props
  interface CustomPropsType {
    selectedImageState: {
      selectedImage: string;
      selectedImageName: string;
      selectedImageType: string;
    };
    newDataURL: string;
    numPixelsToChange: number;
    percentImageChange: number;
    [key: string]: any;
  }
  function isCustomStateType(obj: any): obj is CustomPropsType {
    if (obj !== null) {
      return (
        "selectedImageState" in obj &&
        "newDataURL" in obj &&
        "numPixelsToChange" in obj &&
        "percentImageChange" in obj
      );
    } else {
      return false;
    }
  }
  let selectedImageStateProps: CustomPropsType["selectedImageState"];
  let newDataURL: string;
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

  const downloadModifiedImage = () => {
    const downloadLink = document.createElement("a");
    downloadLink.href = newDataURL;
    downloadLink.download = `${config.encodeModifiedFileName.replace(
      "{FILENAME}",
      selectedImageStateProps.selectedImageName
    )}.png`;
    downloadLink.click();
  };

  const dataURLtoBlob = (dataurl: string) => {
    let arr = dataurl.split(",");
    if (arr !== null) {
      let mimeObj = arr[0].match(/:(.*?);/);
      if (mimeObj !== null) {
        let mime = mimeObj[1],
          bstr = atob(arr[1]),
          n = bstr.length,
          u8arr = new Uint8Array(n);
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], { type: mime });
      } else {
        throw Error("unexpected error.");
      }
    } else {
      throw Error("unexpected error.");
    }
  };
  const shareModifiedImage = async () => {
    try {
      const pngFileName = `${config.encodeModifiedFileName.replace(
        "{FILENAME}",
        selectedImageStateProps.selectedImageName
      )}.png`;
      const data = {
        files: [
          new File([dataURLtoBlob(newDataURL)], pngFileName, {
            type: dataURLtoBlob(newDataURL).type,
          }),
        ],
      };
      if (navigator.share && navigator.canShare(data)) {
        await navigator.share(data);
      } else {
        changeSnackbarState({
          isOpen: true,
          message: "sharing is unsupported by your browser.",
          severity: "error",
        });
      }
    } catch (error: any) {
      changeSnackbarState({
        isOpen: true,
        message: error.message,
        severity: "error",
      });
    }
  };
  const downloadModifiedZIP = async () => {
    const link = document.createElement("a");
    const pngFileName = `${config.encodeModifiedFileName.replace(
      "{FILENAME}",
      selectedImageStateProps.selectedImageName
    )}.png`;
    const zipFileName = `${config.encodeModifiedFileName.replace(
      "{FILENAME}",
      selectedImageStateProps.selectedImageName
    )}.zip`;
    const blob = await downloadZip([
      {
        name: pngFileName,
        lastModified: new Date(),
        input: dataURLtoBlob(newDataURL),
      },
    ]).blob();
    link.href = URL.createObjectURL(blob);
    link.download = zipFileName;
    link.click();
  };
  const navigateToHome = async () => {
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
    <ThemeProvider theme={currentTheme}>
      <main
        className="main"
        style={{
          backgroundImage: `url("${newDataURL}")`,
        }}
      >
        <Card className="inside-main">
          <CardMedia className="custom-card-media">
            <DoneIcon color="success" fontSize="large" />
            <Typography>your message was hidden successfully.</Typography>
          </CardMedia>
          <CardContent>
            <Typography align="justify">
              to do this{" "}
              <Typography variant="button" color="primary">
                {props.location.state.numPixelsToChange}
              </Typography>{" "}
              pixel(s) were considered for modification, which is around{" "}
              <Typography variant="button" color="primary">
                {props.location.state.percentImageChange.toFixed(2)}%
              </Typography>{" "}
              of the selected image.
            </Typography>
          </CardContent>

          <Button
            onClick={downloadModifiedImage}
            variant="contained"
            size="large"
            color="primary"
            startIcon={<SaveIcon />}
          >
            save modified image
          </Button>
          <Button
            variant="outlined"
            startIcon={<SaveIcon />}
            color="primary"
            onClick={downloadModifiedZIP}
          >
            save as zip file
          </Button>
          <Button
            variant="outlined"
            startIcon={<ShareIcon />}
            color="warning"
            onClick={shareModifiedImage}
            title="may result in data loss, if image is compressed."
          >
            share (do not compress)
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
    </ThemeProvider>
  );
};
export default EncodeSharePage;
