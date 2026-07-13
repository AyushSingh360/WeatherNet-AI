"use client"

import { useState, useEffect, createContext, useContext, ReactNode } from "react"

export type TemperatureUnit = "celsius" | "fahrenheit"
export type WindSpeedUnit = "ms" | "kmh" | "mph" | "knots"
export type PressureUnit = "hpa" | "inhg" | "mmhg"
export type PrecipitationUnit = "mm" | "in"
export type DistanceUnit = "km" | "mi"

export interface UnitPreferences {
  temperature: TemperatureUnit
  windSpeed: WindSpeedUnit
  pressure: PressureUnit
  precipitation: PrecipitationUnit
  distance: DistanceUnit
}

const DEFAULT_PREFERENCES: UnitPreferences = {
  temperature: "celsius",
  windSpeed: "ms",
  pressure: "hpa",
  precipitation: "mm",
  distance: "km",
}

const STORAGE_KEY = "weathernet-unit-preferences"

function getStoredPreferences(): UnitPreferences {
  if (typeof window === "undefined") return DEFAULT_PREFERENCES
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      return { ...DEFAULT_PREFERENCES, ...parsed }
    }
  } catch (error) {
    console.error("Failed to parse unit preferences:", error)
  }
  return DEFAULT_PREFERENCES
}

function savePreferences(preferences: UnitPreferences) {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences))
  } catch (error) {
    console.error("Failed to save unit preferences:", error)
  }
}

interface UnitPreferencesContextType {
  preferences: UnitPreferences
  setPreferences: (preferences: Partial<UnitPreferences>) => void
  toggleTemperature: () => void
}

const UnitPreferencesContext = createContext<UnitPreferencesContextType | undefined>(undefined)

export function UnitPreferencesProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferencesState] = useState<UnitPreferences>(DEFAULT_PREFERENCES)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setPreferencesState(getStoredPreferences())
    setIsLoaded(true)
  }, [])

  const setPreferences = (newPrefs: Partial<UnitPreferences>) => {
    const updated = { ...preferences, ...newPrefs }
    setPreferencesState(updated)
    savePreferences(updated)
  }

  const toggleTemperature = () => {
    setPreferences({
      temperature: preferences.temperature === "celsius" ? "fahrenheit" : "celsius",
    })
  }

  return (
    <UnitPreferencesContext.Provider
      value={{ preferences, setPreferences, toggleTemperature }}
    >
      {children}
    </UnitPreferencesContext.Provider>
  )
}

export function useUnitPreferences() {
  const context = useContext(UnitPreferencesContext)
  if (!context) {
    throw new Error("useUnitPreferences must be used within a UnitPreferencesProvider")
  }
  return context
}

export function convertTemperature(
  celsius: number,
  unit: TemperatureUnit
): number {
  if (unit === "fahrenheit") {
    return Math.round(celsius * 9 / 5 + 32)
  }
  return Math.round(celsius)
}

export function convertWindSpeed(
  ms: number,
  unit: WindSpeedUnit
): number {
  switch (unit) {
    case "kmh":
      return Math.round(ms * 3.6)
    case "mph":
      return Math.round(ms * 2.237)
    case "knots":
      return Math.round(ms * 1.944)
    default:
      return Math.round(ms)
  }
}

export function convertPressure(
  hpa: number,
  unit: PressureUnit
): number {
  switch (unit) {
    case "inhg":
      return Math.round(hpa * 0.02953 * 100) / 100
    case "mmhg":
      return Math.round(hpa * 0.750062)
    default:
      return hpa
  }
}

export function convertDistance(
  meters: number,
  unit: DistanceUnit
): { value: number; unit: string } {
  if (unit === "mi") {
    return { value: Math.round(meters / 1609.34 * 10) / 10, unit: "mi" }
  }
  return { value: Math.round(meters / 1000 * 10) / 10, unit: "km" }
}

export function getTemperatureUnitLabel(unit: TemperatureUnit): string {
  return unit === "celsius" ? "°C" : "°F"
}

export function getWindSpeedUnitLabel(unit: WindSpeedUnit): string {
  switch (unit) {
    case "kmh": return "km/h"
    case "mph": return "mph"
    case "knots": return "kt"
    default: return "m/s"
  }
}

export function getPressureUnitLabel(unit: PressureUnit): string {
  switch (unit) {
    case "inhg": return "inHg"
    case "mmhg": return "mmHg"
    default: return "hPa"
  }
}

export function getDistanceUnitLabel(unit: DistanceUnit): string {
  return unit === "mi" ? "mi" : "km"
}