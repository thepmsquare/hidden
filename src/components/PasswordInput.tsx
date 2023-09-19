import React, { ChangeEventHandler, useState } from "react";
import {
  FormControl,
  InputLabel,
  Input,
  FilledInput,
  OutlinedInput,
  InputAdornment,
  IconButton,
  FormControlOwnProps,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
const PasswordInput = (props: {
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  label: string;
  uniqueIdForARIA: string;
  variant: FormControlOwnProps["variant"];
  others: any;
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };
  return (
    <FormControl variant={props.variant}>
      <InputLabel htmlFor={props.uniqueIdForARIA}>{props.label}</InputLabel>
      {props.variant === "filled" && (
        <FilledInput
          id={props.uniqueIdForARIA}
          type={showPassword ? "text" : "password"}
          value={props.value}
          onChange={props.onChange}
          {...props.others}
          autoComplete="off"
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
          label={props.label}
        />
      )}
      {props.variant === "outlined" && (
        <OutlinedInput
          id={props.uniqueIdForARIA}
          type={showPassword ? "text" : "password"}
          value={props.value}
          onChange={props.onChange}
          {...props.others}
          autoComplete="off"
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
          label={props.label}
        />
      )}
      {props.variant === "standard" && (
        <Input
          id={props.uniqueIdForARIA}
          type={showPassword ? "text" : "password"}
          value={props.value}
          onChange={props.onChange}
          {...props.others}
          autoComplete="off"
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
          label={props.label}
        />
      )}
    </FormControl>
  );
};
export default PasswordInput;
