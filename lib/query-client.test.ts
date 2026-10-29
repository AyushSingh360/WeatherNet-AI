// @vitest-environment node
import { describe, expect, it, vi, afterEach } from "vitest"
import { makeQueryClient } from "@/lib/query-client"

describe("makeQueryClient", () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it("applies the cache defaults", () => {
    const client = makeQueryClient()
    expect(client.getDefaultOptions().queries).toMatchObject({
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    })
  })

  it("returns independent instances", () => {
    expect(makeQueryClient()).not.toBe(makeQueryClient())
  })
})
