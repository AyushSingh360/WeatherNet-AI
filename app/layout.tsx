import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/providers/theme-provider"
import { QueryProvider } from "@/providers/query-provider"
import { UnitPreferencesProvider } from "@/hooks/use-unit-preferences"
import { Toaster } from "@/components/ui/toaster"
import { ServiceWorkerRegistration } from "@/components/service-worker-registration"

const inter = Inter({ subsets: ["latin"] })

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"

const description =
  "Real-time weather, 5-day forecasts, air quality and interactive charts in a sleek monochrome interface."

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "WeatherNet - Advanced Weather Network",
    template: "%s | WeatherNet",
  },
  description,
  keywords: ["weather", "forecast", "air quality", "openweathermap", "weather charts"],
  authors: [{ name: "Ayush Singh" }],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "WeatherNet",
    title: "WeatherNet - Advanced Weather Network",
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: "WeatherNet - Advanced Weather Network",
    description,
  },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/icons/icon-192.png",
    apple: "/icons/icon-192.png",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
  ],
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
              <ServiceWorkerRegistration />
            </UnitPreferencesProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
