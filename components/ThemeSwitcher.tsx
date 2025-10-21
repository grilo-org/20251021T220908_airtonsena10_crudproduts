"use client";

import React from "react";
import { useTheme } from "next-themes";
import { Button } from "@heroui/react";
import { Sun, Moon, Monitor } from "lucide-react";

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button
        isIconOnly
        variant="light"
        className="text-foreground-secondary"
        size="sm"
      >
        <div className="w-4 h-4 bg-gray-300 rounded animate-pulse" />
      </Button>
    );
  }

  const getNextTheme = () => {
    switch (theme) {
      case "light":
        return "dark";
      case "dark":
        return "system";
      case "system":
        return "light";
      default:
        return "light";
    }
  };

  const getCurrentIcon = () => {
    switch (theme) {
      case "light":
        return <Sun className="w-4 h-4" />;
      case "dark":
        return <Moon className="w-4 h-4" />;
      case "system":
        return <Monitor className="w-4 h-4" />;
      default:
        return <Sun className="w-4 h-4" />;
    }
  };

  const getThemeLabel = () => {
    switch (theme) {
      case "light":
        return "Modo claro";
      case "dark":
        return "Modo escuro";
      case "system":
        return "Seguir sistema";
      default:
        return "Modo claro";
    }
  };

  const handleThemeChange = () => {
    const nextTheme = getNextTheme();
    setTheme(nextTheme);
  };

  return (
    <Button
      isIconOnly
      variant="light"
      className="text-foreground-secondary hover:text-foreground hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
      size="sm"
      radius="lg"
      onPress={handleThemeChange}
      aria-label={`Alternar tema - ${getThemeLabel()}`}
      title={getThemeLabel()}
    >
      {getCurrentIcon()}
    </Button>
  );
}
