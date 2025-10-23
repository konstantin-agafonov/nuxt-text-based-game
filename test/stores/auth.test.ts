import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '~/stores/auth'

// Mock the global fetch and $fetch
const mockFetch = vi.fn()
const mockFetchGlobal = vi.fn()

global.fetch = mockFetch
global.$fetch = mockFetchGlobal

describe('Auth Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
    
    // Reset document.cookie
    Object.defineProperty(document, 'cookie', {
      writable: true,
      value: ''
    })
  })

  describe('Initial State', () => {
    it('should have correct initial state', () => {
      const authStore = useAuthStore()
      
      expect(authStore.user).toBeNull()
      expect(authStore.isAuthenticated).toBe(false)
      expect(authStore.isLoading).toBe(false)
    })
  })

  describe('CSRF Token Handling', () => {
    it('should get CSRF token from cookies', () => {
      const authStore = useAuthStore()
      
      // Mock document.cookie with XSRF-TOKEN
      Object.defineProperty(document, 'cookie', {
        writable: true,
        value: 'XSRF-TOKEN=test-token; other-cookie=value'
      })
      
      // Access the private method through the store instance
      const token = (authStore as any).getCsrfToken()
      expect(token).toBe('test-token')
    })

    it('should return null when no XSRF-TOKEN cookie', () => {
      const authStore = useAuthStore()
      
      Object.defineProperty(document, 'cookie', {
        writable: true,
        value: 'other-cookie=value'
      })
      
      const token = (authStore as any).getCsrfToken()
      expect(token).toBeNull()
    })
  })

  describe('Sign In', () => {
    it('should successfully sign in user', async () => {
      const authStore = useAuthStore()
      
      // Mock successful responses
      mockFetchGlobal
        .mockResolvedValueOnce({}) // CSRF cookie response
        .mockResolvedValueOnce({ id: 1, name: 'Test User', email: 'test@example.com' }) // fetchUser response
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({})
      })
      
      const credentials = { email: 'test@example.com', password: 'password' }
      const result = await authStore.signIn(credentials)
      
      expect(result.success).toBe(true)
      expect(authStore.user).toEqual({ id: 1, name: 'Test User', email: 'test@example.com' })
      expect(authStore.isAuthenticated).toBe(true)
    })

    it('should handle sign in failure', async () => {
      const authStore = useAuthStore()
      
      mockFetchGlobal.mockResolvedValueOnce({}) // CSRF cookie response
      
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({ message: 'Invalid credentials' })
      })
      
      const credentials = { email: 'test@example.com', password: 'wrong' }
      const result = await authStore.signIn(credentials)
      
      expect(result.success).toBe(false)
      expect(result.error).toBe('Invalid credentials')
      expect(authStore.user).toBeNull()
      expect(authStore.isAuthenticated).toBe(false)
    })

    it('should handle network error during sign in', async () => {
      const authStore = useAuthStore()
      
      mockFetchGlobal.mockRejectedValueOnce(new Error('Network error'))
      
      const credentials = { email: 'test@example.com', password: 'password' }
      const result = await authStore.signIn(credentials)
      
      expect(result.success).toBe(false)
      expect(result.error).toBe('Network error')
    })
  })

  describe('Sign Up', () => {
    it('should successfully register user', async () => {
      const authStore = useAuthStore()
      
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
      
      const result = await authStore.signUp(userData)
      
      expect(result.success).toBe(true)
      expect(authStore.user).toEqual({ id: 1, name: 'New User', email: 'new@example.com' })
      expect(authStore.isAuthenticated).toBe(true)
    })

    it('should handle registration failure', async () => {
      const authStore = useAuthStore()
      
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
      
      const result = await authStore.signUp(userData)
      
      expect(result.success).toBe(false)
      expect(result.error).toBe('Email already exists')
    })
  })

  describe('Sign Out', () => {
    it('should successfully sign out user', async () => {
      const authStore = useAuthStore()
      
      // Set initial user state
      authStore.user = { id: 1, name: 'Test User', email: 'test@example.com' }
      
      mockFetchGlobal.mockResolvedValueOnce({}) // CSRF cookie response
      mockFetch.mockResolvedValueOnce({ ok: true })
      
      await authStore.signOut()
      
      expect(authStore.user).toBeNull()
      expect(authStore.isAuthenticated).toBe(false)
    })
  })

  describe('Fetch User', () => {
    it('should fetch current user successfully', async () => {
      const authStore = useAuthStore()
      const userData = { id: 1, name: 'Test User', email: 'test@example.com' }
      
      mockFetchGlobal.mockResolvedValueOnce(userData)
      
      const result = await authStore.fetchUser()
      
      expect(result).toEqual(userData)
      expect(authStore.user).toEqual(userData)
    })

    it('should handle fetch user failure', async () => {
      const authStore = useAuthStore()
      
      mockFetchGlobal.mockRejectedValueOnce(new Error('Unauthorized'))
      
      const result = await authStore.fetchUser()
      
      expect(result).toBeNull()
      expect(authStore.user).toBeNull()
    })
  })

  describe('Init Auth', () => {
    it('should initialize auth state', async () => {
      const authStore = useAuthStore()
      const userData = { id: 1, name: 'Test User', email: 'test@example.com' }
      
      mockFetchGlobal.mockResolvedValueOnce(userData)
      
      await authStore.initAuth()
      
      expect(authStore.user).toEqual(userData)
      expect(authStore.isAuthenticated).toBe(true)
    })
  })
})
