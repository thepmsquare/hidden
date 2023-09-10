import React, { FC, useState } from "react";
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
  Divider,
  Text,
} from "@fluentui/react-components";
import config from "../../config";
import ThemeToggle from "../components/ThemeToggle";
import "../stylesheets/step2.css";

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

  const navigateToEncode = async () => {
    if (selectedImageState) {
      await navigate("/encode/", {
        state: {
          selectedImageState,
        },
      });
    } else {
      customDispatchToast("Unexpected error.", "error");
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
      customDispatchToast("Unexpected error.", "error");
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

          <div className="button-group-container">
            <Button appearance="primary" onClick={navigateToEncode}>
              hide text in selected image
            </Button>
            <Divider appearance="subtle" vertical className="divider-vertical">
              or
            </Divider>
            <Divider appearance="subtle" className="divider-horizontal">
              or
            </Divider>
            <Button
              appearance="primary"
              onClick={navigateToDecode}
              disabled={selectedImageState.selectedImageType !== "png"}
            >
              get hidden text from selected image
            </Button>
          </div>
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
export default Step2Page;
