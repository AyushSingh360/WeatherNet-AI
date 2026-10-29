import '@testing-library/jest-dom'
import { vi } from 'vitest'

if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'localStorage', {
    value: {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    },
    writable: true,
  })

  Object.defineProperty(window.navigator, 'geolocation', {
    value: {
      getCurrentPosition: vi.fn(),
      watchPosition: vi.fn(),
    },
    configurable: true,
  })

  HTMLCanvasElement.prototype.getContext = vi.fn()
}

globalThis.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
})) as unknown as typeof ResizeObserver
