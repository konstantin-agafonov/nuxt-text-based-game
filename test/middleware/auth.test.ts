import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useAuthStore } from '~/stores/auth'

// Mock the auth store
vi.mock('~/stores/auth', () => ({
  useAuthStore: vi.fn()
}))

// Mock navigateTo
const mockNavigateTo = vi.fn()
vi.mock('#app', () => ({
  navigateTo: mockNavigateTo
}))

describe('Auth Middleware', () => {
  let mockAuthStore: any

  beforeEach(() => {
    vi.clearAllMocks()
    
    mockAuthStore = {
      isAuthenticated: false,
      user: null
    }
    
    vi.mocked(useAuthStore).mockReturnValue(mockAuthStore)
  })

  it('should redirect to home when not authenticated', async () => {
    // Import the middleware dynamically to avoid hoisting issues
    const authMiddleware = await import('~/middleware/auth')
    
    const to = { path: '/protected' }
    const from = { path: '/' }
    
    await authMiddleware.default(to, from)
    
    expect(mockNavigateTo).toHaveBeenCalledWith('/')
  })

  it('should not redirect when authenticated', async () => {
    mockAuthStore.isAuthenticated = true
    mockAuthStore.user = { id: 1, name: 'Test User' }
    
    const authMiddleware = await import('~/middleware/auth')
    
    const to = { path: '/protected' }
    const from = { path: '/' }
    
    await authMiddleware.default(to, from)
    
    expect(mockNavigateTo).not.toHaveBeenCalled()
  })

  it('should handle different route paths', async () => {
    const authMiddleware = await import('~/middleware/auth')
    
    const testRoutes = [
      { path: '/dashboard' },
      { path: '/profile' },
      { path: '/settings' }
    ]
    
    for (const route of testRoutes) {
      await authMiddleware.default(route, { path: '/' })
    }
    
    expect(mockNavigateTo).toHaveBeenCalledTimes(testRoutes.length)
  })
})

