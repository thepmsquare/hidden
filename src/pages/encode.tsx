import React, { FC, FormEvent, useState, StrictMode } from "react";
import { navigate, type HeadFC, type PageProps } from "gatsby";
import {
  Button,
  Typography,
  TextField,
  Card,
  StyledEngineProvider,
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CryptoJS from "crypto-js";
import config from "../../config";
import ThemeToggle from "../components/ThemeToggle";
import CustomSnackbar from "../components/CustomSnackbar";
import type CustomSnackbarStateType from "../types/CustomSnackbarStateType";
import "../stylesheets/encode.css";
import "../stylesheets/common.css";
import getSelectedImage from "../utils/getSelectedImage";
import dataURLToBlob from "../utils/dataURLToBlob";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import ImageIcon from "@mui/icons-material/Image";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PasswordInput from "../components/PasswordInput";

const isBrowser = typeof window !== "undefined";

export const Head: HeadFC = () => <title>encode | hidden</title>;

const EncodePage: FC<PageProps> = (props) => {
  // get state from props
  interface CustomStateType {
    selectedImageState: {
      selectedImage: Blob;
      selectedImageName: string;
      selectedImageType: string;
    };
    [key: string]: any;
  }
  function isCustomStateType(obj: any): obj is CustomStateType {
    if (obj && obj !== null) {
      return "selectedImageState" in obj;
    } else {
      return false;
    }
  }
  let selectedImageStateProps;
  if (isCustomStateType(props.location.state)) {
    selectedImageStateProps = {
      selectedImage: props.location.state.selectedImageState.selectedImage,
      selectedImageName:
        props.location.state.selectedImageState.selectedImageName,
      selectedImageType:
        props.location.state.selectedImageState.selectedImageType,
      selectedImageURL: URL.createObjectURL(
        props.location.state.selectedImageState.selectedImage
      ),
    };
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
  const [selectedImageState, changeSelectedImageState] = useState(
    selectedImageStateProps
  );
  const [message, changeMessage] = useState("");
  const [password, changePassword] = useState("");

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
    inputDOM.setAttribute("accept", "image/png,image/jpeg,image/webp");
    inputDOM.addEventListener("change", (e) => {
      getSelectedImage(
        e,
        (selectedImage, selectedImageName, selectedImageType) => {
          changeSelectedImageState({
            selectedImage: dataURLToBlob(selectedImage),
            selectedImageName,
            selectedImageType,
            selectedImageURL: selectedImage,
          });
        },
        changeSnackbarState
      );
    });
    inputDOM.click();
  };

  const convertMessageToBinary = (message: string) => {
    let encodedMessage = "";
    let utf8Style = "";
    try {
      for (let i = 0; i < message.length; i++) {
        const unicodeNumber = message.charCodeAt(i);
        let unicodeNumberInBinary = unicodeNumber.toString(2);
        utf8Style = "";
        if (unicodeNumber < 128) {
          utf8Style = unicodeNumberInBinary.padStart(8, "0");
        } else if (unicodeNumber < 2048) {
          unicodeNumberInBinary = unicodeNumberInBinary.padStart(11, "0");
          utf8Style =
            "110" +
            unicodeNumberInBinary.slice(0, 5) +
            "10" +
            unicodeNumberInBinary.slice(5, 12);
        } else if (unicodeNumber < 65536) {
          unicodeNumberInBinary = unicodeNumberInBinary.padStart(16, "0");
          utf8Style =
            "1110" +
            unicodeNumberInBinary.slice(0, 4) +
            "10" +
            unicodeNumberInBinary.slice(4, 10) +
            "10" +
            unicodeNumberInBinary.slice(10, 16);
        } else if (unicodeNumber <= 1114111) {
          unicodeNumberInBinary = unicodeNumberInBinary.padStart(21, "0");
          utf8Style =
            "11110" +
            unicodeNumberInBinary.slice(0, 3) +
            "10" +
            unicodeNumberInBinary.slice(3, 9) +
            "10" +
            unicodeNumberInBinary.slice(9, 15) +
            "10" +
            unicodeNumberInBinary.slice(15, 21);
        } else {
          throw new Error();
        }
        encodedMessage += utf8Style;
      }
      return encodedMessage;
    } catch (error: any) {
      throw new Error("Unexpected error while processing the message text.");
    }
  };

  const putMessageInImage = (
    newImageData: ImageData,
    encodedMessage: string,
    imageWidth: number,
    imageHeight: number,
    oldImageData: ImageData
  ): [ImageData, number, number] => {
    let newPixels = newImageData.data;
    let oldPixels = oldImageData.data;
    let finalEncodedMessage = encodedMessage + config.messageAppendedAtEnd;
    let msgLength = finalEncodedMessage.length;
    let maxLength = imageWidth * imageHeight * 3 * 2;
    if (msgLength > maxLength) {
      throw new Error(
        "Image with more pixels needed for encoding current message."
      );
    }
    let numPixelsToChange = Math.ceil(msgLength / (2 * 3));
    let percentImageChange =
      (numPixelsToChange / (imageWidth * imageHeight)) * 100;

    let pixelIndex = 0;
    for (let i = 0; i < finalEncodedMessage.length; i += 6) {
      const rm = finalEncodedMessage.slice(i, i + 2);
      const gm = finalEncodedMessage.slice(i + 2, i + 4);
      const bm = finalEncodedMessage.slice(i + 4, i + 6);

      let r =
        parseInt(oldPixels[pixelIndex].toString(), 10)
          .toString(2)
          .padStart(8, "0")
          .slice(0, 6) + rm;
      let g =
        gm !== ""
          ? parseInt(oldPixels[pixelIndex + 1].toString(), 10)
              .toString(2)
              .padStart(8, "0")
              .slice(0, 6) + gm
          : oldPixels[pixelIndex + 1].toString();
      let b =
        bm !== ""
          ? parseInt(oldPixels[pixelIndex + 2].toString(), 10)
              .toString(2)
              .padStart(8, "0")
              .slice(0, 6) + bm
          : oldPixels[pixelIndex + 2].toString();

      let rNum = parseInt(r, 2);
      let gNum = parseInt(g, 2);
      let bNum = parseInt(b, 2);

      newPixels[pixelIndex] = rNum;
      newPixels[pixelIndex + 1] = gNum;
      newPixels[pixelIndex + 2] = bNum;
      newPixels[pixelIndex + 3] = oldPixels[pixelIndex + 3];

      pixelIndex += 4; // Move to the next pixel (4 channels per pixel in RGBA)
    }
    for (; pixelIndex < oldPixels.length; pixelIndex++) {
      newPixels[pixelIndex] = oldPixels[pixelIndex];
    }
    return [newImageData, numPixelsToChange, percentImageChange];
  };

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const image = new Image();
      image.src = selectedImageState.selectedImageURL;
      const canvas = document.createElement("canvas");
      canvas.width = image.width;
      canvas.height = image.height;
      const ctx = canvas.getContext("2d", { colorSpace: "srgb" });
      if (ctx === null) {
        throw Error("unexpected error.");
      }
      ctx.drawImage(image, 0, 0);
      let encodedMessage;
      if (password) {
        encodedMessage = convertMessageToBinary(
          CryptoJS.AES.encrypt(message, password).toString()
        );
      } else {
        encodedMessage = convertMessageToBinary(message);
      }

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      let newImageData = new ImageData(canvas.width, canvas.height);
      let numPixelsToChange;
      let percentImageChange;
      [newImageData, numPixelsToChange, percentImageChange] = putMessageInImage(
        newImageData,
        encodedMessage,
        image.width,
        image.height,
        imageData
      );

      ctx.putImageData(newImageData, 0, 0);
      const newDataURL = canvas.toDataURL("image/png");
      await navigate("/encode_share/", {
        state: {
          selectedImageName: selectedImageState.selectedImageName,
          newDataBlob: dataURLToBlob(newDataURL),
          numPixelsToChange,
          percentImageChange,
        },
      });
    } catch (error: any) {
      changeSnackbarState({
        isOpen: true,
        message: error.message,
        severity: "error",
      });
    }
  };

  const navigateToStep2 = async () => {
    await navigate("/step2/", {
      state: {
        selectedImageState: {
          selectedImage: selectedImageState.selectedImage,
          selectedImageName: selectedImageState.selectedImageName,
          selectedImageType: selectedImageState.selectedImageType,
        },
      },
    });
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
              backgroundImage: `url("${selectedImageState.selectedImageURL}")`,
            }}
          >
            <Card className="inside-main">
              <Typography>
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
              <form className="form" onSubmit={handleFormSubmit}>
                <TextField
                  placeholder="enter text to hide in selected image"
                  value={message}
                  onChange={(e) => changeMessage(e.target.value)}
                  required
                  rows={3}
                  multiline
                  autoFocus
                  label="message"
                />

                <PasswordInput
                  value={password}
                  onChange={(e) => changePassword(e.target.value)}
                  uniqueIdForARIA="encode-password"
                  variant="outlined"
                  label="optional password"
                  others={{}}
                />

                <Button type="submit" size="large" variant="contained">
                  submit
                </Button>
              </form>
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
              <Button
                onClick={navigateToStep2}
                variant="outlined"
                size="small"
                startIcon={<ArrowBackIcon />}
              >
                go back
              </Button>
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
export default EncodePage;
