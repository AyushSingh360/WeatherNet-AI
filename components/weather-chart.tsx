"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp } from "lucide-react"
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts"
import { useUnitPreferences, convertTemperature, getTemperatureUnitLabel, convertPressure, getPressureUnitLabel } from "@/hooks/use-unit-preferences"
import { formatTime } from "@/lib/utils"
import type { ForecastData } from "@/types/weather"

interface WeatherChartProps {
  forecast: ForecastData[]
}

export function WeatherChart({ forecast }: WeatherChartProps) {
  const { preferences } = useUnitPreferences()

  const chartData = forecast.slice(0, 8).map(item => ({
    time: formatTime(item.dt),
    temp: convertTemperature(item.main.temp, preferences.temperature),
    humidity: item.main.humidity,
    pressure: convertPressure(item.main.pressure, preferences.pressure),
  }))

  const tempUnit = getTemperatureUnitLabel(preferences.temperature)
  const pressureUnit = getPressureUnitLabel(preferences.pressure)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="backdrop-blur-md bg-white/10 dark:bg-black/20 border-white/20 shadow-xl animate-slide-up">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Temperature Trend ({tempUnit})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ffffff" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#ffffff" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis 
                dataKey="time" 
                stroke="rgba(255,255,255,0.7)"
                fontSize={12}
              />
              <YAxis 
                stroke="rgba(255,255,255,0.7)"
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgba(0,0,0,0.8)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '8px',
                  color: 'white'
                }}
              />
              <Area
                type="monotone"
                dataKey="temp"
                stroke="#ffffff"
                strokeWidth={2}
                fill="url(#tempGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="backdrop-blur-md bg-white/10 dark:bg-black/20 border-white/20 shadow-xl animate-slide-up delay-100">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Humidity & Pressure ({pressureUnit})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis 
                dataKey="time" 
                stroke="rgba(255,255,255,0.7)"
                fontSize={12}
              />
              <YAxis 
                yAxisId="humidity"
                stroke="rgba(255,255,255,0.7)"
                fontSize={12}
              />
              <YAxis 
                yAxisId="pressure"
                orientation="right"
                stroke="rgba(255,255,255,0.7)"
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgba(0,0,0,0.8)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '8px',
                  color: 'white'
                }}
              />
              <Line
                yAxisId="humidity"
                type="monotone"
                dataKey="humidity"
                stroke="#ffffff"
                strokeWidth={2}
                dot={{ fill: '#ffffff', strokeWidth: 2, r: 4 }}
              />
              <Line
                yAxisId="pressure"
                type="monotone"
                dataKey="pressure"
                stroke="#cccccc"
                strokeWidth={2}
                dot={{ fill: '#cccccc', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}