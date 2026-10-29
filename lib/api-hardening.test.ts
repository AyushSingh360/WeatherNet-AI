import { afterEach, describe, expect, it, vi } from "vitest"
import {
  cacheControl,
  checkRateLimit,
  citySchema,
  coordsSchema,
} from "@/lib/api-hardening"

function requestWithIp(ip: string): Request {
  return new Request("http://localhost:3000/api/weather", {
    headers: { "x-forwarded-for": ip },
  })
}

describe("checkRateLimit", () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it("allows requests under the limit and blocks beyond it", () => {
    const request = requestWithIp("10.10.10.1")
    let allowed = true
    for (let i = 0; i < 31; i++) {
      allowed = checkRateLimit(request).allowed
    }
    expect(allowed).toBe(false)
  })

  it("tracks clients independently", () => {
    for (let i = 0; i < 100; i++) {
      checkRateLimit(requestWithIp("10.10.10.2"))
    }
    expect(checkRateLimit(requestWithIp("10.10.10.2")).allowed).toBe(false)
    expect(checkRateLimit(requestWithIp("10.10.10.3")).allowed).toBe(true)
  })

  it("resets after the window elapses", () => {
    vi.useFakeTimers()
    const request = requestWithIp("10.10.10.4")
    for (let i = 0; i < 100; i++) {
      checkRateLimit(request)
    }
    expect(checkRateLimit(request).allowed).toBe(false)
    vi.advanceTimersByTime(61_000)
    expect(checkRateLimit(request).allowed).toBe(true)
  })

  it("falls back to 'unknown' when no IP headers exist", () => {
    const request = new Request("http://localhost:3000/api/weather")
    expect(checkRateLimit(request).allowed).toBe(true)
  })
})

describe("citySchema", () => {
  it("accepts normal city names", () => {
    expect(citySchema.safeParse("New York").success).toBe(true)
    expect(citySchema.safeParse("Kraków").success).toBe(true)
    expect(citySchema.safeParse("San-Francisco, CA 94101").success).toBe(true)
    expect(citySchema.safeParse("51.5074,-0.1278").success).toBe(true)
  })

  it("rejects empty and oversized input", () => {
    expect(citySchema.safeParse("").success).toBe(false)
    expect(citySchema.safeParse("a".repeat(101)).success).toBe(false)
  })

  it("rejects injection-style input", () => {
    expect(citySchema.safeParse("London<script>alert(1)</script>").success).toBe(false)
    expect(citySchema.safeParse("London&zap=1").success).toBe(false)
    expect(citySchema.safeParse("London%20AND%201=1").success).toBe(false)
  })
})

describe("coordsSchema", () => {
  it("coerces valid numeric strings", () => {
    const parsed = coordsSchema.safeParse({ lat: "51.5074", lon: "-0.1278" })
    expect(parsed.success).toBe(true)
    if (parsed.success) {
      expect(parsed.data.lat).toBeCloseTo(51.5074)
      expect(parsed.data.lon).toBeCloseTo(-0.1278)
    }
  })

  it("rejects out-of-range coordinates", () => {
    expect(coordsSchema.safeParse({ lat: "91", lon: "0" }).success).toBe(false)
    expect(coordsSchema.safeParse({ lat: "0", lon: "-181" }).success).toBe(false)
  })

  it("rejects non-numeric and missing input", () => {
    expect(coordsSchema.safeParse({ lat: "1&zap=1", lon: "2" }).success).toBe(false)
    expect(coordsSchema.safeParse({ lat: "abc", lon: "2" }).success).toBe(false)
    expect(coordsSchema.safeParse({ lon: "2" }).success).toBe(false)
  })
})

describe("cacheControl", () => {
  it("emits s-maxage with stale-while-revalidate", () => {
    expect(cacheControl(600)).toBe(
      "public, max-age=0, s-maxage=600, stale-while-revalidate=3600",
    )
  })
})
