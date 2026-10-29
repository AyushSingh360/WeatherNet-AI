"use client"

import { Droplets } from "lucide-react"
import { getWeatherIcon, cn } from "@/lib/utils"
import { useUnitPreferences, convertTemperature, getTemperatureUnitLabel } from "@/hooks/use-unit-preferences"
import type { ForecastData } from "@/types/weather"

interface HourlyStripProps {
  forecast: ForecastData[]
  className?: string
}

interface HourBucket {
  dt: number
  label: string
  icon: string
  temp: number
  precip: number
}

function buildHours(forecast: ForecastData[], count: number): HourBucket[] {
  return forecast.slice(0, count).map((item, i) => {
    const cityLocal = new Date(`${item.dt_txt.replace(" ", "T")}Z`)
    let label: string
    if (i === 0) {
      label = "Now"
    } else {
      label = `${String(cityLocal.getUTCHours()).padStart(2, "0")}:00`
    }
    return {
      dt: item.dt,
      label,
      icon: item.weather[0]?.icon ?? "",
      temp: item.main.temp,
      precip: Math.round((item.pop ?? 0) * 100),
    }
  })
}

export function HourlyStrip({ forecast, className }: HourlyStripProps) {
  const { preferences } = useUnitPreferences()
  const unitLabel = getTemperatureUnitLabel(preferences.temperature)
  const nowLabel = new Date().toLocaleTimeString("en-US", { hour: "2-digit" })

  const hours: HourBucket[] = buildHours(forecast, 8)

  if (hours.length === 0) {
    return null
  }

  return (
    <div
      className={cn(
        "backdrop-blur-md bg-white/40 dark:bg-white/30 border border-black/10 shadow-xl rounded-2xl p-4 animate-slide-up text-black",
        className,
      )}
      aria-label="Hourly forecast for the next 24 hours"
    >
      <div className="flex items-center justify-between mb-3 px-1">
        <h3 className="text-sm font-semibold text-black uppercase tracking-wide">Next 24 hours</h3>
        <span className="text-black/60 text-xs font-medium">{nowLabel}</span>
      </div>
      <div
        className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        role="list"
        aria-label="Hour-by-hour forecast"
      >
        {hours.map((hour, i) => (
          <div
            key={hour.dt}
            role="listitem"
            className="flex-shrink-0 w-[76px] flex flex-col items-center gap-1 rounded-xl bg-white/40 border border-black/5 px-2 py-3 text-center transition-all duration-300 hover:bg-white/60"
            style={{ animationDelay: `${i * 40}ms` }}
          >
            <span className="text-black/70 text-xs font-medium">{hour.label}</span>
            <span className="text-2xl animate-bounce-slow" aria-hidden="true">
              {getWeatherIcon(hour.icon)}
            </span>
            <span className="text-black font-semibold text-sm">
              {convertTemperature(hour.temp, preferences.temperature)}
              {unitLabel}
            </span>
            {hour.precip > 0 ? (
              <span className="text-blue-700 font-medium text-[11px] flex items-center gap-0.5">
                <Droplets className="h-3 w-3" />
                {hour.precip}%
              </span>
            ) : (
              <span className="text-black/30 text-[11px]">—</span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
