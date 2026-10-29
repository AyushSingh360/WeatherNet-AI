"use client"

import { useQuery } from "@tanstack/react-query"
import type { AirQuality } from "@/types/weather"

async function fetchAirQuality(lat: number, lon: number): Promise<AirQuality> {
  const response = await fetch(`/api/air-quality?lat=${lat}&lon=${lon}`)

  if (!response.ok) {
    let message = "Failed to fetch air quality data"
    try {
      const body = await response.json()
      if (body?.message) message = body.message
    } catch {
      // non-JSON error body; keep generic message
    }
    throw new Error(message)
  }

  return response.json()
}

export function useAirQuality(lat?: number, lon?: number) {
  return useQuery<AirQuality, Error>({
    queryKey: ["air-quality", lat, lon],
    queryFn: () => fetchAirQuality(lat!, lon!),
    enabled: lat !== undefined && lon !== undefined,
    staleTime: 10 * 60 * 1000,
    refetchInterval: 15 * 60 * 1000,
  })
}