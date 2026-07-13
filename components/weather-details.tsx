"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sun, Moon, Wind, Eye, Droplets, Thermometer, Gauge, Cloud } from "lucide-react"
import { formatTime } from "@/lib/utils"
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

  const details = [
    {
      icon: <Sun className="h-5 w-5 text-yellow-400" />,
      label: "Sunrise",
      value: formatTime(weather.sys.sunrise),
    },
    {
      icon: <Moon className="h-5 w-5 text-blue-300" />,
      label: "Sunset",
      value: formatTime(weather.sys.sunset),
    },
    {
      icon: <Wind className="h-5 w-5 text-gray-300" />,
      label: "Wind Speed",
      value: `${convertWindSpeed(weather.wind.speed, preferences.windSpeed)} ${getWindSpeedUnitLabel(preferences.windSpeed)}`,
    },
    {
      icon: <Wind className="h-5 w-5 text-gray-300" />,
      label: "Wind Direction",
      value: `${weather.wind.deg}°`,
    },
    {
      icon: <Eye className="h-5 w-5 text-blue-400" />,
      label: "Visibility",
      value: `${convertDistance(weather.visibility, preferences.distance).value} ${getDistanceUnitLabel(preferences.distance)}`,
    },
    {
      icon: <Droplets className="h-5 w-5 text-blue-500" />,
      label: "Humidity",
      value: `${weather.main.humidity}%`,
    },
    {
      icon: <Gauge className="h-5 w-5 text-green-400" />,
      label: "Pressure",
      value: `${convertPressure(weather.main.pressure, preferences.pressure)} ${getPressureUnitLabel(preferences.pressure)}`,
    },
    {
      icon: <Cloud className="h-5 w-5 text-gray-400" />,
      label: "Cloudiness",
      value: `${weather.clouds.all}%`,
    },
  ]

  return (
    <Card className="backdrop-blur-md bg-white/10 dark:bg-black/20 border-white/20 shadow-xl animate-slide-up">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Thermometer className="h-5 w-5" />
          Weather Details
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {details.map((detail, index) => (
            <div 
              key={detail.label} 
              className={`p-3 rounded-lg bg-white/10 backdrop-blur-sm transition-all duration-300 hover:bg-white/20 hover:scale-105 animate-slide-up delay-${index * 50}`}
            >
              <div className="flex items-center gap-2 mb-1">
                {detail.icon}
                <span className="text-white/80 text-sm">{detail.label}</span>
              </div>
              <div className="font-semibold text-white">{detail.value}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}