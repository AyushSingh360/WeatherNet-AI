"use client"

import {
  useUnitPreferences,
  getTemperatureUnitLabel,
  getWindSpeedUnitLabel,
  type TemperatureUnit,
  type WindSpeedUnit,
} from "@/hooks/use-unit-preferences"
import { cn } from "@/lib/utils"

const TEMPERATURE_UNITS: TemperatureUnit[] = ["celsius", "fahrenheit"]
const WIND_UNITS: WindSpeedUnit[] = ["ms", "kmh", "mph", "knots"]

export function UnitToggle() {
  const { preferences, setPreferences } = useUnitPreferences()

  return (
    <div className="flex items-center gap-4 text-black" role="group" aria-label="Unit preferences">
      <div
        className="flex rounded-lg overflow-hidden border border-black/15 backdrop-blur-md bg-white/40 shadow-sm"
        role="group"
        aria-label="Temperature units"
      >
        {TEMPERATURE_UNITS.map((unit) => (
          <button
            key={unit}
            type="button"
            aria-pressed={preferences.temperature === unit}
            onClick={() => setPreferences({ temperature: unit })}
            className={cn(
              "px-3 py-1.5 text-sm font-medium transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-black/60",
              preferences.temperature === unit
                ? "bg-black text-white shadow-inner font-semibold"
                : "text-black/70 hover:text-black hover:bg-black/5",
            )}
          >
            {getTemperatureUnitLabel(unit)}
          </button>
        ))}
      </div>

      <label className="flex items-center gap-2 text-xs text-black/70 font-medium">
        <span>Wind</span>
        <select
          aria-label="Wind speed unit"
          value={preferences.windSpeed}
          onChange={(e) => setPreferences({ windSpeed: e.target.value as WindSpeedUnit })}
          className="rounded-md border border-black/15 bg-white/40 text-black text-sm px-2 py-1 backdrop-blur-md focus:outline-none focus-visible:ring-2 focus-visible:ring-black/60 [&>option]:bg-white [&>option]:text-black transition-all duration-300"
        >
          {WIND_UNITS.map((unit) => (
            <option key={unit} value={unit}>
              {getWindSpeedUnitLabel(unit)}
            </option>
          ))}
        </select>
      </label>
    </div>
  )
}
