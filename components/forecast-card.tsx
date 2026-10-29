"use client"

import { Card, CardContent } from "@/components/ui/card"
import { formatDay, formatTime, getWeatherIcon } from "@/lib/utils"
import { cn } from "@/lib/utils"
import type { ForecastData } from "@/types/weather"
import { useUnitPreferences, convertTemperature, getTemperatureUnitLabel } from "@/hooks/use-unit-preferences"

interface ForecastCardProps {
  forecast: ForecastData
  className?: string
  style?: React.CSSProperties
}

export function ForecastCard({ forecast, className, style }: ForecastCardProps) {
  const { preferences } = useUnitPreferences()

  return (
    <Card
      className={cn("backdrop-blur-md bg-white/40 dark:bg-white/30 border-black/10 shadow-xl transition-all duration-300 hover:scale-105 hover:bg-white/60 text-black", className)}
      style={style}
    >
      <CardContent className="p-4 text-center">
        <div className="text-black/80 font-semibold text-sm mb-1">
          {formatDay(forecast.dt)}
        </div>
        <div className="text-black/60 text-xs mb-3 font-medium">
          {formatTime(forecast.dt)}
        </div>
        <div className="text-3xl mb-3 animate-bounce-slow">
          {getWeatherIcon(forecast.weather[0].icon)}
        </div>
        <div className="text-black font-bold text-lg mb-1">
          {convertTemperature(forecast.main.temp, preferences.temperature)}
          {getTemperatureUnitLabel(preferences.temperature)}
        </div>
        <div className="text-black/80 text-xs capitalize mb-2 font-medium">
          {forecast.weather[0].description}
        </div>
        <div className="text-black/70 text-xs font-medium">
          {convertTemperature(forecast.main.temp_max, preferences.temperature)}° / {convertTemperature(forecast.main.temp_min, preferences.temperature)}°
        </div>
        {forecast.pop > 0 && (
          <div className="text-blue-700 font-semibold text-xs mt-2">
            💧 {Math.round(forecast.pop * 100)}%
          </div>
        )}
      </CardContent>
    </Card>
  )
}