import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export function formatTime(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function formatTimeAtTimezone(timestamp: number, offsetSeconds?: number): string {
  if (!timestamp || isNaN(timestamp)) return "--:--"
  const offset = typeof offsetSeconds === "number" && !isNaN(offsetSeconds) ? offsetSeconds : 0
  const date = new Date((timestamp + offset) * 1000)
  if (isNaN(date.getTime())) return "--:--"
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
  })
}

export function getWindDirection(deg: number): string {
  const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"]
  const normalized = ((deg % 360) + 360) % 360
  return directions[Math.round(normalized / 45) % 8]
}

export function formatDay(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleDateString("en-US", {
    weekday: "short",
  })
}

export function getWeatherIcon(iconCode: string): string {
  const iconMap: { [key: string]: string } = {
    "01d": "☀️", // clear sky day
    "01n": "🌙", // clear sky night
    "02d": "⛅", // few clouds day
    "02n": "☁️", // few clouds night
    "03d": "☁️", // scattered clouds
    "03n": "☁️",
    "04d": "☁️", // broken clouds
    "04n": "☁️",
    "09d": "🌧️", // shower rain
    "09n": "🌧️",
    "10d": "🌦️", // rain day
    "10n": "🌧️", // rain night
    "11d": "⛈️", // thunderstorm
    "11n": "⛈️",
    "13d": "❄️", // snow
    "13n": "❄️",
    "50d": "🌫️", // mist
    "50n": "🌫️",
  }
  
  return iconMap[iconCode] || "🌤️"
}