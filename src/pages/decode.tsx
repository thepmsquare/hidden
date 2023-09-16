import React, { FC, FormEvent, useState } from "react";
import { navigate, type HeadFC, type PageProps } from "gatsby";
import { Button, Typography, TextField } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CryptoJS from "crypto-js";
import config from "../../config";
import ThemeToggle from "../components/ThemeToggle";
import CustomSnackbar from "../components/CustomSnackbar";
import type CustomSnackbarStateType from "../types/CustomSnackbarStateType";
import "../stylesheets/decode.css";
import "../stylesheets/common.css";
import getSelectedImage from "../utils/getSelectedImage";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

const isBrowser = typeof window !== "undefined";

export const Head: HeadFC = () => <title>decode | hidden</title>;

const DecodePage: FC<PageProps> = (props) => {
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
  const [password, changePassword] = useState("");

  // custom functions
  const customChangeThemeState = (newThemeState: "dark" | "light") => {
    changeThemeState(newThemeState);
    if (isBrowser) {
      window.localStorage.setItem("theme", newThemeState);
    }
  };

  const uploadPhoto = () => {
    let inputDOM = document.createElement("input");
    inputDOM.setAttribute("type", "file");
    inputDOM.setAttribute("accept", "image/png");
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

  const get2nBits = (
    number: number,
    imageData: ImageData,
    pixelData: [number, number]
  ) => {
    // pixelData = [pixelNumber, channel]
    let result = "";
    for (let i = 0; i < number; i++) {
      result =
        result +
        imageData.data[pixelData[0] * 4 + pixelData[1]]
          .toString(2)
          .padStart(8, "0")
          .slice(6);
      if (pixelData[1] === 2) {
        pixelData[1] = 0;
        pixelData[0] = pixelData[0] + 1;
      } else {
        pixelData[1] = pixelData[1] + 1;
      }
    }
    return result;
  };

  const getBinaryData = (imageData: ImageData) => {
    const binaryData = [];
    let pixelData: [number, number] = [0, 0];
    while (true) {
      let currentChr = get2nBits(1, imageData, pixelData); // Use the get2nBits function defined earlier.

      if (currentChr.charAt(0) === "0") {
        binaryData.push(currentChr + get2nBits(3, imageData, pixelData)); // Append 3 more bits.
      } else {
        if (currentChr === config.messageAppendedAtEnd) {
          break; // End marker found, exit the loop.
        } else {
          currentChr += get2nBits(1, imageData, pixelData);

          if (currentChr.substring(0, 3) === "110") {
            let appendThis =
              currentChr.substring(3) + get2nBits(2, imageData, pixelData);
            if (get2nBits(1, imageData, pixelData) !== "10") {
              throw new Error(
                "Input image doesn't appear to have any encoded message."
              );
            }
            appendThis += get2nBits(3, imageData, pixelData);
            binaryData.push(appendThis);
          } else if (currentChr === "1110") {
            let appendThis = get2nBits(2, imageData, pixelData);
            if (get2nBits(1, imageData, pixelData) !== "10") {
              throw new Error(
                "Input image doesn't appear to have any encoded message."
              );
            }
            appendThis += get2nBits(3, imageData, pixelData);
            if (get2nBits(1, imageData, pixelData) !== "10") {
              throw new Error(
                "Input image doesn't appear to have any encoded message."
              );
            }
            appendThis += get2nBits(3, imageData, pixelData);
            binaryData.push(appendThis);
          } else if (currentChr.substring(0, 5) === "11110") {
            let appendThis =
              currentChr.substring(5) + get2nBits(1, imageData, pixelData);
            if (get2nBits(1, imageData, pixelData) !== "10") {
              throw new Error(
                "Input image doesn't appear to have any encoded message."
              );
            }
            appendThis += get2nBits(3, imageData, pixelData);
            if (get2nBits(1, imageData, pixelData) !== "10") {
              throw new Error(
                "Input image doesn't appear to have any encoded message."
              );
            }
            appendThis += get2nBits(3, imageData, pixelData);
            if (get2nBits(1, imageData, pixelData) !== "10") {
              throw new Error(
                "Input image doesn't appear to have any encoded message."
              );
            }
            appendThis += get2nBits(3, imageData, pixelData);
            binaryData.push(appendThis);
          } else {
            throw new Error(
              "Input image doesn't appear to have any encoded message."
            );
          }
        }
      }
    }

    return binaryData;
  };

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    try {
      const image = new Image();
      image.src = selectedImageState.selectedImage;
      const canvas = document.createElement("canvas");
      canvas.width = image.width;
      canvas.height = image.height;
      const ctx = canvas.getContext("2d", { colorSpace: "srgb" });
      if (ctx === null) {
        throw Error("unexpected error.");
      }
      ctx.drawImage(image, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      let binaryData = getBinaryData(imageData);
      let decodedString = binaryData
        .map((x) => String.fromCharCode(parseInt(x, 2)))
        .join("");
      let finalMessage;
      if (password) {
        try {
          let bytes = CryptoJS.AES.decrypt(decodedString, password);
          finalMessage = bytes.toString(CryptoJS.enc.Utf8);
        } catch (error) {
          throw new Error("Wrong Password.");
        }
        if (finalMessage === "") {
          throw new Error("Wrong Password.");
        }
      } else {
        finalMessage = decodedString;
        if (finalMessage === "") {
          throw new Error(
            "Input image doesn't appear to have any encoded message."
          );
        }
      }

      console.log(finalMessage);
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
        selectedImageState,
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
    <ThemeProvider theme={currentTheme}>
      <main
        className="main"
        style={{
          backgroundImage: `url("${selectedImageState?.selectedImage}")`,
        }}
      >
        <div className="inside-main">
          <Typography>
            selected image:{" "}
            <code
              title={`${selectedImageState.selectedImageName}.${selectedImageState?.selectedImageType}`}
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
            </code>
          </Typography>
          <form className="form" onSubmit={handleFormSubmit}>
            <TextField
              type="password"
              value={password}
              onChange={(e) => changePassword(e.target.value)}
              placeholder="optional password"
            ></TextField>
            <Button type="submit">submit</Button>
          </form>

          <Button onClick={uploadPhoto}>change selected image?</Button>
          <ThemeToggle
            themeState={themeState}
            customChangeThemeState={customChangeThemeState}
          />
          <Button onClick={navigateToStep2}>go back</Button>
        </div>
        <CustomSnackbar
          snackbarState={snackbarState}
          changeSnackbarState={changeSnackbarState}
        />
      </main>
    </ThemeProvider>
  );
};
export default DecodePage;
