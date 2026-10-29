import { act, renderHook, waitFor } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { useFavorites } from "@/hooks/use-favorites"

const sample = {
  name: "Paris",
  country: "FR",
  temp: 20,
  condition: "Clear",
  icon: "01d",
}

const another = {
  name: "Tokyo",
  country: "JP",
  temp: 25,
  condition: "Clouds",
  icon: "03d",
}

const store = {
  getItem: null as unknown as ReturnType<typeof vi.fn>,
  setItem: null as unknown as ReturnType<typeof vi.fn>,
}

beforeEach(() => {
  store.getItem = window.localStorage.getItem as ReturnType<typeof vi.fn>
  store.setItem = window.localStorage.setItem as ReturnType<typeof vi.fn>
  store.getItem.mockReset()
  store.setItem.mockReset()
  store.setItem.mockImplementation(() => {})
})

describe("useFavorites", () => {
  it("starts empty when nothing is persisted", async () => {
    store.getItem.mockReturnValue(null)
    const { result } = renderHook(() => useFavorites())
    await waitFor(() => expect(result.current.favorites).toEqual([]))
  })

  it("loads persisted favorites", async () => {
    store.getItem.mockReturnValue(JSON.stringify([sample]))
    const { result } = renderHook(() => useFavorites())
    await waitFor(() => expect(result.current.favorites).toHaveLength(1))
    expect(result.current.favorites[0]).toMatchObject({ name: "Paris" })
  })

  it("survives corrupt persisted data", async () => {
    store.getItem.mockReturnValue("{not valid json")
    const { result } = renderHook(() => useFavorites())
    await waitFor(() => expect(result.current.favorites).toEqual([]))
  })

  it("ignores persisted data that is not an array", async () => {
    store.getItem.mockReturnValue(JSON.stringify({ name: "Paris" }))
    const { result } = renderHook(() => useFavorites())
    await waitFor(() => expect(result.current.favorites).toEqual([]))
  })

  it("adds and persists a favorite", async () => {
    const { result } = renderHook(() => useFavorites())
    await waitFor(() => expect(result.current.favorites).toEqual([]))

    act(() => result.current.addFavorite(sample))

    expect(result.current.favorites).toHaveLength(1)
    expect(store.setItem).toHaveBeenCalledWith(
      "weather-favorites",
      expect.stringContaining("Paris"),
    )
  })

  it("deduplicates favorites by name", async () => {
    const { result } = renderHook(() => useFavorites())
    await waitFor(() => expect(result.current.favorites).toEqual([]))

    act(() => {
      result.current.addFavorite(sample)
      result.current.addFavorite({ ...sample, temp: 22 })
    })

    expect(result.current.favorites).toHaveLength(1)
    expect(result.current.favorites[0].temp).toBe(22)
  })

  it("does not throw when localStorage is unavailable", async () => {
    store.setItem.mockImplementation(() => {
      throw new Error("QuotaExceededError")
    })
    const { result } = renderHook(() => useFavorites())
    await waitFor(() => expect(result.current.favorites).toEqual([]))

    act(() => result.current.addFavorite(sample))

    expect(result.current.favorites).toHaveLength(1)
  })

  it("removes favorites by name", async () => {
    const { result } = renderHook(() => useFavorites())
    await waitFor(() => expect(result.current.favorites).toEqual([]))

    act(() => {
      result.current.addFavorite(sample)
      result.current.addFavorite(another)
    })
    act(() => result.current.removeFavorite("Tokyo"))

    expect(result.current.favorites).toHaveLength(1)
    expect(result.current.isFavorite("Tokyo")).toBe(false)
    expect(result.current.isFavorite("Paris")).toBe(true)
  })
})
