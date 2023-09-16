import React, { Dispatch } from "react";
import { Snackbar, Alert } from "@mui/material";
import type CustomSnackbarStateType from "../types/CustomSnackbarStateType";

const CustomSnackbar = (props: {
  snackbarState: CustomSnackbarStateType;
  changeSnackbarState: Dispatch<CustomSnackbarStateType>;
}) => {
  const handleSnackbarClose = () => {
    props.changeSnackbarState({
      isOpen: false,
      message: "",
      severity: "error",
    });
  };

  return (
    <Snackbar
      open={props.snackbarState.isOpen}
      autoHideDuration={6000}
      onClose={handleSnackbarClose}
    >
      <Alert
        onClose={handleSnackbarClose}
        severity={props.snackbarState.severity}
        sx={{ width: "100%" }}
      >
        {props.snackbarState.message}
      </Alert>
    </Snackbar>
  );
};
export default CustomSnackbar;
export type { CustomSnackbarStateType };
