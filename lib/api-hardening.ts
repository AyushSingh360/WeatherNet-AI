import { NextResponse } from "next/server"
import { z } from "zod"

const RATE_LIMIT = 30
const RATE_WINDOW_MS = 60_000
const OWM_TIMEOUT_MS = 8000
const MAX_BUCKETS = 10_000

export const citySchema = z
  .string()
  .trim()
  .min(1, "City parameter is required")
  .max(100, "City name is too long")
  .regex(/^[\p{L}\p{N}\s,.'-]+$/u, "City name contains invalid characters")

export const coordsSchema = z.object({
  lat: z.coerce.number().min(-90, "Latitude out of range").max(90, "Latitude out of range"),
  lon: z.coerce.number().min(-180, "Longitude out of range").max(180, "Longitude out of range"),
})

interface RateBucket {
  count: number
  resetAt: number
}

const buckets = new Map<string, RateBucket>()

function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for")
  if (forwarded) return forwarded.split(",")[0].trim()
  return request.headers.get("x-real-ip") || "unknown"
}

export function checkRateLimit(request: Request, limit = RATE_LIMIT, windowMs = RATE_WINDOW_MS) {
  const ip = clientIp(request)
  const now = Date.now()
  const bucket = buckets.get(ip)

  if (!bucket || bucket.resetAt <= now) {
    if (buckets.size > MAX_BUCKETS) {
      for (const [key, b] of buckets) {
        if (b.resetAt <= now) buckets.delete(key)
      }
    }
    buckets.set(ip, { count: 1, resetAt: now + windowMs })
    return { allowed: true, resetAt: now + windowMs }
  }

  if (bucket.count >= limit) {
    return { allowed: false, resetAt: bucket.resetAt }
  }

  bucket.count += 1
  return { allowed: true, resetAt: bucket.resetAt }
}

export function rateLimitedResponse(resetAt: number) {
  const retryAfter = Math.max(1, Math.ceil((resetAt - Date.now()) / 1000))
  return NextResponse.json(
    { message: "Too many requests. Please try again shortly." },
    { status: 429, headers: { "Retry-After": String(retryAfter) } },
  )
}

export function cacheControl(seconds: number) {
  return `public, max-age=0, s-maxage=${seconds}, stale-while-revalidate=${seconds * 6}`
}

export async function fetchUpstream(url: string): Promise<Response> {
  return fetch(url, { signal: AbortSignal.timeout(OWM_TIMEOUT_MS) })
}

export async function upstreamError(response: Response, fallbackMessage: string) {
  let message = fallbackMessage
  try {
    const data = await response.json()
    if (data?.message) message = data.message
  } catch {
    console.warn("Upstream error body is not JSON")
  }
  return NextResponse.json({ message }, { status: response.status })
}
