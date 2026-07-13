import { describe, it, expect, vi, beforeEach } from 'vitest'
import { 
  convertTemperature,
  convertWindSpeed,
  convertPressure,
  getTemperatureUnitLabel,
  getWindSpeedUnitLabel,
  getPressureUnitLabel,
  getDistanceUnitLabel
} from '@/hooks/use-unit-preferences'

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
})