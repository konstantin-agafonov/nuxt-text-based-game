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

    // Login user
    /*const signIn = async (credentials: { email: string; password: string }) => {
        isLoading.value = true
        try {
            // Initialize CSRF first
            await initCsrf()
            const csrfToken = getCsrfToken()
            if (!csrfToken) {
                return { success: false, error: 'CSRF token not provided' }
            }

            const response = await fetch(`${baseURL}/login`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'X-XSRF-TOKEN': csrfToken
                },
                body: JSON.stringify(credentials)
            })

            if (response.ok) {
                // Get user data after successful login
                await fetchUser()
                return { success: true }
            } else {
                const error = await response.json()
                return { success: false, error: error.message || 'Login failed' }
            }
        } catch (error) {
            console.error('Login error:', error)
            return { success: false, error: 'Network error' }
        } finally {
            isLoading.value = false
        }
    }*/

    // Register user
    const signUp = async (userData: {
        name: string;
        email: string;
        password: string;
        password_confirmation: string
    }) => {
        isLoading.value = true
        try {
            // Initialize CSRF first
            await initCsrf()
            const csrfToken = getCsrfToken()
            if (!csrfToken) {
                return { success: false, error: 'CSRF token not provided' }
            }

            const response = await fetch(`${apiBase}/register`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'X-XSRF-TOKEN': csrfToken
                },
                body: JSON.stringify(userData)
            })

            if (response.ok) {
                // Get user data after successful registration
                // await fetchUser()
                return { success: true }
            } else {
                const error = await response.json()
                return { success: false, error: error.message || 'Registration failed' }
            }
        } catch (error) {
            console.error('Registration error:', error)
            return { success: false, error: 'Network error' }
        } finally {
            isLoading.value = false
        }
    }

    // Logout user
    /*const signOut = async () => {
        isLoading.value = true
        try {
            await initCsrf()
            const csrfToken = getCsrfToken()
            if (!csrfToken) {
                return { success: false, error: 'CSRF token not provided' }
            }

            await fetch(`${baseURL}/logout`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'X-XSRF-TOKEN': csrfToken
                }
            })
        } catch (error) {
            console.error('Logout error:', error)
        } finally {
            user.value = null
            isLoading.value = false
        }
    }*/

  return {
    isLoading: readonly(isLoading),
    fetchUser,
    getCsrfToken,
    initCsrf,
    signUp,
  }
})
