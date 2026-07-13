import { WeatherDashboard } from "@/components/weather-dashboard"
import { ThemeToggle } from "@/components/theme-toggle"
import { Logo } from "@/components/logo"

export const dynamic = 'force-dynamic'

export default function Home() {
  return (
    <main className="min-h-screen relative bg-gradient-to-br from-gray-900 via-black to-gray-800 dark:from-black dark:via-gray-900 dark:to-black transition-colors duration-500 overflow-hidden">
      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="flex justify-between items-center mb-8">
          <Logo size="md" />
          <ThemeToggle />
        </div>
        <WeatherDashboard />
      </div>
    </main>
  )
}