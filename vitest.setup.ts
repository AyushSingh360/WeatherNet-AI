import '@testing-library/jest-dom'
import { vi } from 'vitest'

Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  },
  writable: true,
})

Object.defineProperty(window, 'navigator', {
  value: {
    geolocation: {
      getCurrentPosition: vi.fn(),
      watchPosition: vi.fn(),
    },
  },
  writable: true,
})

HTMLCanvasElement.prototype.getContext = vi.fn()

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))