import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useAuth } from '~/composables/useAuth'

// Mock the global fetch and $fetch
const mockFetch = vi.fn()
const mockFetchGlobal = vi.fn()

global.fetch = mockFetch
global.$fetch = mockFetchGlobal

describe('useAuth Composable', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    
    // Reset document.cookie
    Object.defineProperty(document, 'cookie', {
      writable: true,
      value: ''
    })
  })

  describe('Initial State', () => {
    it('should have correct initial state', () => {
      const { user, isAuthenticated, isLoading } = useAuth()
      
      expect(user.value).toBeNull()
      expect(isAuthenticated.value).toBe(false)
      expect(isLoading.value).toBe(false)
    })
  })

  describe('CSRF Token Handling', () => {
    it('should get CSRF token from cookies', () => {
      const { getCsrfToken } = useAuth()
      
      // Mock document.cookie with XSRF-TOKEN
      Object.defineProperty(document, 'cookie', {
        writable: true,
        value: 'XSRF-TOKEN=test-token; other-cookie=value'
      })
      
      const token = getCsrfToken()
      expect(token).toBe('test-token')
    })

    it('should return null when no XSRF-TOKEN cookie', () => {
      const { getCsrfToken } = useAuth()
      
      Object.defineProperty(document, 'cookie', {
        writable: true,
        value: 'other-cookie=value'
      })
      
      const token = getCsrfToken()
      expect(token).toBeNull()
    })
  })

  describe('Sign In', () => {
    it('should successfully sign in user', async () => {
      const { signIn, user, isAuthenticated } = useAuth()
      
      // Mock successful responses
      mockFetchGlobal
        .mockResolvedValueOnce({}) // CSRF cookie response
        .mockResolvedValueOnce({ id: 1, name: 'Test User', email: 'test@example.com' }) // fetchUser response
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({})
      })
      
      const credentials = { email: 'test@example.com', password: 'password' }
      const result = await signIn(credentials)
      
      expect(result.success).toBe(true)
      expect(user.value).toEqual({ id: 1, name: 'Test User', email: 'test@example.com' })
      expect(isAuthenticated.value).toBe(true)
    })

    it('should handle sign in failure', async () => {
      const { signIn, user, isAuthenticated } = useAuth()
      
      mockFetchGlobal.mockResolvedValueOnce({}) // CSRF cookie response
      
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({ message: 'Invalid credentials' })
      })
      
      const credentials = { email: 'test@example.com', password: 'wrong' }
      const result = await signIn(credentials)
      
      expect(result.success).toBe(false)
      expect(result.error).toBe('Invalid credentials')
      expect(user.value).toBeNull()
      expect(isAuthenticated.value).toBe(false)
    })

    it('should handle network error during sign in', async () => {
      const { signIn } = useAuth()
      
      mockFetchGlobal.mockRejectedValueOnce(new Error('Network error'))
      
      const credentials = { email: 'test@example.com', password: 'password' }
      const result = await signIn(credentials)
      
      expect(result.success).toBe(false)
      expect(result.error).toBe('Network error')
    })

    it('should set loading state during sign in', async () => {
      const { signIn, isLoading } = useAuth()
      
      mockFetchGlobal
        .mockResolvedValueOnce({}) // CSRF cookie response
        .mockResolvedValueOnce({ id: 1, name: 'Test User', email: 'test@example.com' }) // fetchUser response
      
      mockFetch.mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve({ ok: true, json: () => Promise.resolve({}) }), 100))
      )
      
      const credentials = { email: 'test@example.com', password: 'password' }
      const signInPromise = signIn(credentials)
      
      expect(isLoading.value).toBe(true)
      
      await signInPromise
      expect(isLoading.value).toBe(false)
    })
  })

  describe('Sign Up', () => {
    it('should successfully register user', async () => {
      const { signUp, user, isAuthenticated } = useAuth()
      
      mockFetchGlobal
        .mockResolvedValueOnce({}) // CSRF cookie response
        .mockResolvedValueOnce({ id: 1, name: 'New User', email: 'new@example.com' }) // fetchUser response
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({})
      })
      
      const userData = {
        name: 'New User',
        email: 'new@example.com',
        password: 'password',
        password_confirmation: 'password'
      }
      
      const result = await signUp(userData)
      
      expect(result.success).toBe(true)
      expect(user.value).toEqual({ id: 1, name: 'New User', email: 'new@example.com' })
      expect(isAuthenticated.value).toBe(true)
    })

    it('should handle registration failure', async () => {
      const { signUp, user, isAuthenticated } = useAuth()
      
      mockFetchGlobal.mockResolvedValueOnce({}) // CSRF cookie response
      
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({ message: 'Email already exists' })
      })
      
      const userData = {
        name: 'New User',
        email: 'existing@example.com',
        password: 'password',
        password_confirmation: 'password'
      }
      
      const result = await signUp(userData)
      
      expect(result.success).toBe(false)
      expect(result.error).toBe('Email already exists')
      expect(user.value).toBeNull()
      expect(isAuthenticated.value).toBe(false)
    })
  })

  describe('Sign Out', () => {
    it('should successfully sign out user', async () => {
      const { signOut, user, isAuthenticated } = useAuth()
      
      // Set initial user state
      user.value = { id: 1, name: 'Test User', email: 'test@example.com' }
      
      mockFetchGlobal.mockResolvedValueOnce({}) // CSRF cookie response
      mockFetch.mockResolvedValueOnce({ ok: true })
      
      await signOut()
      
      expect(user.value).toBeNull()
      expect(isAuthenticated.value).toBe(false)
    })
  })

  describe('Fetch User', () => {
    it('should fetch current user successfully', async () => {
      const { fetchUser, user } = useAuth()
      const userData = { id: 1, name: 'Test User', email: 'test@example.com' }
      
      mockFetchGlobal.mockResolvedValueOnce(userData)
      
      const result = await fetchUser()
      
      expect(result).toEqual(userData)
      expect(user.value).toEqual(userData)
    })

    it('should handle fetch user failure', async () => {
      const { fetchUser, user } = useAuth()
      
      mockFetchGlobal.mockRejectedValueOnce(new Error('Unauthorized'))
      
      const result = await fetchUser()
      
      expect(result).toBeNull()
      expect(user.value).toBeNull()
    })
  })

  describe('Init Auth', () => {
    it('should initialize auth state', async () => {
      const { initAuth, user, isAuthenticated } = useAuth()
      const userData = { id: 1, name: 'Test User', email: 'test@example.com' }
      
      mockFetchGlobal.mockResolvedValueOnce(userData)
      
      await initAuth()
      
      expect(user.value).toEqual(userData)
      expect(isAuthenticated.value).toBe(true)
    })
  })

  describe('Reactive State', () => {
    it('should update isAuthenticated when user changes', async () => {
      const { user, isAuthenticated } = useAuth()
      
      expect(isAuthenticated.value).toBe(false)
      
      user.value = { id: 1, name: 'Test User', email: 'test@example.com' }
      
      expect(isAuthenticated.value).toBe(true)
    })

    it('should provide readonly access to user and isLoading', () => {
      const { user, isLoading } = useAuth()
      
      // These should be readonly, but we can't test that directly
      // We can test that they are reactive
      expect(user.value).toBeNull()
      expect(isLoading.value).toBe(false)
    })
  })
})
