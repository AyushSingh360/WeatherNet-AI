"use client"

import { useQuery } from "@tanstack/react-query"

interface AirQualityData {
  list: Array<{
    main: {
      aqi: number
    }
    components: {
      co: number
      no: number
      no2: number
      o3: number
      so2: number
      pm2_5: number
      pm10: number
      nh3: number
    }
  }>
}

async function fetchAirQuality(lat: number, lon: number): Promise<AirQualityData> {
  const response = await fetch(`/api/air-quality?lat=${lat}&lon=${lon}`)
  
  if (!response.ok) {
    throw new Error("Failed to fetch air quality data")
  }
  
  return response.json()
}

export function useAirQuality(lat?: number, lon?: number) {
  return useQuery<AirQualityData, Error>({
    queryKey: ["air-quality", lat, lon],
    queryFn: () => fetchAirQuality(lat!, lon!),
    enabled: lat !== undefined && lon !== undefined,
    staleTime: 10 * 60 * 1000,
  })
}