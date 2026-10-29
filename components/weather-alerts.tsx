"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle, Thermometer, Wind, Droplets } from "lucide-react"
import { cn } from "@/lib/utils"
import type { CurrentWeather } from "@/types/weather"

interface WeatherAlertsProps {
  weather: CurrentWeather
  className?: string
}

export function WeatherAlerts({ weather, className }: WeatherAlertsProps) {
  const alerts = []

  // Temperature alerts
  if (weather.main.temp > 35) {
    alerts.push({
      type: "warning",
      icon: <Thermometer className="h-4 w-4" />,
      message: "Extreme heat warning - Stay hydrated and avoid prolonged sun exposure",
    })
  } else if (weather.main.temp < -10) {
    alerts.push({
      type: "warning",
      icon: <Thermometer className="h-4 w-4" />,
      message: "Extreme cold warning - Dress warmly and limit outdoor exposure",
    })
  }

  // Wind alerts
  if (weather.wind.speed > 15) {
    alerts.push({
      type: "warning",
      icon: <Wind className="h-4 w-4" />,
      message: "Strong wind advisory - Secure loose objects and drive carefully",
    })
  }

  // Humidity alerts
  if (weather.main.humidity > 85) {
    alerts.push({
      type: "info",
      icon: <Droplets className="h-4 w-4" />,
      message: "High humidity levels - May feel warmer than actual temperature",
    })
  }

  // Visibility alerts
  if (weather.visibility < 1000) {
    alerts.push({
      type: "warning",
      icon: <AlertTriangle className="h-4 w-4" />,
      message: "Low visibility conditions - Exercise caution when driving",
    })
  }

  if (alerts.length === 0) {
    return (
      <Card className={cn("backdrop-blur-md bg-white/40 dark:bg-white/30 border-black/10 shadow-xl text-black", className)}>
        <CardContent className="flex items-center justify-center h-32 text-black/70">
          <div className="text-center">
            <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-emerald-600" />
            <p className="font-medium">No weather alerts</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn("backdrop-blur-md bg-white/40 dark:bg-white/30 border-black/10 shadow-xl text-black", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-black flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Weather Alerts
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {alerts.map((alert, index) => (
          <Alert key={index} className="bg-white/60 border-black/10 animate-pulse-slow text-black">
            <div className="flex items-start gap-2">
              <div className="text-black/80 mt-0.5">{alert.icon}</div>
              <AlertDescription className="text-black text-sm leading-relaxed font-medium">
                {alert.message}
              </AlertDescription>
            </div>
          </Alert>
        ))}
      </CardContent>
    </Card>
  )
}