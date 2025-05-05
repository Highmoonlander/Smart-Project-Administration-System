"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { ThemeProvider } from "./theme-provider"

export function ThemeProviderWrapper({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatch by only rendering theme provider after mount
  useEffect(() => {
    setMounted(true)
  }, [])

  // Return children directly during SSR to avoid hydration mismatch
  if (!mounted) {
    return <>{children}</>
  }

  return <ThemeProvider>{children}</ThemeProvider>
}
