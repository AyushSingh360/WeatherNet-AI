"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Wind, ChevronDown } from "lucide-react"
import {
  ComposedChart,
  LineChart,
  Line,
  Bar,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"
import {
  useUnitPreferences,
  convertTemperature,
  getTemperatureUnitLabel,
  convertPressure,
  getPressureUnitLabel,
  convertWindSpeed,
  getWindSpeedUnitLabel,
} from "@/hooks/use-unit-preferences"
import { cn } from "@/lib/utils"
import type { ForecastData } from "@/types/weather"

interface WeatherChartProps {
  forecast: ForecastData[]
}

type Range = "24h" | "5d"

const TOOLTIP_STYLE = {
  backgroundColor: "rgba(255,255,255,0.95)",
  border: "1px solid rgba(0,0,0,0.15)",
  borderRadius: "8px",
  color: "#000000",
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
}

const AXIS_STYLE = {
  stroke: "rgba(0,0,0,0.7)",
  fontSize: 12,
} as const

function cityLocalDate(item: ForecastData): Date {
  return new Date(`${item.dt_txt.replace(" ", "T")}Z`)
}

function labelFor(item: ForecastData, range: Range): string {
  const cityLocal = cityLocalDate(item)
  const hh = String(cityLocal.getUTCHours()).padStart(2, "0")
  if (range === "24h") {
    return `${hh}:${String(cityLocal.getUTCMinutes()).padStart(2, "0")}`
  }
  const weekday = cityLocal.toLocaleDateString("en-US", { weekday: "short", timeZone: "UTC" })
  return `${weekday} ${hh}h`
}

const RANGE_OPTIONS: Array<{ value: Range; label: string }> = [
  { value: "24h", label: "24h" },
  { value: "5d", label: "5 days" },
]

export function WeatherChart({ forecast }: WeatherChartProps) {
  const { preferences } = useUnitPreferences()
  const [range, setRange] = useState<Range>("24h")

  const items = range === "24h" ? forecast.slice(0, 8) : forecast

  const chartData = items.map((item) => ({
    time: labelFor(item, range),
    temp: convertTemperature(item.main.temp, preferences.temperature),
    feels: convertTemperature(item.main.feels_like, preferences.temperature),
    humidity: item.main.humidity,
    pressure: convertPressure(item.main.pressure, preferences.pressure),
    wind: convertWindSpeed(item.wind.speed, preferences.windSpeed),
    precip: Math.round((item.pop ?? 0) * 100),
  }))

  const tempUnit = getTemperatureUnitLabel(preferences.temperature)
  const pressureUnit = getPressureUnitLabel(preferences.pressure)
  const windUnit = getWindSpeedUnitLabel(preferences.windSpeed)

  return (
    <div className="space-y-6 text-black">
      <div className="flex justify-end">
        <div
          className="flex rounded-lg overflow-hidden border border-black/15 backdrop-blur-md bg-white/40 shadow-sm"
          role="group"
          aria-label="Forecast range"
        >
          {RANGE_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              aria-pressed={range === option.value}
              onClick={() => setRange(option.value)}
              className={cn(
                "px-3 py-1.5 text-sm font-medium transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-black/60",
                range === option.value
                  ? "bg-black text-white font-semibold shadow-inner"
                  : "text-black/70 hover:text-black hover:bg-black/5",
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="backdrop-blur-md bg-white/40 dark:bg-white/30 border-black/10 shadow-xl animate-slide-up text-black">
          <CardHeader>
            <CardTitle className="text-black flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Temperature {tempUnit} &amp; Precipitation %
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div role="img" aria-label={`Area chart of temperature in ${tempUnit} with precipitation probability bars`}>
              <ResponsiveContainer width="100%" height={220}>
                <ComposedChart data={chartData}>
                  <defs>
                    <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#000000" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#000000" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.08)" />
                  <XAxis dataKey="time" {...AXIS_STYLE} />
                  <YAxis yAxisId="temp" {...AXIS_STYLE} width={42} />
                  <YAxis
                    yAxisId="precip"
                    orientation="right"
                    domain={[0, 100]}
                    {...AXIS_STYLE}
                    width={36}
                  />
                  <Tooltip contentStyle={TOOLTIP_STYLE} />
                  <Legend wrapperStyle={{ color: "#000000", fontSize: 12 }} />
                  <Bar
                    yAxisId="precip"
                    dataKey="precip"
                    name="Precipitation %"
                    barSize={10}
                    fill="rgba(37,99,235,0.4)"
                    radius={[4, 4, 0, 0]}
                  />
                  <Area
                    yAxisId="temp"
                    type="monotone"
                    dataKey="temp"
                    name={`Temp (${tempUnit})`}
                    stroke="#000000"
                    strokeWidth={2}
                    fill="url(#tempGradient)"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-md bg-white/40 dark:bg-white/30 border-black/10 shadow-xl animate-slide-up text-black">
          <CardHeader>
            <CardTitle className="text-black flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Humidity &amp; Pressure ({pressureUnit})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div role="img" aria-label={`Line chart of humidity percent and pressure in ${pressureUnit}`}>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.08)" />
                  <XAxis dataKey="time" {...AXIS_STYLE} />
                  <YAxis yAxisId="humidity" {...AXIS_STYLE} width={42} />
                  <YAxis yAxisId="pressure" orientation="right" {...AXIS_STYLE} width={46} />
                  <Tooltip contentStyle={TOOLTIP_STYLE} />
                  <Legend wrapperStyle={{ color: "#000000", fontSize: 12 }} />
                  <Line
                    yAxisId="humidity"
                    type="monotone"
                    dataKey="humidity"
                    name="Humidity %"
                    stroke="#2563eb"
                    strokeWidth={2}
                    dot={{ fill: "#2563eb", strokeWidth: 2, r: 4 }}
                  />
                  <Line
                    yAxisId="pressure"
                    type="monotone"
                    dataKey="pressure"
                    name={`Pressure (${pressureUnit})`}
                    stroke="#059669"
                    strokeWidth={2}
                    dot={{ fill: "#059669", strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 backdrop-blur-md bg-white/40 dark:bg-white/30 border-black/10 shadow-xl animate-slide-up text-black">
          <CardHeader>
            <CardTitle className="text-black flex items-center gap-2">
              <Wind className="h-5 w-5" />
              Wind Speed ({windUnit})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div role="img" aria-label={`Line chart of wind speed in ${windUnit}`}>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.08)" />
                  <XAxis dataKey="time" {...AXIS_STYLE} />
                  <YAxis {...AXIS_STYLE} width={42} />
                  <Tooltip contentStyle={TOOLTIP_STYLE} />
                  <Legend wrapperStyle={{ color: "#000000", fontSize: 12 }} />
                  <Line
                    type="monotone"
                    dataKey="wind"
                    name={`Wind (${windUnit})`}
                    stroke="#000000"
                    strokeWidth={2}
                    dot={{ fill: "#000000", strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <DataFallbackTable data={chartData} />
    </div>
  )
}

function DataFallbackTable({ data }: { data: Array<Record<string, number | string>> }) {
  const columns = [
    { key: "time", label: "Time" },
    { key: "temp", label: "Temp" },
    { key: "humidity", label: "Humidity %" },
    { key: "pressure", label: "Pressure" },
    { key: "wind", label: "Wind" },
    { key: "precip", label: "Precip %" },
  ]

  return (
    <Card className="backdrop-blur-md bg-white/40 dark:bg-white/30 border-black/10 shadow-xl text-black">
      <CardContent className="p-4">
        <details>
          <summary className="text-black/80 text-sm cursor-pointer flex items-center gap-1 hover:text-black transition-colors font-medium">
            <ChevronDown className="h-4 w-4" />
            View as data table
          </summary>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-sm text-left text-black/90">
              <thead>
                <tr className="text-black/60 text-xs uppercase tracking-wide">
                  {columns.map((col) => (
                    <th key={col.key} scope="col" className="py-2 pr-4 font-semibold">
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row, i) => (
                  <tr key={i} className="border-t border-black/10">
                    {columns.map((col) => (
                      <td key={col.key} className="py-1.5 pr-4 font-medium">
                        {row[col.key]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
      </CardContent>
    </Card>
  )
}
