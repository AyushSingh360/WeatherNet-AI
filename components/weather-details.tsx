"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sun, Moon, Wind, Eye, Droplets, Thermometer, Gauge, Cloud } from "lucide-react"
import { formatTimeAtTimezone, getWindDirection } from "@/lib/utils"
import type { CurrentWeather } from "@/types/weather"
import { 
  useUnitPreferences, 
  convertWindSpeed, 
  convertPressure, 
  convertDistance, 
  getWindSpeedUnitLabel, 
  getDistanceUnitLabel, 
  getPressureUnitLabel 
} from "@/hooks/use-unit-preferences"

interface WeatherDetailsProps {
  weather: CurrentWeather
}

export function WeatherDetails({ weather }: WeatherDetailsProps) {
  const { preferences } = useUnitPreferences()
  const timezoneOffset = (weather as unknown as { timezone?: number }).timezone ?? weather.sys?.timezone ?? 0

  const details = [
    {
      icon: <Sun className="h-5 w-5 text-amber-500" />,
      label: "Sunrise",
      value: formatTimeAtTimezone(weather.sys.sunrise, timezoneOffset),
    },
    {
      icon: <Moon className="h-5 w-5 text-indigo-500" />,
      label: "Sunset",
      value: formatTimeAtTimezone(weather.sys.sunset, timezoneOffset),
    },
    {
      icon: <Wind className="h-5 w-5 text-black/70" />,
      label: "Wind Speed",
      value: `${convertWindSpeed(weather.wind.speed, preferences.windSpeed)} ${getWindSpeedUnitLabel(preferences.windSpeed)}`,
    },
    {
      icon: <Wind className="h-5 w-5 text-black/70" />,
      label: "Wind Direction",
      value: `${getWindDirection(weather.wind.deg)} (${Math.round(weather.wind.deg)}°)`,
    },
    {
      icon: <Eye className="h-5 w-5 text-sky-600" />,
      label: "Visibility",
      value: `${convertDistance(weather.visibility, preferences.distance).value} ${getDistanceUnitLabel(preferences.distance)}`,
    },
    {
      icon: <Droplets className="h-5 w-5 text-blue-600" />,
      label: "Humidity",
      value: `${weather.main.humidity}%`,
    },
    {
      icon: <Gauge className="h-5 w-5 text-emerald-600" />,
      label: "Pressure",
      value: `${convertPressure(weather.main.pressure, preferences.pressure)} ${getPressureUnitLabel(preferences.pressure)}`,
    },
    {
      icon: <Cloud className="h-5 w-5 text-zinc-600" />,
      label: "Cloudiness",
      value: `${weather.clouds.all}%`,
    },
  ]

  return (
    <Card className="backdrop-blur-md bg-white/40 dark:bg-white/30 border-black/10 shadow-xl animate-slide-up text-black">
      <CardHeader>
        <CardTitle className="text-black flex items-center gap-2">
          <Thermometer className="h-5 w-5" />
          Weather Details
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {details.map((detail, index) => (
            <div
              key={detail.label}
              className="p-3 rounded-lg bg-white/40 backdrop-blur-sm border border-black/5 transition-all duration-300 hover:bg-white/60 hover:scale-105 animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-center gap-2 mb-1">
                {detail.icon}
                <span className="text-black/70 text-sm font-medium">{detail.label}</span>
              </div>
              <div className="font-semibold text-black">{detail.value}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}