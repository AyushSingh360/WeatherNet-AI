import { describe, expect, it } from "vitest"
import {
  cn,
  formatTime,
  formatTimeAtTimezone,
  getWindDirection,
  getWeatherIcon,
} from "@/lib/utils"

describe("getWindDirection", () => {
  it("maps degrees to compass labels", () => {
    expect(getWindDirection(0)).toBe("N")
    expect(getWindDirection(45)).toBe("NE")
    expect(getWindDirection(90)).toBe("E")
    expect(getWindDirection(135)).toBe("SE")
    expect(getWindDirection(180)).toBe("S")
    expect(getWindDirection(225)).toBe("SW")
    expect(getWindDirection(270)).toBe("W")
    expect(getWindDirection(315)).toBe("NW")
  })

  it("normalizes out-of-range degrees", () => {
    expect(getWindDirection(360)).toBe("N")
    expect(getWindDirection(-90)).toBe("W")
    expect(getWindDirection(405)).toBe("NE")
    expect(getWindDirection(-45)).toBe("NW")
  })
})

describe("formatTimeAtTimezone", () => {
  const timestamp = 1700000000

  it("applies the given timezone offset", () => {
    const base = new Date((timestamp) * 1000).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "UTC",
    })
    const shifted = new Date((timestamp + 3600) * 1000).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "UTC",
    })

    expect(formatTimeAtTimezone(timestamp, 0)).toBe(base)
    expect(formatTimeAtTimezone(timestamp, 39600)).not.toBe(base)
    expect(formatTimeAtTimezone(timestamp, 3600)).toBe(shifted)
  })

  it("formats timezone-shifted time for a full day offset", () => {
    const result = formatTimeAtTimezone(0, 12 * 3600)
    expect(result).toMatch(/12:00\s*(AM|PM)/i)
  })
})

describe("formatTime", () => {
  it("returns a hh:mm AM/PM string", () => {
    expect(formatTime(1700000000)).toMatch(/^\d{1,2}:\d{2}\s?(AM|PM)$/i)
  })
})

describe("getWeatherIcon", () => {
  it("maps known codes", () => {
    expect(getWeatherIcon("01d")).toBe("☀️")
    expect(getWeatherIcon("01n")).toBe("🌙")
    expect(getWeatherIcon("11d")).toBe("⛈️")
  })

  it("falls back for unknown codes", () => {
    expect(getWeatherIcon("99x")).toBe("🌤️")
    expect(getWeatherIcon("")).toBe("🌤️")
  })
})

describe("cn", () => {
  it("merges class names and dedupes tailwind conflicts", () => {
    expect(cn("p-2", "p-4")).toBe("p-4")
    expect(cn("text-white", false && "text-black")).toBe("text-white")
  })
})
