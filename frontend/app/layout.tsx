import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { AuthProvider } from "@/contexts/auth-context"
import { ThemeProviderWrapper } from "@/components/theme-provider-wrapper"
import { ToastContainer } from "@/components/ui/toast-container"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Project Administration System",
  description: "Manage your projects, issues, and team efficiently",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProviderWrapper>
          <AuthProvider>{children}</AuthProvider>
          <ToastContainer />
        </ThemeProviderWrapper>
      </body>
    </html>
  )
}
