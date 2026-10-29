"use client"

import { useState, useEffect } from "react"

interface FavoriteCity {
  name: string
  country: string
  temp: number
  condition: string
  icon: string
}

const FAVORITES_KEY = "weather-favorites"

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteCity[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(FAVORITES_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed)) {
          setFavorites(parsed)
        }
      }
    } catch (error) {
      console.error("Failed to parse favorites from localStorage:", error)
    } finally {
      setIsLoaded(true)
    }
  }, [])

  useEffect(() => {
    if (!isLoaded) return
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites))
    } catch (error) {
      console.warn("Failed to persist favorites to localStorage:", error)
    }
  }, [favorites, isLoaded])

  const addFavorite = (city: FavoriteCity) => {
    setFavorites((prev) => [...prev.filter((fav) => fav.name !== city.name), city])
  }

  const removeFavorite = (cityName: string) => {
    setFavorites((prev) => prev.filter((fav) => fav.name !== cityName))
  }

  const isFavorite = (cityName: string) => {
    return favorites.some((fav) => fav.name === cityName)
  }

  return {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
  }
}
