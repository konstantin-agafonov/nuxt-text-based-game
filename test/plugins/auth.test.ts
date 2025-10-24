import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useAuthStore } from '~/stores/auth'

// Mock the auth store
vi.mock('~/stores/auth', () => ({
  useAuthStore: vi.fn()
}))

describe('Auth Plugin', () => {
  let mockAuthStore: any

  beforeEach(() => {
    vi.clearAllMocks()
    
    mockAuthStore = {
      initAuth: vi.fn().mockResolvedValue(undefined),
      user: null,
      isAuthenticated: false,
      isLoading: false
    }
    
    vi.mocked(useAuthStore).mockReturnValue(mockAuthStore)
  })

  it('should initialize auth state on app start', async () => {
    const authPlugin = await import('~/plugins/auth.client')
    
    // The plugin should be a function
    expect(typeof authPlugin.default).toBe('function')
    
    // Call the plugin function
    await authPlugin.default()
    
    expect(mockAuthStore.initAuth).toHaveBeenCalled()
  })

  it('should handle auth initialization errors gracefully', async () => {
    mockAuthStore.initAuth.mockRejectedValueOnce(new Error('Auth init failed'))
    
    const authPlugin = await import('~/plugins/auth.client')
    
    // Should not throw an error
    await expect(authPlugin.default()).resolves.toBeUndefined()
  })
})

