import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { createElement, type ReactNode } from "react"
import { act, renderHook, waitFor } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"
import { useWeather } from "@/hooks/use-weather"

function makeWrapper() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  const Wrapper = ({ children }: { children: ReactNode }) =>
    createElement(QueryClientProvider, { client }, children)
  return Wrapper
}

function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json" },
  })
}

const CURRENT = { name: "London", coord: { lat: 51.5, lon: -0.12 } }
const FORECAST = { list: [{ dt: 1 }, { dt: 2 }] }

afterEach(() => {
  vi.unstubAllGlobals()
})

function urlFor(url: unknown): string {
  return String(url)
}

function mockRoutes(current: Response, forecast: Response) {
  const fetchMock = vi.fn((input: unknown) => {
    const url = urlFor(input)
    const isForecast = url.includes("/api/forecast")
    return Promise.resolve(isForecast ? forecast : current)
  })
  vi.stubGlobal("fetch", fetchMock)
  return fetchMock
}

describe("useWeather", () => {
  it("fetches current and forecast data together", async () => {
    mockRoutes(jsonResponse(CURRENT), jsonResponse(FORECAST))
    const { result } = renderHook(() => useWeather("London"), { wrapper: makeWrapper() })

    await waitFor(() => expect(result.current.data?.current).toMatchObject({ name: "London" }))
    expect(result.current.data?.forecast).toHaveLength(2)
  })

  it("keeps current weather when the forecast endpoint fails", async () => {
    mockRoutes(jsonResponse(CURRENT), jsonResponse({ message: "boom" }, 500))
    const { result } = renderHook(() => useWeather("London"), { wrapper: makeWrapper() })

    await waitFor(() => expect(result.current.data?.current).toMatchObject({ name: "London" }))
    expect(result.current.data?.forecast).toEqual([])
    expect(result.current.error).toBeNull()
  })

  it("surfaces the upstream error for a failing city", async () => {
    mockRoutes(jsonResponse({ message: "city not found" }, 404), jsonResponse(FORECAST))
    const { result } = renderHook(() => useWeather("Nowhere"), { wrapper: makeWrapper() })

    await waitFor(() => expect(result.current.error?.message).toBe("city not found"))
    expect(result.current.data).toBeUndefined()
  })

  it("raises a network error message when the weather request rejects", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn((input: unknown) => {
        const url = urlFor(input)
        if (url.includes("/api/forecast")) return Promise.resolve(jsonResponse(FORECAST))
        return Promise.reject(new TypeError("network down"))
      }),
    )
    const { result } = renderHook(() => useWeather("London"), { wrapper: makeWrapper() })

    await waitFor(() =>
      expect(result.current.error?.message).toBe("Network error while fetching current weather"),
    )
  })

  it("auto-refetches on an interval", async () => {
    vi.useFakeTimers()
    try {
      const fetchMock = mockRoutes(jsonResponse(CURRENT), jsonResponse(FORECAST))
      renderHook(() => useWeather("London"), { wrapper: makeWrapper() })
      await vi.advanceTimersByTimeAsync(10 * 60 * 1000)
      expect(fetchMock).toHaveBeenCalledTimes(4)
    } finally {
      vi.useRealTimers()
    }
  })
})
