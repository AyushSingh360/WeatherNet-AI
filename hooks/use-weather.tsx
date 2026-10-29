"use client"

import { useQuery, keepPreviousData } from "@tanstack/react-query"
import type { CurrentWeather, ForecastData } from "@/types/weather"

interface WeatherResponse {
  current: CurrentWeather
  forecast: ForecastData[]
}

async function parseError(response: Response, fallback: string): Promise<Error> {
  try {
    const body = await response.json()
    return new Error(body?.message || fallback)
  } catch {
    return new Error(fallback)
  }
}

async function fetchWeather(city: string): Promise<WeatherResponse> {
  const [weatherResult, forecastResult] = await Promise.allSettled([
    fetch(`/api/weather?city=${encodeURIComponent(city)}`),
    fetch(`/api/forecast?city=${encodeURIComponent(city)}`),
  ])

  if (weatherResult.status === "rejected") {
    throw new Error("Network error while fetching current weather")
  }

  const weatherRes = weatherResult.value
  if (!weatherRes.ok) {
    const error = await parseError(weatherRes, "Failed to fetch current weather")
    throw error
  }

  const current: CurrentWeather = await weatherRes.json()

  let forecast: ForecastData[] = []
  if (forecastResult.status === "fulfilled" && forecastResult.value.ok) {
    const forecastData = await forecastResult.value.json()
    forecast = forecastData.list
  } else {
    console.warn("Forecast data unavailable for city:", city)
  }

  return {
    current,
    forecast,
  }
}

export function useWeather(city: string) {
  return useQuery<WeatherResponse, Error>({
    queryKey: ["weather", city],
    queryFn: () => fetchWeather(city),
    enabled: !!city,
    staleTime: 5 * 60 * 1000,
    placeholderData: keepPreviousData,
    refetchInterval: 10 * 60 * 1000,
  })
}
