import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/providers/theme-provider"
import { QueryProvider } from "@/providers/query-provider"
import { UnitPreferencesProvider } from "@/hooks/use-unit-preferences"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "WeatherNet",
  description: "A sophisticated weather network application with real-time data",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <QueryProvider>
            <UnitPreferencesProvider>
              {children}
              <Toaster />
            </UnitPreferencesProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}