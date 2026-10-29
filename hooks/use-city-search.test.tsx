import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { createElement, type ReactNode } from "react"
import { renderHook, waitFor } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"
import { useCitySearch } from "@/hooks/use-city-search"

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

describe("useCitySearch", () => {
  it("does not query for short input", async () => {
    const fetchSpy = vi.fn()
    vi.stubGlobal("fetch", fetchSpy)
    const { result } = renderHook(() => useCitySearch("P"), { wrapper: makeWrapper() })

    await waitFor(() => expect(result.current.fetchStatus).toBe("idle"), { timeout: 2000 })
    expect(fetchSpy).not.toHaveBeenCalled()
  })

  it("debounces and returns mapped suggestions", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            cities: [
              { name: "London", country: "GB", state: "Greater London", lat: 51.5, lon: -0.12 },
            ],
          }),
          { status: 200 },
        ),
      ),
    )
    const { result } = renderHook(() => useCitySearch("London"), { wrapper: makeWrapper() })

    await waitFor(
      () => {
        expect(result.current.data).toHaveLength(1)
        expect(result.current.data?.[0]).toMatchObject({
          name: "London",
          country: "GB",
          state: "Greater London",
          lat: 51.5,
        })
      },
      { timeout: 3000 },
    )
  })

  it("returns an empty list for failed lookups instead of throwing", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response("Too many requests", { status: 429 })),
    )
    const { result } = renderHook(() => useCitySearch("London"), { wrapper: makeWrapper() })

    await waitFor(
      () => {
        expect(result.current.status).toBe("success")
        expect(result.current.data).toEqual([])
      },
      { timeout: 3000 },
    )
  })
})
