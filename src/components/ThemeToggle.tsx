import React from "react";
import {
  Menu,
  MenuButton,
  MenuTrigger,
  MenuList,
  MenuPopover,
  MenuItemRadio,
} from "@fluentui/react-components";
import {
  bundleIcon,
  WeatherMoonRegular,
  WeatherMoonFilled,
  WeatherSunnyRegular,
  WeatherSunnyFilled,
} from "@fluentui/react-icons";

const WeatherMoonIcon = bundleIcon(WeatherMoonFilled, WeatherMoonRegular);
const WeatherSunnyIcon = bundleIcon(WeatherSunnyFilled, WeatherSunnyRegular);

const ThemeToggle = (props: {
  themeState: { theme: ["dark" | "light"] };
  customChangeThemeState: (newThemeState: {
    theme: ["dark" | "light"];
  }) => void;
}) => {
  return (
    <Menu
      checkedValues={props.themeState}
      onCheckedValueChange={(e, data) => {
        props.customChangeThemeState({
          theme: data.checkedItems[0] === "dark" ? ["dark"] : ["light"],
        });
      }}
    >
      <MenuTrigger disableButtonEnhancement>
        <MenuButton appearance="subtle">change appearance</MenuButton>
      </MenuTrigger>
      <MenuPopover>
        <MenuList>
          <MenuItemRadio icon={<WeatherMoonIcon />} name="theme" value="dark">
            dark mode
          </MenuItemRadio>
          <MenuItemRadio icon={<WeatherSunnyIcon />} name="theme" value="light">
            light mode
          </MenuItemRadio>
        </MenuList>
      </MenuPopover>
    </Menu>
  );
};
export default ThemeToggle;
