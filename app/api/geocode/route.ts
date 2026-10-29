import { NextResponse } from "next/server"
import {
  citySchema,
  checkRateLimit,
  rateLimitedResponse,
  cacheControl,
  fetchUpstream,
  upstreamError,
} from "@/lib/api-hardening"

export async function GET(request: Request) {
  const rate = checkRateLimit(request)
  if (!rate.allowed) return rateLimitedResponse(rate.resetAt)

  const apiKey = process.env.OPENWEATHERMAP_API_KEY

  if (!apiKey) {
    return NextResponse.json({ message: "API key is not configured" }, { status: 500 })
  }

  const { searchParams } = new URL(request.url)
  const parsed = citySchema.safeParse(searchParams.get("city") ?? "")

  if (!parsed.success) {
    return NextResponse.json(
      { message: parsed.error.issues[0]?.message || "Invalid city parameter" },
      { status: 422 },
    )
  }

  try {
    const response = await fetchUpstream(
      `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(parsed.data)}&limit=5&appid=${apiKey}`,
    )

    if (!response.ok) {
      return upstreamError(response, "Failed to fetch city suggestions")
    }

    const results = await response.json()
    const cities = (Array.isArray(results) ? results : []).map((r) => ({
      name: r.name,
      country: r.country,
      state: r.state ?? null,
      lat: r.lat,
      lon: r.lon,
    }))

    return NextResponse.json({ cities }, { headers: { "Cache-Control": cacheControl(3600) } })
  } catch (error) {
    console.error("Geocoding API error:", error)
    return NextResponse.json({ message: "Failed to fetch city suggestions" }, { status: 500 })
  }
}
