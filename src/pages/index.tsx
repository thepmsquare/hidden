import React, { FC, useState } from "react";
import { navigate } from "gatsby";
import type { HeadFC, PageProps } from "gatsby";
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
  tokens,
} from "@fluentui/react-components";
import config from "../../config";
import ThemeToggle from "../components/ThemeToggle";
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
  const [selectedImageState, changeSelectedImageState] = useState({
    selectedImage: "",
    selectedImageName: "",
    selectedImageType: "",
  });

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
      const filename = e.target.files[0].name.substr(0, indexOfPath);
      const filetype = e.target.files[0].name
        .substr(indexOfPath + 1)
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
        fReader.onloadend = async (event) => {
          if (event.target && typeof event.target.result === "string") {
            await navigate("/step2/", {
              state: {
                selectedImageState: {
                  selectedImage: event.target.result,
                  selectedImageName: filename,
                  selectedImageType: filetype,
                },
              },
            });

            let rootDOM = document.querySelector(":root");
            if (rootDOM != null && "style" in rootDOM) {
              rootDOM.setAttribute(
                "style",
                `--image-url:url("${event.target.result}")`
              );
            }
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

  // misc
  let currentTheme;
  if (themeState.theme[0] === "dark") {
    currentTheme = webDarkTheme;
  } else {
    currentTheme = webLightTheme;
  }

  return (
    <FluentProvider theme={currentTheme}>
      <main className="main">
        <div
          className="inside-main"
          style={{
            backgroundColor: tokens.colorNeutralBackground1,
            borderRadius: tokens.borderRadiusMedium,
          }}
        >
          <Button appearance="primary" onClick={uploadPhoto} size="large">
            select image
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

export default IndexPage;
