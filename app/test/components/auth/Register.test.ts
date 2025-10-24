import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '~/stores/auth'
import Register from '~/components/auth/Register.vue'

// Mock the auth store
vi.mock('~/stores/auth', () => ({
  useAuthStore: vi.fn()
}))

describe('Register Component', () => {
  let mockAuthStore: any

  beforeEach(() => {
    setActivePinia(createPinia())
    
    mockAuthStore = {
      signUp: vi.fn(),
      user: null,
      isAuthenticated: false,
      isLoading: false
    }
    
    vi.mocked(useAuthStore).mockReturnValue(mockAuthStore)
  })

  it('renders registration form with all required fields', () => {
    const wrapper = mount(Register)
    
    expect(wrapper.find('input[name="user-name"]').exists()).toBe(true)
    expect(wrapper.find('input[name="user-email"]').exists()).toBe(true)
    expect(wrapper.find('input[name="user-password"]').exists()).toBe(true)
    expect(wrapper.find('input[name="user-password-confirmation"]').exists()).toBe(true)
    expect(wrapper.find('input[type="submit"]').exists()).toBe(true)
  })

  it('has correct form placeholders', () => {
    const wrapper = mount(Register)
    
    const nameInput = wrapper.find('input[name="user-name"]')
    const emailInput = wrapper.find('input[name="user-email"]')
    const passwordInput = wrapper.find('input[name="user-password"]')
    const confirmInput = wrapper.find('input[name="user-password-confirmation"]')
    
    expect(nameInput.attributes('placeholder')).toBe('Name')
    expect(emailInput.attributes('placeholder')).toBe('your@email.com')
    expect(passwordInput.attributes('placeholder')).toBe('password')
    expect(confirmInput.attributes('placeholder')).toBe('confirm password')
  })

  it('updates form data when user types', async () => {
    const wrapper = mount(Register)
    
    const nameInput = wrapper.find('input[name="user-name"]')
    const emailInput = wrapper.find('input[name="user-email"]')
    const passwordInput = wrapper.find('input[name="user-password"]')
    const confirmInput = wrapper.find('input[name="user-password-confirmation"]')
    
    await nameInput.setValue('John Doe')
    await emailInput.setValue('john@example.com')
    await passwordInput.setValue('password123')
    await confirmInput.setValue('password123')
    
    expect(nameInput.element.value).toBe('John Doe')
    expect(emailInput.element.value).toBe('john@example.com')
    expect(passwordInput.element.value).toBe('password123')
    expect(confirmInput.element.value).toBe('password123')
  })

  it('shows validation error when fields are empty', async () => {
    const wrapper = mount(Register)
    
    const form = wrapper.find('form')
    await form.trigger('submit')
    
    expect(wrapper.find('.text-red-500').text()).toBe('Please fill in all fields')
  })

  it('shows error when passwords do not match', async () => {
    const wrapper = mount(Register)
    
    const nameInput = wrapper.find('input[name="user-name"]')
    const emailInput = wrapper.find('input[name="user-email"]')
    const passwordInput = wrapper.find('input[name="user-password"]')
    const confirmInput = wrapper.find('input[name="user-password-confirmation"]')
    
    await nameInput.setValue('John Doe')
    await emailInput.setValue('john@example.com')
    await passwordInput.setValue('password123')
    await confirmInput.setValue('differentpassword')
    
    const form = wrapper.find('form')
    await form.trigger('submit')
    
    expect(wrapper.find('.text-red-500').text()).toBe('Passwords do not match')
  })

  it('calls signUp with form data on submit', async () => {
    mockAuthStore.signUp.mockResolvedValue({ success: true })
    
    const wrapper = mount(Register)
    
    const nameInput = wrapper.find('input[name="user-name"]')
    const emailInput = wrapper.find('input[name="user-email"]')
    const passwordInput = wrapper.find('input[name="user-password"]')
    const confirmInput = wrapper.find('input[name="user-password-confirmation"]')
    
    await nameInput.setValue('John Doe')
    await emailInput.setValue('john@example.com')
    await passwordInput.setValue('password123')
    await confirmInput.setValue('password123')
    
    const form = wrapper.find('form')
    await form.trigger('submit')
    
    expect(mockAuthStore.signUp).toHaveBeenCalledWith({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      password_confirmation: 'password123'
    })
  })

  it('shows loading state during submission', async () => {
    mockAuthStore.signUp.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))
    
    const wrapper = mount(Register)
    
    const nameInput = wrapper.find('input[name="user-name"]')
    const emailInput = wrapper.find('input[name="user-email"]')
    const passwordInput = wrapper.find('input[name="user-password"]')
    const confirmInput = wrapper.find('input[name="user-password-confirmation"]')
    
    await nameInput.setValue('John Doe')
    await emailInput.setValue('john@example.com')
    await passwordInput.setValue('password123')
    await confirmInput.setValue('password123')
    
    const form = wrapper.find('form')
    await form.trigger('submit')
    
    expect(wrapper.find('input[type="submit"]').attributes('disabled')).toBeDefined()
    expect(wrapper.find('input[type="submit"]').attributes('value')).toBe('...')
  })

  it('emits success event on successful registration', async () => {
    mockAuthStore.signUp.mockResolvedValue({ success: true })
    
    const wrapper = mount(Register)
    
    const nameInput = wrapper.find('input[name="user-name"]')
    const emailInput = wrapper.find('input[name="user-email"]')
    const passwordInput = wrapper.find('input[name="user-password"]')
    const confirmInput = wrapper.find('input[name="user-password-confirmation"]')
    
    await nameInput.setValue('John Doe')
    await emailInput.setValue('john@example.com')
    await passwordInput.setValue('password123')
    await confirmInput.setValue('password123')
    
    const form = wrapper.find('form')
    await form.trigger('submit')
    
    expect(wrapper.emitted('register_successful')).toBeTruthy()
  })

  it('shows error message on failed registration', async () => {
    mockAuthStore.signUp.mockResolvedValue({ 
      success: false, 
      error: 'Email already exists' 
    })
    
    const wrapper = mount(Register)
    
    const nameInput = wrapper.find('input[name="user-name"]')
    const emailInput = wrapper.find('input[name="user-email"]')
    const passwordInput = wrapper.find('input[name="user-password"]')
    const confirmInput = wrapper.find('input[name="user-password-confirmation"]')
    
    await nameInput.setValue('John Doe')
    await emailInput.setValue('existing@example.com')
    await passwordInput.setValue('password123')
    await confirmInput.setValue('password123')
    
    const form = wrapper.find('form')
    await form.trigger('submit')
    
    expect(wrapper.find('.text-red-500').text()).toBe('Email already exists')
  })

  it('resets form on successful registration', async () => {
    mockAuthStore.signUp.mockResolvedValue({ success: true })
    
    const wrapper = mount(Register)
    
    const nameInput = wrapper.find('input[name="user-name"]')
    const emailInput = wrapper.find('input[name="user-email"]')
    const passwordInput = wrapper.find('input[name="user-password"]')
    const confirmInput = wrapper.find('input[name="user-password-confirmation"]')
    
    await nameInput.setValue('John Doe')
    await emailInput.setValue('john@example.com')
    await passwordInput.setValue('password123')
    await confirmInput.setValue('password123')
    
    const form = wrapper.find('form')
    await form.trigger('submit')
    
    await wrapper.vm.$nextTick()
    
    expect(nameInput.element.value).toBe('')
    expect(emailInput.element.value).toBe('')
    expect(passwordInput.element.value).toBe('')
    expect(confirmInput.element.value).toBe('')
  })

  it('disables inputs during submission', async () => {
    mockAuthStore.signUp.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))
    
    const wrapper = mount(Register)
    
    const nameInput = wrapper.find('input[name="user-name"]')
    const emailInput = wrapper.find('input[name="user-email"]')
    const passwordInput = wrapper.find('input[name="user-password"]')
    const confirmInput = wrapper.find('input[name="user-password-confirmation"]')
    
    await nameInput.setValue('John Doe')
    await emailInput.setValue('john@example.com')
    await passwordInput.setValue('password123')
    await confirmInput.setValue('password123')
    
    const form = wrapper.find('form')
    await form.trigger('submit')
    
    expect(nameInput.attributes('disabled')).toBeDefined()
    expect(emailInput.attributes('disabled')).toBeDefined()
    expect(passwordInput.attributes('disabled')).toBeDefined()
    expect(confirmInput.attributes('disabled')).toBeDefined()
  })
})

