import { renderHook, waitFor, act } from "@testing-library/react"
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest"
import { useGeolocation } from "@/hooks/use-geolocation"

type PositionCallback = (position: { coords: { latitude: number; longitude: number } }) => void
type ErrorCallback = (error: { code: number }) => void

const nativeGeolocation = window.navigator.geolocation

beforeEach(() => {
  Object.defineProperty(window.navigator, "geolocation", {
    value: nativeGeolocation,
    configurable: true,
  })
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe("useGeolocation", () => {
  it("reports unsupported when geolocation is missing", async () => {
    Object.defineProperty(window.navigator, "geolocation", {
      value: undefined,
      configurable: true,
    })
    const { result } = renderHook(() => useGeolocation())

    await expect(act(() => result.current.getCurrentLocation())).rejects.toThrow(
      "Geolocation is not supported by this browser",
    )
  })

  it("resolves with coordinates", async () => {
    const getCurrentPosition = vi.fn(
      (success: PositionCallback, _error: ErrorCallback) => {
        success({ coords: { latitude: 51.5, longitude: -0.12 } })
      },
    )
    Object.defineProperty(window.navigator, "geolocation", {
      value: { getCurrentPosition },
      configurable: true,
    })
    const { result } = renderHook(() => useGeolocation())

    const location = await act(() => result.current.getCurrentLocation())
    expect(location).toEqual({ lat: 51.5, lon: -0.12 })
  })

  it("maps permission-denied errors", async () => {
    const getCurrentPosition = vi.fn(
      (_success: PositionCallback, error: ErrorCallback) => {
        error({ code: 1 })
      },
    )
    Object.defineProperty(window.navigator, "geolocation", {
      value: { getCurrentPosition },
      configurable: true,
    })
    const { result } = renderHook(() => useGeolocation())

    await expect(act(() => result.current.getCurrentLocation())).rejects.toThrow(
      "Location access denied. Please enable location permissions.",
    )
  })

  it("maps timeout errors", async () => {
    const getCurrentPosition = vi.fn(
      (_success: PositionCallback, error: ErrorCallback) => {
        error({ code: 3 })
      },
    )
    Object.defineProperty(window.navigator, "geolocation", {
      value: { getCurrentPosition },
      configurable: true,
    })
    const { result } = renderHook(() => useGeolocation())

    await expect(act(() => result.current.getCurrentLocation())).rejects.toThrow(
      "Location request timed out. Please try again.",
    )
  })
})
