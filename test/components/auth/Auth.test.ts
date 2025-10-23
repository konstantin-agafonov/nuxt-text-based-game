import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '~/stores/auth'
import Auth from '~/components/auth/Auth.vue'

// Mock the auth store
vi.mock('~/stores/auth', () => ({
  useAuthStore: vi.fn()
}))

// Mock child components
vi.mock('~/components/auth/Login.vue', () => ({
  default: {
    name: 'Login',
    template: '<div data-testid="login-form">Login Form</div>',
    emits: ['login_successful']
  }
}))

vi.mock('~/components/auth/Register.vue', () => ({
  default: {
    name: 'Register',
    template: '<div data-testid="register-form">Register Form</div>',
    emits: ['register_successful']
  }
}))

vi.mock('~/components/auth/UserProfile.vue', () => ({
  default: {
    name: 'UserProfile',
    template: '<div data-testid="user-profile">User Profile</div>'
  }
}))

describe('Auth Component', () => {
  let mockAuthStore: any

  beforeEach(() => {
    setActivePinia(createPinia())
    
    mockAuthStore = {
      user: null,
      isAuthenticated: false,
      isLoading: false
    }
    
    vi.mocked(useAuthStore).mockReturnValue(mockAuthStore)
  })

  describe('When not authenticated', () => {
    it('shows login and register links initially', () => {
      const wrapper = mount(Auth)
      
      expect(wrapper.find('a[href="#"]').text()).toBe('LOGIN')
      expect(wrapper.findAll('a[href="#"]')[1].text()).toBe('REGISTER')
    })

    it('shows login form when login link is clicked', async () => {
      const wrapper = mount(Auth)
      
      const loginLink = wrapper.find('a[href="#"]')
      await loginLink.trigger('click')
      
      expect(wrapper.find('[data-testid="login-form"]').exists()).toBe(true)
      expect(wrapper.find('a[href="#"]').exists()).toBe(false) // Register link should still be visible
    })

    it('shows register form when register link is clicked', async () => {
      const wrapper = mount(Auth)
      
      const registerLink = wrapper.findAll('a[href="#"]')[1]
      await registerLink.trigger('click')
      
      expect(wrapper.find('[data-testid="register-form"]').exists()).toBe(true)
      expect(wrapper.find('a[href="#"]').exists()).toBe(true) // Login link should still be visible
    })

    it('hides both links when login form is active', async () => {
      const wrapper = mount(Auth)
      
      const loginLink = wrapper.find('a[href="#"]')
      await loginLink.trigger('click')
      
      expect(wrapper.findAll('a[href="#"]')).toHaveLength(1) // Only register link
    })

    it('hides both links when register form is active', async () => {
      const wrapper = mount(Auth)
      
      const registerLink = wrapper.findAll('a[href="#"]')[1]
      await registerLink.trigger('click')
      
      expect(wrapper.findAll('a[href="#"]')).toHaveLength(1) // Only login link
    })

    it('deactivates forms when login is successful', async () => {
      const wrapper = mount(Auth)
      
      // Activate login form
      const loginLink = wrapper.find('a[href="#"]')
      await loginLink.trigger('click')
      
      expect(wrapper.find('[data-testid="login-form"]').exists()).toBe(true)
      
      // Simulate successful login
      const loginForm = wrapper.findComponent({ name: 'Login' })
      await loginForm.vm.$emit('login_successful')
      
      // Should show both links again
      expect(wrapper.findAll('a[href="#"]')).toHaveLength(2)
    })

    it('deactivates forms when registration is successful', async () => {
      const wrapper = mount(Auth)
      
      // Activate register form
      const registerLink = wrapper.findAll('a[href="#"]')[1]
      await registerLink.trigger('click')
      
      expect(wrapper.find('[data-testid="register-form"]').exists()).toBe(true)
      
      // Simulate successful registration
      const registerForm = wrapper.findComponent({ name: 'Register' })
      await registerForm.vm.$emit('register_successful')
      
      // Should show both links again
      expect(wrapper.findAll('a[href="#"]')).toHaveLength(2)
    })
  })

  describe('When authenticated', () => {
    beforeEach(() => {
      mockAuthStore.isAuthenticated = true
      mockAuthStore.user = { id: 1, name: 'John Doe', email: 'john@example.com' }
    })

    it('shows user profile when authenticated', () => {
      const wrapper = mount(Auth)
      
      expect(wrapper.find('[data-testid="user-profile"]').exists()).toBe(true)
      expect(wrapper.find('a[href="#"]').exists()).toBe(false)
      expect(wrapper.find('[data-testid="login-form"]').exists()).toBe(false)
      expect(wrapper.find('[data-testid="register-form"]').exists()).toBe(false)
    })

    it('does not show login or register links when authenticated', () => {
      const wrapper = mount(Auth)
      
      expect(wrapper.findAll('a[href="#"]')).toHaveLength(0)
    })
  })

  describe('Link styling', () => {
    it('applies correct classes to login link', () => {
      const wrapper = mount(Auth)
      
      const loginLink = wrapper.find('a[href="#"]')
      expect(loginLink.classes()).toContain('text-green-500')
    })

    it('applies correct classes to register link', () => {
      const wrapper = mount(Auth)
      
      const registerLink = wrapper.findAll('a[href="#"]')[1]
      expect(registerLink.classes()).toContain('text-red-500')
    })
  })

  describe('Component structure', () => {
    it('has correct container classes', () => {
      const wrapper = mount(Auth)
      
      const container = wrapper.find('div')
      expect(container.classes()).toContain('flex')
      expect(container.classes()).toContain('flex-inline')
      expect(container.classes()).toContain('flex-nowrap')
      expect(container.classes()).toContain('items-center')
    })
  })
})
