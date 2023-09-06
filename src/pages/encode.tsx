import React, { FC, FormEvent, useState } from "react";
import { navigate, type HeadFC, type PageProps } from "gatsby";
import {
  FluentProvider,
  webDarkTheme,
  webLightTheme,
  Button,
  useId,
  Toaster,
  useToastController,
  Toast,
  ToastTitle,
  ToastIntent,
  Text,
  Input,
  Textarea,
} from "@fluentui/react-components";
import config from "../../config";
import ThemeToggle from "../components/ThemeToggle";
import "../stylesheets/encode.css";
const isBrowser = typeof window !== "undefined";
export const Head: HeadFC = () => <title>encode | hidden</title>;

const EncodePage: FC<PageProps> = (props) => {
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
  const [selectedImageState, changeSelectedImageState] = useState(
    selectedImageStateProps
  );
  const [message, changeMessage] = useState("");
  const [password, changePassword] = useState("");

  // custom functions
  const customChangeThemeState = (newThemeState: {
    theme: ["dark" | "light"];
  }) => {
    changeThemeState(newThemeState);
    if (isBrowser) {
      window.localStorage.setItem("theme", newThemeState.theme[0]);
    }
  };

  const toasterId = useId("toaster");
  const { dispatchToast } = useToastController(toasterId);
  const customDispatchToast = (message: string, intent: ToastIntent) => {
    dispatchToast(
      <Toast>
        <ToastTitle>{message}</ToastTitle>
      </Toast>,
      { intent: intent }
    );
  };

  const customTypeCheckForFileList = (x: any): x is FileList => x.length === 1;
  const getSelectedImage = (e: Event) => {
    if (
      e.target &&
      "files" in e.target &&
      customTypeCheckForFileList(e.target.files)
    ) {
      const indexOfPath = e.target.files[0].name.lastIndexOf(".");
      const filename = e.target.files[0].name.slice(0, indexOfPath);
      const filetype = e.target.files[0].name
        .slice(indexOfPath + 1)
        .toLowerCase();
      if (
        filetype === "png" ||
        filetype === "jpg" ||
        filetype === "jpeg" ||
        filetype === "jfif" ||
        filetype === "pjpeg" ||
        filetype === "pjp"
      ) {
        const fReader = new FileReader();
        fReader.readAsDataURL(e.target.files[0]);
        fReader.onloadend = (event) => {
          if (event.target && typeof event.target.result === "string") {
            changeSelectedImageState({
              selectedImage: event.target.result,
              selectedImageName: filename,
              selectedImageType: filetype,
            });
          } else {
            customDispatchToast(
              "unable to select image, please try again.",
              "error"
            );
          }
        };
      } else {
        customDispatchToast(
          "unsupported image format. currently supported formats: image/jpeg, image/png.",
          "error"
        );
      }
    } else {
      customDispatchToast(
        "unsupported image format. currently supported formats: image/jpeg, image/png.",
        "error"
      );
    }
  };

  const uploadPhoto = () => {
    let inputDOM = document.createElement("input");
    inputDOM.setAttribute("type", "file");
    inputDOM.setAttribute("accept", "image/png,image/jpeg");
    inputDOM.addEventListener("change", getSelectedImage);
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
  ) => {
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
    return newImageData;
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
      let encodedMessage = convertMessageToBinary(message);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      let newImageData = new ImageData(canvas.width, canvas.height);

      newImageData = putMessageInImage(
        newImageData,
        encodedMessage,
        image.width,
        image.height,
        imageData
      );

      ctx.putImageData(newImageData, 0, 0);
      const dataURL = canvas.toDataURL("image/png");

      const downloadLink = document.createElement("a");
      downloadLink.href = dataURL;
      downloadLink.download = "my_image.png";

      downloadLink.click();
    } catch (error: any) {
      customDispatchToast(error.message, "error");
    }
  };
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
          backgroundImage: `url("${selectedImageState?.selectedImage}")`,
        }}
      >
        <div className="inside-main">
          <Text>
            selected image:{" "}
            <Text font="monospace">
              {(selectedImageState?.selectedImageName as "string")?.length >
              config.step2FileNameLength.max
                ? `${
                    selectedImageState?.selectedImageName.slice(
                      0,
                      config.step2FileNameLength.visibleEnds
                    ) +
                    "..." +
                    selectedImageState?.selectedImageName.slice(
                      -config.step2FileNameLength.visibleEnds
                    )
                  }.${selectedImageState?.selectedImageType}`
                : `${selectedImageState?.selectedImageName}.${selectedImageState?.selectedImageType}`}
            </Text>
          </Text>
          <form className="encode-form" onSubmit={handleFormSubmit}>
            <Textarea
              placeholder="enter text to hide in selected image"
              value={message}
              onChange={(_, data) => changeMessage(data.value)}
              required
            />
            <Input
              type="password"
              value={password}
              onChange={(_, data) => changePassword(data.value)}
              placeholder="optional password"
            ></Input>
            <Button appearance="primary" type="submit">
              submit
            </Button>
          </form>

          <Button appearance="subtle" onClick={uploadPhoto}>
            change selected image?
          </Button>
          <ThemeToggle
            themeState={themeState}
            customChangeThemeState={customChangeThemeState}
          />
          <Toaster
            toasterId={toasterId}
            position="bottom-start"
            pauseOnHover
            pauseOnWindowBlur
          />
        </div>
      </main>
    </FluentProvider>
  );
};
export default EncodePage;
