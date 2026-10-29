"use client"

import { useEffect, useState } from "react"
import { useQuery } from "@tanstack/react-query"

export interface CitySuggestion {
  name: string
  country: string
  state: string | null
  lat: number
  lon: number
}

async function fetchCities(query: string): Promise<CitySuggestion[]> {
  const response = await fetch(`/api/geocode?city=${encodeURIComponent(query)}`)
  if (!response.ok) return []
  const data = await response.json()
  return Array.isArray(data?.cities) ? data.cities : []
}

export function useCitySearch(query: string) {
  const trimmed = query.trim()
  const [debounced, setDebounced] = useState(trimmed)

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(trimmed), 300)
    return () => clearTimeout(timer)
  }, [trimmed])

  return useQuery<CitySuggestion[], Error>({
    queryKey: ["city-search", debounced],
    queryFn: () => fetchCities(debounced),
    enabled: debounced.length >= 2,
    staleTime: 30 * 60 * 1000,
  })
}
