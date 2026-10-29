"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Activity, AlertTriangle } from "lucide-react"
import { LoadingSpinner } from "@/components/loading-spinner"
import { cn } from "@/lib/utils"
import type { AirQuality } from "@/types/weather"

interface AirQualityCardProps {
  airQuality: AirQuality | undefined
  isLoading: boolean
  className?: string
}

const AQI_LEVELS: Record<number, { label: string; color: string }> = {
  1: { label: "Good", color: "bg-emerald-600 text-white" },
  2: { label: "Fair", color: "bg-lime-600 text-white" },
  3: { label: "Moderate", color: "bg-amber-600 text-white" },
  4: { label: "Poor", color: "bg-orange-600 text-white" },
  5: { label: "Very Poor", color: "bg-rose-700 text-white" },
}

const UNKNOWN_LEVEL = { label: "Unknown", color: "bg-gray-600 text-white" }

const POLLUTANTS: Array<{ key: keyof AirQuality["list"][0]["components"]; label: string }> = [
  { key: "pm2_5", label: "PM2.5" },
  { key: "pm10", label: "PM10" },
  { key: "o3", label: "O₃" },
  { key: "no2", label: "NO₂" },
]

export function AirQualityCard({ airQuality, isLoading, className }: AirQualityCardProps) {
  if (isLoading) {
    return (
      <Card className={cn("backdrop-blur-md bg-white/40 dark:bg-white/30 border-black/10 shadow-xl text-black", className)}>
        <CardContent className="flex items-center justify-center h-32">
          <LoadingSpinner />
        </CardContent>
      </Card>
    )
  }

  if (!airQuality?.list?.[0]) {
    return (
      <Card className={cn("backdrop-blur-md bg-white/40 dark:bg-white/30 border-black/10 shadow-xl text-black", className)}>
        <CardContent className="flex items-center justify-center h-32 text-black/70">
          <div className="text-center">
            <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-black/60" />
            <p className="font-medium">Air quality data unavailable</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const aqi = airQuality.list[0].main.aqi
  const components = airQuality.list[0].components
  const level = AQI_LEVELS[aqi] ?? UNKNOWN_LEVEL

  return (
    <Card className={cn("backdrop-blur-md bg-white/40 dark:bg-white/30 border-black/10 shadow-xl transition-all duration-300 hover:scale-105 text-black", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-black flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Air Quality
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className="text-3xl font-bold text-black mb-1">{aqi}</div>
          <Badge className={`${level.color} font-medium shadow-sm hover:opacity-90 transition-all duration-300`}>
            {level.label}
          </Badge>
          <p className="text-black/60 text-xs mt-2 font-medium">OpenWeather scale 1–5</p>
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm">
          {POLLUTANTS.map(({ key, label }) => (
            <div
              key={key}
              className="text-center p-2 rounded-lg bg-white/40 border border-black/5 backdrop-blur-sm"
            >
              <div className="text-black/70 text-xs font-medium">{label}</div>
              <div className="font-semibold text-black">
                {components[key].toFixed(1)}
                <span className="text-black/60 text-xs ml-1 font-normal">µg/m³</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}