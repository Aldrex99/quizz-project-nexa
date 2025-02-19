import { useState, useContext, useEffect } from "react";
import { SunIcon, MoonIcon } from "@heroicons/react/16/solid";
import { ThemeContext } from "@/contexts/ThemeContext";
import { Switch } from "@headlessui/react";

export default function ThemeSwitch() {
  const { theme, changeTheme } = useContext(ThemeContext)!;
  const [enabled, setEnabled] = useState(theme === "dark");

  useEffect(() => {
    changeTheme(enabled ? "dark" : "light");
  }, [changeTheme, enabled]);

  return (
    <Switch
      checked={enabled}
      onChange={setEnabled}
      className="group relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-300 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 data-[checked]:bg-primary"
    >
      <span className="sr-only">Changer de thème</span>
      <span className="pointer-events-none relative inline-block size-4 transform rounded-full bg-primary-text shadow ring-0 transition duration-200 ease-in-out group-data-[checked]:translate-x-4">
        <span
          aria-hidden="true"
          className="absolute inset-0 flex size-full items-center justify-center transition-opacity duration-200 ease-in group-data-[checked]:opacity-0 group-data-[checked]:duration-100 group-data-[checked]:ease-out"
        >
          <SunIcon className="size-3 text-gray-400" />
        </span>
        <span
          aria-hidden="true"
          className="absolute inset-0 flex size-full items-center justify-center opacity-0 transition-opacity duration-100 ease-out group-data-[checked]:opacity-100 group-data-[checked]:duration-200 group-data-[checked]:ease-in"
        >
          <MoonIcon className="size-3 text-primary" />
        </span>
      </span>
    </Switch>
  );
}
