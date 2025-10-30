export const useAuthStore = defineStore('auth', () => {
  const isLoading = ref(false)
  const config = useRuntimeConfig()

  // Base URL for Laravel backend
  const apiBase = config.public.apiBase

  // Get CSRF token from cookies
  const getCsrfToken = () => {
    if (process.client) {
      const cookies = document.cookie.split('; ')
      const xsrfCookie = cookies.find(row => row.startsWith('XSRF-TOKEN='))
      if (xsrfCookie) {
        return decodeURIComponent(xsrfCookie.split('=')[1])
      }
    }
    return null
  }

  // Initialize CSRF protection
  const initCsrf = async () => {
    try {
      await $fetch(`${apiBase}/sanctum/csrf-cookie`, { 
        credentials: 'include' 
      })
    } catch (error) {
      console.error('Failed to initialize CSRF:', error)
    }
  }

  // Fetch current user
  const fetchUser = async () => {
    try {
      const userData = await $fetch(`${apiBase}/api/user`, { 
        credentials: 'include' 
      })
      user.value = userData
      return userData
    } catch (error) {
      console.error('Failed to fetch user:', error)
      user.value = null
      return null
    }
  }

  return {
    isLoading: readonly(isLoading),
    fetchUser,
    getCsrfToken,
    initCsrf
  }
})
