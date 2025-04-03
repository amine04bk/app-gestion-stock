// useThemeToggle.ts

import { useState, useEffect } from "react";

export type ThemeToggleHook = {
  isDarkMode: boolean;
  toggleTheme: () => void;
};

export const useThemeToggle = (): ThemeToggleHook => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const storedTheme = localStorage.getItem("themePreference");
    return storedTheme === "dark";
  });

  useEffect(() => {
    localStorage.setItem("themePreference", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  return { isDarkMode, toggleTheme };
};
