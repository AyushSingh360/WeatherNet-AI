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
      `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(parsed.data)}&units=metric&appid=${apiKey}`,
    )

    if (!response.ok) {
      return upstreamError(response, "Failed to fetch forecast data")
    }

    const data = await response.json()
    return NextResponse.json(data, { headers: { "Cache-Control": cacheControl(600) } })
  } catch (error) {
    console.error("Forecast API error:", error)
    return NextResponse.json({ message: "Failed to fetch forecast data" }, { status: 500 })
  }
}
