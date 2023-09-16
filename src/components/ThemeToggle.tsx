import React, { useState, useRef } from "react";
import {
  Menu,
  MenuItem,
  Button,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";

const ThemeToggle = (props: {
  themeState: "dark" | "light";
  customChangeThemeState: (newThemeState: "dark" | "light") => void;
}) => {
  const [isThemeToggleMenuOpen, changeIsThemeToggleMenuOpen] = useState(false);
  const handleOpen = () => {
    changeIsThemeToggleMenuOpen(true);
  };
  const handleClose = () => {
    changeIsThemeToggleMenuOpen(false);
  };
  const changeThemeAndClose = (newTheme: "dark" | "light") => {
    props.customChangeThemeState(newTheme);
    handleClose();
  };
  const buttonRef = useRef(null);
  return (
    <>
      <Button
        id="toggle-theme-button"
        aria-controls={isThemeToggleMenuOpen ? "toggle-theme-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={isThemeToggleMenuOpen ? "true" : undefined}
        onClick={handleOpen}
        ref={buttonRef}
        endIcon={<KeyboardArrowDownIcon />}
        size="small"
        variant="outlined"
      >
        change appearance
      </Button>

      <Menu
        id="toggle-theme-menu"
        anchorEl={buttonRef.current}
        open={isThemeToggleMenuOpen}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "toggle-theme-button",
        }}
      >
        <MenuItem
          onClick={() => changeThemeAndClose("dark")}
          selected={props.themeState === "dark"}
        >
          <ListItemIcon>
            <DarkModeIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>dark mode</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => changeThemeAndClose("light")}
          selected={props.themeState === "light"}
        >
          <ListItemIcon>
            <LightModeIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>light mode</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};
export default ThemeToggle;
