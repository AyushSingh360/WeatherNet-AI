import { NextResponse } from "next/server"
import {
  coordsSchema,
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
  const parsed = coordsSchema.safeParse({
    lat: searchParams.get("lat"),
    lon: searchParams.get("lon"),
  })

  if (!parsed.success) {
    return NextResponse.json(
      { message: parsed.error.issues[0]?.message || "Invalid coordinates" },
      { status: 422 },
    )
  }

  const { lat, lon } = parsed.data

  try {
    const response = await fetchUpstream(
      `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`,
    )

    if (!response.ok) {
      return upstreamError(response, "Failed to fetch air quality data")
    }

    const data = await response.json()
    return NextResponse.json(data, { headers: { "Cache-Control": cacheControl(600) } })
  } catch (error) {
    console.error("Air quality API error:", error)
    return NextResponse.json({ message: "Failed to fetch air quality data" }, { status: 500 })
  }
}
