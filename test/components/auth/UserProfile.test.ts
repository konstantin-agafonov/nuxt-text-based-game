import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '~/stores/auth'
import UserProfile from '~/components/auth/UserProfile.vue'

// Mock the auth store
vi.mock('~/stores/auth', () => ({
  useAuthStore: vi.fn()
}))

describe('UserProfile Component', () => {
  let mockAuthStore: any

  beforeEach(() => {
    setActivePinia(createPinia())
    
    mockAuthStore = {
      signOut: vi.fn(),
      user: { id: 1, name: 'John Doe', email: 'john@example.com' },
      isAuthenticated: true,
      isLoading: false
    }
    
    vi.mocked(useAuthStore).mockReturnValue(mockAuthStore)
  })

  it('renders user profile when authenticated', () => {
    const wrapper = mount(UserProfile)
    
    expect(wrapper.find('.text-sm.text-gray-600').text()).toContain('Welcome, John Doe')
    expect(wrapper.find('button').exists()).toBe(true)
  })

  it('displays user name when available', () => {
    const wrapper = mount(UserProfile)
    
    expect(wrapper.text()).toContain('Welcome, John Doe')
  })

  it('displays user email when name is not available', () => {
    mockAuthStore.user = { id: 1, email: 'john@example.com' }
    
    const wrapper = mount(UserProfile)
    
    expect(wrapper.text()).toContain('Welcome, john@example.com')
  })

  it('shows logout button', () => {
    const wrapper = mount(UserProfile)
    
    const logoutButton = wrapper.find('button')
    expect(logoutButton.text()).toBe('Logout')
    expect(logoutButton.classes()).toContain('bg-red-200')
  })

  it('calls signOut when logout button is clicked', async () => {
    const wrapper = mount(UserProfile)
    
    const logoutButton = wrapper.find('button')
    await logoutButton.trigger('click')
    
    expect(mockAuthStore.signOut).toHaveBeenCalled()
  })

  it('shows loading state during logout', async () => {
    mockAuthStore.signOut.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))
    
    const wrapper = mount(UserProfile)
    
    const logoutButton = wrapper.find('button')
    await logoutButton.trigger('click')
    
    expect(logoutButton.attributes('disabled')).toBeDefined()
    expect(logoutButton.text()).toBe('...')
  })

  it('has correct button styling', () => {
    const wrapper = mount(UserProfile)
    
    const logoutButton = wrapper.find('button')
    expect(logoutButton.classes()).toContain('text-sm')
    expect(logoutButton.classes()).toContain('w-[80px]')
    expect(logoutButton.classes()).toContain('h-[25px]')
    expect(logoutButton.classes()).toContain('bg-red-200')
    expect(logoutButton.classes()).toContain('cursor-pointer')
  })

  it('applies disabled styling when logging out', async () => {
    mockAuthStore.signOut.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))
    
    const wrapper = mount(UserProfile)
    
    const logoutButton = wrapper.find('button')
    await logoutButton.trigger('click')
    
    expect(logoutButton.classes()).toContain('disabled:opacity-50')
  })
})

