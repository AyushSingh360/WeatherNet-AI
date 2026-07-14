import { WeatherDashboard } from "@/components/weather-dashboard"
import { ThemeToggle } from "@/components/theme-toggle"
import { Logo } from "@/components/logo"
import { ColorBends } from "@/components/color-bends"

export const dynamic = 'force-dynamic'

export default function Home() {
  return (
    <main className="min-h-screen relative bg-gradient-to-br from-gray-900 via-black to-gray-800 dark:from-black dark:via-gray-900 dark:to-black transition-colors duration-500 overflow-hidden">
      <ColorBends
        colors={["#ff5c7a", "#8a5cff", "#00ffd1"]}
        rotation={-94}
        speed={0.32}
        scale={2.5}
        frequency={1.3}
        warpStrength={0.945}
        mouseInfluence={0.95}
        noise={0.29}
        parallax={0.4}
        iterations={3}
        intensity={2}
        bandWidth={4}
        transparent
        autoRotate={1}
        className="absolute inset-0 opacity-40 pointer-events-none"
      />
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