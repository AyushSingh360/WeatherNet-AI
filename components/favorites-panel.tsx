"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, Trash2, MapPin } from "lucide-react"
import { getWeatherIcon } from "@/lib/utils"
import {
  useUnitPreferences,
  convertTemperature,
  getTemperatureUnitLabel,
} from "@/hooks/use-unit-preferences"

interface FavoriteCity {
  name: string
  country: string
  temp: number
  condition: string
  icon: string
}

interface FavoritesPanelProps {
  favorites: FavoriteCity[]
  onCitySelect: (city: string) => void
  onRemoveFavorite: (cityName: string) => void
}

export function FavoritesPanel({ favorites, onCitySelect, onRemoveFavorite }: FavoritesPanelProps) {
  const { preferences } = useUnitPreferences()
  const unitLabel = getTemperatureUnitLabel(preferences.temperature)
  if (favorites.length === 0) {
    return (
      <Card className="backdrop-blur-md bg-white/40 dark:bg-white/30 border-black/10 shadow-xl text-black">
        <CardContent className="flex flex-col items-center justify-center h-64 text-black/70">
          <Heart className="h-12 w-12 mb-4 text-black/40" />
          <p className="text-lg font-bold mb-2 text-black">No favorite cities yet</p>
          <p className="text-sm text-center text-black/60 font-medium">
            Add cities to your favorites by clicking the bookmark icon on the weather card
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-black">
      {favorites.map((city, index) => (
        <Card
          key={city.name}
          className="backdrop-blur-md bg-white/40 dark:bg-white/30 border-black/10 shadow-xl transition-all duration-300 hover:scale-105 hover:bg-white/60 cursor-pointer animate-slide-up text-black"
          style={{ animationDelay: `${index * 100}ms` }}
          onClick={() => onCitySelect(city.name)}
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-black text-lg flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-black/70" />
                {city.name}, {city.country}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  onRemoveFavorite(city.name)
                }}
                aria-label={`Remove ${city.name} from favorites`}
                className="text-black/60 hover:text-red-600 hover:bg-red-50 transition-all duration-300"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-black">
                  {convertTemperature(city.temp, preferences.temperature)}{unitLabel}
                </div>
                <div className="text-black/75 capitalize text-sm font-medium">{city.condition}</div>
              </div>
              <div className="text-4xl animate-bounce-slow">
                {getWeatherIcon(city.icon)}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}