import React, { useState, useEffect } from "react";
import { ThemeContext, IThemeContextValue } from "@contexts/ThemeContext";

const navigatorTheme = window.matchMedia("(prefers-color-scheme: dark)")
  ? "dark"
  : "light";

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<string>("light");
  const [themeColor, setThemeColor] = useState<string>("");

  useEffect(() => {
    const localTheme = localStorage.getItem("theme");
    const localThemeColor = localStorage.getItem("themeColor");

    if (localTheme) {
      setTheme(localTheme);
    } else {
      changeTheme(navigatorTheme);
    }

    if (localThemeColor) {
      setThemeColor(localThemeColor);
    }
  }, []);

  const changeTheme = (theme: string) => {
    setTheme(theme);
    localStorage.setItem("theme", theme);
  };

  const changeThemeColor = (themeColor: string) => {
    setThemeColor(themeColor);
    localStorage.setItem("themeColor", themeColor);
  };

  const value: IThemeContextValue = {
    theme,
    setTheme: changeTheme,
    changeTheme,
    themeColor,
    setThemeColor: changeThemeColor,
    changeThemeColor,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
