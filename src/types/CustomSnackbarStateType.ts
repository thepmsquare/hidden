import type { AlertColor } from "@mui/material/Alert";

export default interface CustomSnackbarStateType {
  isOpen: boolean;
  message: string;
  severity: AlertColor;
}
