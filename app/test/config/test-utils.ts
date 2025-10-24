import { mount, VueWrapper } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import { vi } from 'vitest'

// Global test utilities
export const createTestWrapper = (component: any, options: any = {}) => {
  setActivePinia(createPinia())
  return mount(component, options)
}

// Mock auth store helper
export const createMockAuthStore = (overrides: any = {}) => ({
  signIn: vi.fn(),
  signUp: vi.fn(),
  signOut: vi.fn(),
  fetchUser: vi.fn(),
  initAuth: vi.fn(),
  user: null,
  isAuthenticated: false,
  isLoading: false,
  ...overrides
})

// Mock fetch responses
export const mockFetchResponse = (data: any, ok: boolean = true) => ({
  ok,
  json: () => Promise.resolve(data)
})

// Mock $fetch responses
export const mockFetchGlobalResponse = (data: any) => Promise.resolve(data)

// Test data factories
export const createUser = (overrides: any = {}) => ({
  id: 1,
  name: 'Test User',
  email: 'test@example.com',
  ...overrides
})

export const createCredentials = (overrides: any = {}) => ({
  email: 'test@example.com',
  password: 'password',
  ...overrides
})

export const createUserData = (overrides: any = {}) => ({
  name: 'Test User',
  email: 'test@example.com',
  password: 'password',
  password_confirmation: 'password',
  ...overrides
})

// Common test assertions
export const expectFormFields = (wrapper: VueWrapper<any>, fields: string[]) => {
  fields.forEach(field => {
    expect(wrapper.find(`input[name="${field}"]`).exists()).toBe(true)
  })
}

export const expectErrorMessage = (wrapper: VueWrapper<any>, message: string) => {
  const errorElement = wrapper.find('.text-red-500')
  expect(errorElement.exists()).toBe(true)
  expect(errorElement.text()).toBe(message)
}

export const expectLoadingState = (wrapper: VueWrapper<any>) => {
  const submitButton = wrapper.find('input[type="submit"]')
  expect(submitButton.attributes('disabled')).toBeDefined()
  expect(submitButton.attributes('value')).toBe('...')
}

export const expectSuccessEvent = (wrapper: VueWrapper<any>, eventName: string) => {
  expect(wrapper.emitted(eventName)).toBeTruthy()
}

