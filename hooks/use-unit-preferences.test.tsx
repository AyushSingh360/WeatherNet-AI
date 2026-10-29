import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import {
  UnitPreferencesProvider,
  useUnitPreferences,
  convertTemperature,
  convertWindSpeed,
  convertPressure,
  convertDistance,
  getTemperatureUnitLabel,
  getWindSpeedUnitLabel,
  getPressureUnitLabel,
  getDistanceUnitLabel
} from '@/hooks/use-unit-preferences'

function renderWithProvider() {
  return renderHook(() => useUnitPreferences(), {
    wrapper: ({ children }) => <UnitPreferencesProvider>{children}</UnitPreferencesProvider>,
  })
}

describe('Unit Preferences Utilities', () => {
  it('converts temperature correctly', () => {
    expect(convertTemperature(0, 'celsius')).toBe(0)
    expect(convertTemperature(0, 'fahrenheit')).toBe(32)
    expect(convertTemperature(25, 'celsius')).toBe(25)
    expect(convertTemperature(25, 'fahrenheit')).toBe(77)
  })

  it('converts wind speed correctly', () => {
    expect(convertWindSpeed(10, 'ms')).toBe(10)
    expect(convertWindSpeed(10, 'kmh')).toBe(36)
    expect(convertWindSpeed(10, 'mph')).toBe(22)
    expect(convertWindSpeed(10, 'knots')).toBe(19)
  })

  it('converts pressure correctly', () => {
    expect(convertPressure(1013, 'hpa')).toBe(1013)
    expect(convertPressure(1013, 'inhg')).toBe(29.91)
    expect(convertPressure(1013, 'mmhg')).toBe(760)
  })

  it('returns correct unit labels', () => {
    expect(getTemperatureUnitLabel('celsius')).toBe('°C')
    expect(getTemperatureUnitLabel('fahrenheit')).toBe('°F')
    expect(getWindSpeedUnitLabel('ms')).toBe('m/s')
    expect(getWindSpeedUnitLabel('kmh')).toBe('km/h')
    expect(getWindSpeedUnitLabel('mph')).toBe('mph')
    expect(getPressureUnitLabel('hpa')).toBe('hPa')
    expect(getPressureUnitLabel('inhg')).toBe('inHg')
    expect(getDistanceUnitLabel('km')).toBe('km')
    expect(getDistanceUnitLabel('mi')).toBe('mi')
  })

  it('converts distance with rounding to one decimal', () => {
    expect(convertDistance(1500, 'km')).toEqual({ value: 1.5, unit: 'km' })
    expect(convertDistance(1609.34, 'mi')).toEqual({ value: 1, unit: 'mi' })
  })

  it('throws when used outside the provider', () => {
    expect(() => renderHook(() => useUnitPreferences())).toThrow(
      'useUnitPreferences must be used within a UnitPreferencesProvider',
    )
  })
})

describe('Unit Preferences Provider', () => {
  const setItem = window.localStorage.setItem as unknown as ReturnType<typeof vi.fn>

  beforeEach(() => {
    setItem.mockReset()
    setItem.mockImplementation(() => {})
  })

  it('defaults to celsius + metric units', async () => {
    const { result } = renderWithProvider()
    await waitFor(() =>
      expect(result.current.preferences).toMatchObject({
        temperature: 'celsius',
        windSpeed: 'ms',
        pressure: 'hpa',
        precipitation: 'mm',
        distance: 'km',
      }),
    )
  })

  it('updates individual preferences and persists them', async () => {
    const { result } = renderWithProvider()
    await waitFor(() => expect(result.current.preferences.temperature).toBe('celsius'))

    act(() => result.current.setPreferences({ temperature: 'fahrenheit' }))

    expect(result.current.preferences.temperature).toBe('fahrenheit')
    expect(setItem).toHaveBeenCalledWith(
      'weathernet-unit-preferences',
      expect.stringContaining('fahrenheit'),
    )
  })

  it('toggles temperature unit', async () => {
    const { result } = renderWithProvider()
    await waitFor(() => expect(result.current.preferences.temperature).toBe('celsius'))

    act(() => result.current.toggleTemperature())
    expect(result.current.preferences.temperature).toBe('fahrenheit')

    act(() => result.current.toggleTemperature())
    expect(result.current.preferences.temperature).toBe('celsius')
  })
})