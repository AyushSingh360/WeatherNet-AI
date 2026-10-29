import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { createElement, type ReactNode } from "react"
import { renderHook, waitFor } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"
import { useAirQuality } from "@/hooks/use-air-quality"

function makeWrapper() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  const Wrapper = ({ children }: { children: ReactNode }) =>
    createElement(QueryClientProvider, { client }, children)
  return Wrapper
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe("useAirQuality", () => {
  it("stays disabled without coordinates", async () => {
    const fetchSpy = vi.fn()
    vi.stubGlobal("fetch", fetchSpy)
    const { result } = renderHook(() => useAirQuality(undefined, undefined), {
      wrapper: makeWrapper(),
    })

    await waitFor(() => expect(result.current.status).toBe("pending"))
    expect(fetchSpy).not.toHaveBeenCalled()
  })

  it("returns AQI data for coordinates", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({ list: [{ main: { aqi: 2 }, components: { pm2_5: 10 } }] }),
          { status: 200 },
        ),
      ),
    )
    const { result } = renderHook(() => useAirQuality(51.5, -0.12), { wrapper: makeWrapper() })

    await waitFor(() => expect(result.current.data?.list[0].main.aqi).toBe(2))
  })

  it("surfaced upstream validation errors keep their message", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ message: "Latitude out of range" }), { status: 422 }),
      ),
    )
    const { result } = renderHook(() => useAirQuality(91, 0), { wrapper: makeWrapper() })

    await waitFor(() => expect(result.current.error?.message).toBe("Latitude out of range"))
  })

  it("falls back to a generic message for non-JSON errors", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response("Service Unavailable", { status: 503 })),
    )
    const { result } = renderHook(() => useAirQuality(51.5, -0.12), { wrapper: makeWrapper() })

    await waitFor(() =>
      expect(result.current.error?.message).toBe("Failed to fetch air quality data"),
    )
  })
})
