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

describe('Guest Middleware', () => {
  let mockAuthStore: any

  beforeEach(() => {
    vi.clearAllMocks()
    
    mockAuthStore = {
      isAuthenticated: false,
      user: null
    }
    
    vi.mocked(useAuthStore).mockReturnValue(mockAuthStore)
  })

  it('should not redirect when not authenticated', async () => {
    const guestMiddleware = await import('~/middleware/guest')
    
    const to = { path: '/login' }
    const from = { path: '/' }
    
    await guestMiddleware.default(to, from)
    
    expect(mockNavigateTo).not.toHaveBeenCalled()
  })

  it('should redirect to home when authenticated', async () => {
    mockAuthStore.isAuthenticated = true
    mockAuthStore.user = { id: 1, name: 'Test User' }
    
    const guestMiddleware = await import('~/middleware/guest')
    
    const to = { path: '/login' }
    const from = { path: '/' }
    
    await guestMiddleware.default(to, from)
    
    expect(mockNavigateTo).toHaveBeenCalledWith('/')
  })

  it('should handle different guest-only routes', async () => {
    mockAuthStore.isAuthenticated = true
    mockAuthStore.user = { id: 1, name: 'Test User' }
    
    const guestMiddleware = await import('~/middleware/guest')
    
    const testRoutes = [
      { path: '/login' },
      { path: '/register' },
      { path: '/forgot-password' }
    ]
    
    for (const route of testRoutes) {
      await guestMiddleware.default(route, { path: '/' })
    }
    
    expect(mockNavigateTo).toHaveBeenCalledTimes(testRoutes.length)
  })
})

