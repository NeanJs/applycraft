"use client";

import { Moon, Sun } from "lucide-react";
import { useSyncExternalStore } from "react";

const THEME_STORAGE_KEY = "applycraft-theme";
const THEME_CHANGE_EVENT = "applycraft-theme-change";

function subscribe(onChange: () => void) {
  function handleStorageChange(event: StorageEvent) {
    if (event.key !== THEME_STORAGE_KEY) return;
    document.documentElement.dataset.theme =
      event.newValue === "dark" ? "dark" : "light";
    onChange();
  }

  window.addEventListener(THEME_CHANGE_EVENT, onChange);
  window.addEventListener("storage", handleStorageChange);
  return () => {
    window.removeEventListener(THEME_CHANGE_EVENT, onChange);
    window.removeEventListener("storage", handleStorageChange);
  };
}

function getThemeSnapshot() {
  return document.documentElement.dataset.theme === "dark";
}

function getServerThemeSnapshot() {
  return false;
}

export default function ThemeToggle() {
  const isDark = useSyncExternalStore(
    subscribe,
    getThemeSnapshot,
    getServerThemeSnapshot,
  );

  function toggleTheme() {
    const nextTheme = getThemeSnapshot() ? "light" : "dark";
    document.documentElement.dataset.theme = nextTheme;
    window.dispatchEvent(new Event(THEME_CHANGE_EVENT));

    try {
      localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    } catch (error) {
      console.error("Could not save the ApplyCraft theme preference.", error);
    }
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
      title={`Switch to ${isDark ? "light" : "dark"} theme`}
      className="inline-flex items-center gap-2 rounded-lg border border-[var(--line)] bg-[var(--surface)] px-3 py-2 text-xs font-medium text-[var(--brand-ink)] transition-colors hover:bg-[var(--brand-soft-cobalt)]"
    >
      {isDark ? (
        <Sun size={15} strokeWidth={1.8} aria-hidden="true" />
      ) : (
        <Moon size={15} strokeWidth={1.8} aria-hidden="true" />
      )}
      <span>{isDark ? "Light mode" : "Dark mode"}</span>
    </button>
  );
}
