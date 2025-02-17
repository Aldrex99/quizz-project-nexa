import { createContext } from "react";

interface IThemeContextValue {
  theme: string;
  readonly setTheme?: (theme: string) => void;
  changeTheme: (theme: string) => void;
  themeColor: string;
  readonly setThemeColor?: (color: string) => void;
  changeThemeColor: (themeColor: string) => void;
}

export const ThemeContext = createContext<IThemeContextValue | null>(null);
export type { IThemeContextValue };
