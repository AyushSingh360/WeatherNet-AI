"use client"

import { useQuery } from "@tanstack/react-query"
import type { CurrentWeather, ForecastData } from "@/types/weather"

interface WeatherResponse {
  current: CurrentWeather
  forecast: ForecastData[]
}

async function fetchWeather(city: string): Promise<WeatherResponse> {
  const [currentRes, forecastRes] = await Promise.all([
    fetch(`/api/weather?city=${encodeURIComponent(city)}`),
    fetch(`/api/forecast?city=${encodeURIComponent(city)}`),
  ])

  if (!currentRes.ok) {
    const error = await currentRes.json()
    throw new Error(error.message || "Failed to fetch current weather")
  }

  if (!forecastRes.ok) {
    const error = await forecastRes.json()
    throw new Error(error.message || "Failed to fetch forecast")
  }

  const current = await currentRes.json()
  const forecastData = await forecastRes.json()

  return {
    current,
    forecast: forecastData.list,
  }
}

export function useWeather(city: string) {
  return useQuery<WeatherResponse, Error>({
    queryKey: ["weather", city],
    queryFn: () => fetchWeather(city),
    enabled: !!city,
    staleTime: 5 * 60 * 1000,
  })
}