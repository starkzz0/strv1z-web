import { createContext, useContext, useEffect, useState } from "react";

interface ThemeContextType {
  theme: "light" | "dark";
  colorTheme: "teal" | "blue" | "purple" | "neutral";
  setTheme: (theme: "light" | "dark") => void;
  setColorTheme: (theme: "teal" | "blue" | "purple" | "neutral") => void;
  fontSize: "small" | "medium" | "large";
  setFontSize: (size: "small" | "medium" | "large") => void;
  highContrast: boolean;
  setHighContrast: (enabled: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [colorTheme, setColorTheme] = useState<"teal" | "blue" | "purple" | "neutral">("teal");
  const [fontSize, setFontSize] = useState<"small" | "medium" | "large">("medium");
  const [highContrast, setHighContrast] = useState(false);

  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove previous theme classes
    root.classList.remove("dark", "theme-blue", "theme-purple", "theme-neutral");
    
    // Apply current theme
    if (theme === "dark") {
      root.classList.add("dark");
    }
    
    if (colorTheme !== "teal") {
      root.classList.add(`theme-${colorTheme}`);
    }

    // Apply font size
    root.style.fontSize = fontSize === "small" ? "14px" : fontSize === "large" ? "18px" : "16px";
    
    // Apply high contrast
    if (highContrast) {
      root.style.setProperty("--foreground", theme === "dark" ? "0 0% 100%" : "0 0% 0%");
      root.style.setProperty("--background", theme === "dark" ? "0 0% 0%" : "0 0% 100%");
    }
  }, [theme, colorTheme, fontSize, highContrast]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        colorTheme,
        setTheme,
        setColorTheme,
        fontSize,
        setFontSize,
        highContrast,
        setHighContrast,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};