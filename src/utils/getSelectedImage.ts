import { Dispatch } from "react";
import type CustomSnackbarStateType from "../types/CustomSnackbarStateType";

const customTypeCheckForFileList = (x: any): x is FileList => x.length === 1;

const getSelectedImage = (
  e: Event,
  callback: (
    selectedImage: string,
    selectedImageName: string,
    selectedImageType: string
  ) => void,
  changeSnackbarState: Dispatch<CustomSnackbarStateType>
) => {
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
          callback(event.target.result, filename, filetype);
        } else {
          changeSnackbarState({
            isOpen: true,
            message: "unable to select image, please try again.",
            severity: "error",
          });
        }
      };
    } else {
      changeSnackbarState({
        isOpen: true,
        message:
          "unsupported image format. currently supported formats: image/jpeg, image/png.",
        severity: "error",
      });
    }
  } else {
    changeSnackbarState({
      isOpen: true,
      message:
        "unsupported image format. currently supported formats: image/jpeg, image/png.",
      severity: "error",
    });
  }
};
export default getSelectedImage;
