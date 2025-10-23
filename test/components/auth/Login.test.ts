import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '~/stores/auth'
import Login from '~/components/auth/Login.vue'

// Mock the auth store
vi.mock('~/stores/auth', () => ({
  useAuthStore: vi.fn()
}))

describe('Login Component', () => {
  let mockAuthStore: any

  beforeEach(() => {
    setActivePinia(createPinia())
    
    mockAuthStore = {
      signIn: vi.fn(),
      user: null,
      isAuthenticated: false,
      isLoading: false
    }
    
    vi.mocked(useAuthStore).mockReturnValue(mockAuthStore)
  })

  it('renders login form with email and password fields', () => {
    const wrapper = mount(Login)
    
    expect(wrapper.find('input[name="user-email"]').exists()).toBe(true)
    expect(wrapper.find('input[name="user-password"]').exists()).toBe(true)
    expect(wrapper.find('input[type="submit"]').exists()).toBe(true)
  })

  it('has correct form placeholders', () => {
    const wrapper = mount(Login)
    
    const emailInput = wrapper.find('input[name="user-email"]')
    const passwordInput = wrapper.find('input[name="user-password"]')
    
    expect(emailInput.attributes('placeholder')).toBe('your@email.com')
    expect(passwordInput.attributes('placeholder')).toBe('password')
  })

  it('updates form data when user types', async () => {
    const wrapper = mount(Login)
    
    const emailInput = wrapper.find('input[name="user-email"]')
    const passwordInput = wrapper.find('input[name="user-password"]')
    
    await emailInput.setValue('test@example.com')
    await passwordInput.setValue('password123')
    
    expect(emailInput.element.value).toBe('test@example.com')
    expect(passwordInput.element.value).toBe('password123')
  })

  it('shows validation error when fields are empty', async () => {
    const wrapper = mount(Login)
    
    const form = wrapper.find('form')
    await form.trigger('submit')
    
    expect(wrapper.find('.text-red-500').text()).toBe('Please fill in all fields')
  })

  it('calls signIn with form data on submit', async () => {
    mockAuthStore.signIn.mockResolvedValue({ success: true })
    
    const wrapper = mount(Login)
    
    const emailInput = wrapper.find('input[name="user-email"]')
    const passwordInput = wrapper.find('input[name="user-password"]')
    
    await emailInput.setValue('test@example.com')
    await passwordInput.setValue('password123')
    
    const form = wrapper.find('form')
    await form.trigger('submit')
    
    expect(mockAuthStore.signIn).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123'
    })
  })

  it('shows loading state during submission', async () => {
    mockAuthStore.signIn.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))
    
    const wrapper = mount(Login)
    
    const emailInput = wrapper.find('input[name="user-email"]')
    const passwordInput = wrapper.find('input[name="user-password"]')
    
    await emailInput.setValue('test@example.com')
    await passwordInput.setValue('password123')
    
    const form = wrapper.find('form')
    await form.trigger('submit')
    
    expect(wrapper.find('input[type="submit"]').attributes('disabled')).toBeDefined()
    expect(wrapper.find('input[type="submit"]').attributes('value')).toBe('...')
  })

  it('emits success event on successful login', async () => {
    mockAuthStore.signIn.mockResolvedValue({ success: true })
    
    const wrapper = mount(Login)
    
    const emailInput = wrapper.find('input[name="user-email"]')
    const passwordInput = wrapper.find('input[name="user-password"]')
    
    await emailInput.setValue('test@example.com')
    await passwordInput.setValue('password123')
    
    const form = wrapper.find('form')
    await form.trigger('submit')
    
    expect(wrapper.emitted('login_successful')).toBeTruthy()
  })

  it('shows error message on failed login', async () => {
    mockAuthStore.signIn.mockResolvedValue({ 
      success: false, 
      error: 'Invalid credentials' 
    })
    
    const wrapper = mount(Login)
    
    const emailInput = wrapper.find('input[name="user-email"]')
    const passwordInput = wrapper.find('input[name="user-password"]')
    
    await emailInput.setValue('test@example.com')
    await passwordInput.setValue('wrongpassword')
    
    const form = wrapper.find('form')
    await form.trigger('submit')
    
    expect(wrapper.find('.text-red-500').text()).toBe('Invalid credentials')
  })

  it('resets form on successful login', async () => {
    mockAuthStore.signIn.mockResolvedValue({ success: true })
    
    const wrapper = mount(Login)
    
    const emailInput = wrapper.find('input[name="user-email"]')
    const passwordInput = wrapper.find('input[name="user-password"]')
    
    await emailInput.setValue('test@example.com')
    await passwordInput.setValue('password123')
    
    const form = wrapper.find('form')
    await form.trigger('submit')
    
    await wrapper.vm.$nextTick()
    
    expect(emailInput.element.value).toBe('')
    expect(passwordInput.element.value).toBe('')
  })

  it('disables inputs during submission', async () => {
    mockAuthStore.signIn.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))
    
    const wrapper = mount(Login)
    
    const emailInput = wrapper.find('input[name="user-email"]')
    const passwordInput = wrapper.find('input[name="user-password"]')
    
    await emailInput.setValue('test@example.com')
    await passwordInput.setValue('password123')
    
    const form = wrapper.find('form')
    await form.trigger('submit')
    
    expect(emailInput.attributes('disabled')).toBeDefined()
    expect(passwordInput.attributes('disabled')).toBeDefined()
  })
})
