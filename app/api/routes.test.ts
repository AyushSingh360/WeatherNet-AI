// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { GET as getWeather } from "@/app/api/weather/route"
import { GET as getForecast } from "@/app/api/forecast/route"
import { GET as getAirQuality } from "@/app/api/air-quality/route"
import { GET as getGeocode } from "@/app/api/geocode/route"

let ipCounter = 0

function apiRequest(path: string, query: Record<string, string> = {}): Request {
  ipCounter += 1
  const params = new URLSearchParams(query)
  return new Request(`http://localhost:3000${path}?${params}`, {
    headers: { "x-forwarded-for": `192.0.2.${ipCounter}` },
  })
}

function okResponse(data: unknown): Response {
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { "content-type": "application/json" },
  })
}

beforeEach(() => {
  process.env.OPENWEATHERMAP_API_KEY = "test-key"
})

afterEach(() => {
  vi.unstubAllGlobals()
  vi.unstubAllEnvs()
})

describe("GET /api/weather", () => {
  it("returns 422 and skips upstream for a missing city", async () => {
    const fetchSpy = vi.fn()
    vi.stubGlobal("fetch", fetchSpy)
    const response = await getWeather(apiRequest("/api/weather"))
    expect(response.status).toBe(422)
    expect(await response.json()).toMatchObject({ message: "City parameter is required" })
    expect(fetchSpy).not.toHaveBeenCalled()
  })

  it("returns 422 for injection-style cities", async () => {
    const fetchSpy = vi.fn()
    vi.stubGlobal("fetch", fetchSpy)
    const response = await getWeather(apiRequest("/api/weather", { city: "London<script>" }))
    expect(response.status).toBe(422)
    expect(fetchSpy).not.toHaveBeenCalled()
  })

  it("returns data with cache headers on success", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(okResponse({ name: "London" })))
    const response = await getWeather(apiRequest("/api/weather", { city: "London" }))
    expect(response.status).toBe(200)
    expect(await response.json()).toMatchObject({ name: "London" })
    expect(response.headers.get("cache-control")).toContain("s-maxage=600")
  })

  it("forwards upstream error status and message", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ message: "city not found" }), { status: 404 }),
      ),
    )
    const response = await getWeather(apiRequest("/api/weather", { city: "Nowhere" }))
    expect(response.status).toBe(404)
    expect(await response.json()).toMatchObject({ message: "city not found" })
  })

  it("falls back to a generic message for non-JSON upstream errors", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response("Unauthorized", { status: 401 })),
    )
    const response = await getWeather(apiRequest("/api/weather", { city: "London" }))
    expect(response.status).toBe(401)
    expect(await response.json()).toMatchObject({ message: "Failed to fetch weather data" })
  })

  it("returns 500 when the API key is missing", async () => {
    vi.stubEnv("OPENWEATHERMAP_API_KEY", "")
    vi.stubGlobal("fetch", vi.fn())
    const response = await getWeather(apiRequest("/api/weather", { city: "London" }))
    expect(response.status).toBe(500)
  })
})

describe("GET /api/forecast", () => {
  it("returns 200 with cache headers on success", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(okResponse({ list: [] })))
    const response = await getForecast(apiRequest("/api/forecast", { city: "London" }))
    expect(response.status).toBe(200)
    expect(response.headers.get("cache-control")).toContain("s-maxage=600")
  })

  it("returns 422 for an invalid city", async () => {
    const fetchSpy = vi.fn()
    vi.stubGlobal("fetch", fetchSpy)
    const response = await getForecast(apiRequest("/api/forecast", { city: "London&zap=1" }))
    expect(response.status).toBe(422)
    expect(fetchSpy).not.toHaveBeenCalled()
  })
})

describe("GET /api/air-quality", () => {
  it("returns 422 for out-of-range latitude", async () => {
    const fetchSpy = vi.fn()
    vi.stubGlobal("fetch", fetchSpy)
    const response = await getAirQuality(apiRequest("/api/air-quality", { lat: "91", lon: "0" }))
    expect(response.status).toBe(422)
    expect(await response.json()).toMatchObject({ message: "Latitude out of range" })
    expect(fetchSpy).not.toHaveBeenCalled()
  })

  it("rejects non-numeric input before reaching upstream", async () => {
    const fetchSpy = vi.fn()
    vi.stubGlobal("fetch", fetchSpy)
    const response = await getAirQuality(
      apiRequest("/api/air-quality", { lat: "1&zap=1", lon: "2" }),
    )
    expect(response.status).toBe(422)
    expect(fetchSpy).not.toHaveBeenCalled()
  })

  it("returns numeric bounds-corrected data with cache headers", async () => {
    const fetchSpy = vi.fn().mockResolvedValue(okResponse({ list: [{ main: { aqi: 2 } }] }))
    vi.stubGlobal("fetch", fetchSpy)
    const response = await getAirQuality(apiRequest("/api/air-quality", { lat: "51.5", lon: "-0.12" }))
    expect(response.status).toBe(200)
    expect(response.headers.get("cache-control")).toContain("s-maxage=600")
    expect(String(fetchSpy.mock.calls[0][0])).toContain("lat=51.5&lon=-0.12")
  })
})

describe("GET /api/geocode", () => {
  it("returns mapped city suggestions on success", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        okResponse([{ name: "Paris", country: "FR", state: "Île-de-France", lat: 48.85, lon: 2.35 }]),
      ),
    )
    const response = await getGeocode(apiRequest("/api/geocode", { city: "Paris" }))
    expect(response.status).toBe(200)
    const body = await response.json()
    expect(body.cities).toHaveLength(1)
    expect(body.cities[0]).toMatchObject({ name: "Paris", country: "FR", state: "Île-de-France" })
    expect(response.headers.get("cache-control")).toContain("s-maxage=3600")
  })

  it("normalizes non-string state fields", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(okResponse([{ name: "Paris", country: "FR", lat: 48.85, lon: 2.35 }])),
    )
    const response = await getGeocode(apiRequest("/api/geocode", { city: "Paris" }))
    const body = await response.json()
    expect(body.cities[0].state).toBeNull()
  })

  it("returns 422 when city is missing", async () => {
    const fetchSpy = vi.fn()
    vi.stubGlobal("fetch", fetchSpy)
    const response = await getGeocode(apiRequest("/api/geocode"))
    expect(response.status).toBe(422)
    expect(fetchSpy).not.toHaveBeenCalled()
  })
})
