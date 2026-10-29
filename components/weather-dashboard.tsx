"use client"

import { useState } from "react"
import { AlertTriangle, Wind, Eye, Droplets, Thermometer, Bookmark, BookmarkCheck } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useWeather } from "@/hooks/use-weather"
import { useGeolocation } from "@/hooks/use-geolocation"
import { useFavorites } from "@/hooks/use-favorites"
import { useAirQuality } from "@/hooks/use-air-quality"
import { WeatherChart } from "@/components/weather-chart"
import { WeatherMap } from "@/components/weather-map"
import { AirQualityCard } from "@/components/air-quality-card"
import { WeatherAlerts } from "@/components/weather-alerts"
import { ForecastCard } from "@/components/forecast-card"
import { WeatherDetails } from "@/components/weather-details"
import { FavoritesPanel } from "@/components/favorites-panel"
import { HourlyStrip } from "@/components/hourly-strip"
import { Logo } from "@/components/logo"
import { SearchPanel } from "@/components/search-panel"
import { formatDate, formatTime, getWeatherIcon } from "@/lib/utils"
import { toast } from "@/hooks/use-toast"
import {
  WeatherCardSkeleton,
  AirQualityCardSkeleton,
  TabsSkeleton,
  SearchSkeleton,
} from "@/components/skeletons"
import {
  useUnitPreferences,
  convertTemperature,
  convertWindSpeed,
  convertPressure,
  convertDistance,
  getTemperatureUnitLabel,
  getWindSpeedUnitLabel,
  getPressureUnitLabel,
  getDistanceUnitLabel,
} from "@/hooks/use-unit-preferences"

export function WeatherDashboard() {
  const [city, setCity] = useState("London")
  const [activeTab, setActiveTab] = useState("current")

  const { data: weatherData, isLoading, isFetching, error, refetch } = useWeather(city)
  const { isLoading: locationLoading, getCurrentLocation } = useGeolocation()
  const { favorites, addFavorite, removeFavorite, isFavorite } = useFavorites()
  const { data: airQualityData, isLoading: airQualityLoading } = useAirQuality(
    weatherData?.current?.coord?.lat,
    weatherData?.current?.coord?.lon,
  )
  const { preferences } = useUnitPreferences()

  const currentWeather = weatherData?.current
  const forecast = weatherData?.forecast

  const handleCitySelect = (query: string, label: string) => {
    setCity(query)
    toast({
      title: "Weather updated",
      description: `Showing weather for ${label}`,
    })
  }

  const handleLocationClick = async () => {
    try {
      const newLocation = await getCurrentLocation()
      if (newLocation) {
        setCity(`${newLocation.lat},${newLocation.lon}`)
        toast({
          title: "Location detected",
          description: "Weather updated for your current location",
        })
      }
    } catch {
      toast({
        title: "Location error",
        description: "Unable to get your location. Please check permissions.",
        variant: "destructive",
      })
    }
  }

  const handleFavoriteToggle = () => {
    if (!currentWeather) return

    if (isFavorite(currentWeather.name)) {
      removeFavorite(currentWeather.name)
      toast({
        title: "Removed from favorites",
        description: `${currentWeather.name} has been removed from your favorites`,
      })
    } else {
      addFavorite({
        name: currentWeather.name,
        country: currentWeather.sys.country,
        temp: Math.round(currentWeather.main.temp),
        condition: currentWeather.weather[0].main,
        icon: currentWeather.weather[0].icon,
      })
      toast({
        title: "Added to favorites",
        description: `${currentWeather.name} has been added to your favorites`,
      })
    }
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4 text-black">
        <Logo size="sm" className="opacity-70" />
        <Alert className="max-w-md animate-fade-in bg-white/50 border-black/15 text-black">
          <AlertTriangle className="h-4 w-4 text-black" />
          <AlertDescription className="text-center text-black font-medium">
            {error?.message || "An unknown error occurred"}
          </AlertDescription>
        </Alert>
        <Button
          onClick={() => refetch()}
          aria-label="Retry loading weather data"
          className="bg-white/50 hover:bg-white/70 text-black border border-black/15 transition-all duration-300 hover:scale-105"
        >
          Try again
        </Button>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in text-black">
        <SearchSkeleton />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <WeatherCardSkeleton className="lg:col-span-2" />
          <div className="space-y-6">
            <AirQualityCardSkeleton />
          </div>
        </div>
        <TabsSkeleton />
      </div>
    )
  }

  const metricTiles = currentWeather
    ? [
        {
          id: "wind",
          icon: <Wind className="h-5 w-5 text-black/80 mx-auto mb-1" />,
          label: "Wind",
          value: `${convertWindSpeed(currentWeather.wind.speed, preferences.windSpeed)}${getWindSpeedUnitLabel(preferences.windSpeed)}`,
        },
        {
          id: "humidity",
          icon: <Droplets className="h-5 w-5 text-black/80 mx-auto mb-1" />,
          label: "Humidity",
          value: `${currentWeather.main.humidity}%`,
        },
        {
          id: "visibility",
          icon: <Eye className="h-5 w-5 text-black/80 mx-auto mb-1" />,
          label: "Visibility",
          value: `${convertDistance(currentWeather.visibility, preferences.distance).value}${getDistanceUnitLabel(preferences.distance)}`,
        },
        {
          id: "pressure",
          icon: <Thermometer className="h-5 w-5 text-black/80 mx-auto mb-1" />,
          label: "Pressure",
          value: `${convertPressure(currentWeather.main.pressure, preferences.pressure)}${getPressureUnitLabel(preferences.pressure)}`,
        },
      ]
    : []

  return (
    <div className="space-y-6 animate-fade-in text-black">
      <SearchPanel
        onSelect={handleCitySelect}
        onLocate={handleLocationClick}
        isFetching={isFetching}
        locationLoading={locationLoading}
      />

      {currentWeather && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 backdrop-blur-md bg-white/40 dark:bg-white/30 border-black/10 shadow-xl animate-slide-up text-black">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl text-black flex items-center gap-2">
                    {currentWeather.name}, {currentWeather.sys.country}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleFavoriteToggle}
                      aria-label={
                        isFavorite(currentWeather.name) ? "Remove from favorites" : "Add to favorites"
                      }
                      aria-pressed={isFavorite(currentWeather.name)}
                      className="text-black hover:bg-black/10 transition-all duration-300 hover:scale-110"
                    >
                      {isFavorite(currentWeather.name) ? (
                        <BookmarkCheck className="h-4 w-4 text-black" />
                      ) : (
                        <Bookmark className="h-4 w-4 text-black/70" />
                      )}
                    </Button>
                  </CardTitle>
                  <CardDescription className="text-black/70">
                    {formatDate(currentWeather.dt)} • {formatTime(currentWeather.dt)}
                  </CardDescription>
                </div>
                <div className="text-right">
                  <div className="text-5xl font-bold text-black animate-pulse-slow">
                    {convertTemperature(currentWeather.main.temp, preferences.temperature)}
                    {getTemperatureUnitLabel(preferences.temperature)}
                  </div>
                  <div className="text-black/80 capitalize font-medium">
                    {currentWeather.weather[0].description}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-6">
                <div className="text-6xl animate-bounce-slow">
                  {getWeatherIcon(currentWeather.weather[0].icon)}
                </div>
                <div className="text-right text-black/75">
                  <div className="font-medium">
                    Feels like {convertTemperature(currentWeather.main.feels_like, preferences.temperature)}
                    {getTemperatureUnitLabel(preferences.temperature)}
                  </div>
                  <div className="text-sm">
                    H: {convertTemperature(currentWeather.main.temp_max, preferences.temperature)}° L:{" "}
                    {convertTemperature(currentWeather.main.temp_min, preferences.temperature)}°
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {metricTiles.map((tile) => (
                  <div
                    key={tile.id}
                    className="text-center p-3 rounded-lg bg-white/40 backdrop-blur-sm border border-black/5 transition-all duration-300 hover:bg-white/60 hover:scale-105"
                  >
                    {tile.icon}
                    <div className="text-sm text-black/70 font-medium">{tile.label}</div>
                    <div className="font-semibold text-black">{tile.value}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <AirQualityCard
              airQuality={airQualityData}
              isLoading={airQualityLoading}
              className="animate-slide-up"
            />
            <WeatherAlerts weather={currentWeather} className="animate-slide-up" />
          </div>
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="animate-slide-up">
        <TabsList className="grid w-full grid-cols-4 bg-white/40 backdrop-blur-md border border-black/10 p-1">
          <TabsTrigger value="current" className="text-black/70 data-[state=active]:bg-white/90 data-[state=active]:text-black data-[state=active]:shadow-sm font-medium transition-all duration-300">
            Current
          </TabsTrigger>
          <TabsTrigger value="forecast" className="text-black/70 data-[state=active]:bg-white/90 data-[state=active]:text-black data-[state=active]:shadow-sm font-medium transition-all duration-300">
            Forecast
          </TabsTrigger>
          <TabsTrigger value="charts" className="text-black/70 data-[state=active]:bg-white/90 data-[state=active]:text-black data-[state=active]:shadow-sm font-medium transition-all duration-300">
            Charts
          </TabsTrigger>
          <TabsTrigger value="favorites" className="text-black/70 data-[state=active]:bg-white/90 data-[state=active]:text-black data-[state=active]:shadow-sm font-medium transition-all duration-300">
            Favorites
          </TabsTrigger>
        </TabsList>

        <TabsContent value="current" className="mt-6">
          {currentWeather && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <WeatherDetails weather={currentWeather} />
              <WeatherMap
                lat={currentWeather.coord?.lat}
                lon={currentWeather.coord?.lon}
                city={currentWeather.name}
              />
            </div>
          )}
        </TabsContent>

        <TabsContent value="forecast" className="mt-6 space-y-6">
          {forecast && forecast.length > 0 && (
            <>
              <HourlyStrip forecast={forecast} />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                {forecast.map((item, index) => (
                  <ForecastCard
                    key={item.dt}
                    forecast={item}
                    className="animate-slide-up"
                    style={{ animationDelay: `${index * 50}ms` }}
                  />
                ))}
              </div>
            </>
          )}
        </TabsContent>

        <TabsContent value="charts" className="mt-6">
          {forecast && <WeatherChart forecast={forecast} />}
        </TabsContent>

        <TabsContent value="favorites" className="mt-6">
          <FavoritesPanel
            favorites={favorites}
            onCitySelect={(city) => {
              setCity(city)
              setActiveTab("current")
            }}
            onRemoveFavorite={removeFavorite}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
