"use client";

import { useSyncExternalStore } from "react";
import { FiSun, FiMoon } from "react-icons/fi";

const emptySubscribe = () => () => {};

function subscribeTheme(callback: () => void) {
  if (typeof window === "undefined") return () => {};

  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.attributeName === "class") {
        callback();
      }
    }
  });

  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  window.addEventListener("storage", callback);

  return () => {
    observer.disconnect();
    window.removeEventListener("storage", callback);
  };
}

function getThemeSnapshot() {
  return (
    typeof document !== "undefined" && document.documentElement.classList.contains("dark")
  );
}

function getServerSnapshot() {
  return true;
}

export function ThemeToggle() {
  const isClient = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const isDark = useSyncExternalStore(
    subscribeTheme,
    getThemeSnapshot,
    getServerSnapshot
  );

  const toggleTheme = () => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
  };

  if (!isClient) {
    return (
      <div className="w-9 h-9 rounded-xl bg-ink-100 dark:bg-ink-800 animate-pulse" />
    );
  }

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className="w-9 h-9 rounded-xl flex items-center justify-center text-ink-600 dark:text-ink-400 hover:text-ink-900 dark:hover:text-ink-100 hover:bg-ink-100 dark:hover:bg-ink-800 border border-ink-200/80 dark:border-ink-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 cursor-pointer shadow-2xs"
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
    >
      {isDark ? (
        <FiSun size={16} aria-hidden="true" />
      ) : (
        <FiMoon size={16} aria-hidden="true" />
      )}
    </button>
  );
}
