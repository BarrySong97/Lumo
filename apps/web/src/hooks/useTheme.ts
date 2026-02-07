"use client"

import { useCallback, useEffect, useState } from "react"
import { flushSync } from "react-dom"

type Theme = "light" | "dark"

const THEME_KEY = "journal-theme"

function getStoredTheme(): Theme | null {
  if (typeof window === "undefined") return null
  const stored = localStorage.getItem(THEME_KEY)
  if (stored === "light" || stored === "dark") return stored
  return null
}

function applyTheme(theme: Theme) {
  const root = document.documentElement
  if (theme === "dark") {
    root.classList.add("dark")
  } else {
    root.classList.remove("dark")
  }
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(() => {
    return getStoredTheme() ?? "dark"
  })

  useEffect(() => {
    // Apply theme on mount
    applyTheme(theme)
  }, [theme])

  const toggleTheme = useCallback(() => {
    const newTheme = theme === "light" ? "dark" : "light"
    
    const switchTheme = () => {
      flushSync(() => {
        applyTheme(newTheme)
        setThemeState(newTheme)
      })
      localStorage.setItem(THEME_KEY, newTheme)
    }

    if (!document.startViewTransition) {
      switchTheme()
      return
    }

    document.startViewTransition(switchTheme)
  }, [theme])

  return {
    theme,
    toggleTheme,
    isDark: theme === "dark",
  }
}
