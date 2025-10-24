import { vi } from 'vitest'

// Mock fetch globally
global.fetch = vi.fn()

// Mock $fetch
global.$fetch = vi.fn()

// Mock document.cookie
Object.defineProperty(document, 'cookie', {
  writable: true,
  value: ''
})

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  error: vi.fn(),
  warn: vi.fn(),
  log: vi.fn()
}

