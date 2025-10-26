export interface Game {
  id: number
  name: string
  description: string | null
  user_id: number
  category_id: number
  scenario: any | null
  status: number // 0 = DRAFT, 1 = PUBLISHED
  created_at: string
  updated_at: string
}

export interface CreateGameData {
  name: string
  description: string
  category_id: number
}

export interface UpdateGameData {
  name?: string
  description?: string
  user_id: number
  category_id?: number
  scenario?: any,
  status: number // 0 = DRAFT, 1 = PUBLISHED
}

export const useGamesStore = defineStore('games', () => {
  const games = ref<Game[]>([])
  const currentGame = ref<Game | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const config = useRuntimeConfig()
  const apiBase = config.public.apiBase

  const { getCsrfToken, initCsrf } = useAuthStore()
  const { currentUser } = storeToRefs(useAuthStore())

  const fetchGames = async () => {
    loading.value = true
    error.value = null
    
    try {
      const { data } = await $fetch<{ data: Game[] }>(`${apiBase}/api/v1/game`, {
          credentials: 'include'
      })
      games.value = data
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch games'
      console.error('Error fetching games:', err)
    } finally {
      loading.value = false
    }
  }

  const fetchGame = async (id: number) => {
    loading.value = true
    error.value = null
    
    try {
      const { data } = await $fetch<{ data: Game }>(`${apiBase}/api/v1/game/${id}`, {
          credentials: 'include'
      })
      currentGame.value = data
      return data
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch game'
      console.error('Error fetching game:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const createGame = async (gameData: CreateGameData) => {
    loading.value = true
    error.value = null

    gameData.user_id = currentUser.value.id

    try {
      // Initialize CSRF first
      await initCsrf()
      const csrfToken = getCsrfToken()
      if (!csrfToken) {
          return { success: false, error: 'CSRF token not provided' }
      }

      const createdGameData = await $fetch<{ data: Game }>(`${apiBase}/api/v1/game`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            'X-XSRF-TOKEN': csrfToken
        },
        body: gameData
      })

      games.value.push(createdGameData)
      return createdGameData
    } catch (err: any) {
      error.value = err.message || 'Failed to create game'
      console.error('Error creating game:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateGame = async (id: number, gameData: UpdateGameData) => {
    loading.value = true
    error.value = null

    gameData.user_id = currentUser.value.id

    try {
      // Initialize CSRF first
      await initCsrf()
      const csrfToken = getCsrfToken()
      if (!csrfToken) {
          return { success: false, error: 'CSRF token not provided' }
      }

      const updatedGameData = await $fetch<{ data: Game }>(`${apiBase}/api/v1/game/${id}`, {
        method: 'PUT',
        credentials: 'include',
          headers: {
              'Content-Type': 'application/json',
              'X-XSRF-TOKEN': csrfToken
          },
        body: gameData
      })
      
      const index = games.value.findIndex(game => game.id === id)
      if (index !== -1) {
        games.value[index] = updatedGameData
      }
      
      if (currentGame.value?.id === id) {
        currentGame.value = updatedGameData
      }
      
      return updatedGameData
    } catch (err: any) {
      error.value = err.message || 'Failed to update game'
      console.error('Error updating game:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteGame = async (id: number) => {
    loading.value = true
    error.value = null
    
    try {
        // Initialize CSRF first
        await initCsrf()
        const csrfToken = getCsrfToken()
        if (!csrfToken) {
            return { success: false, error: 'CSRF token not provided' }
        }

      await $fetch(`${apiBase}/api/v1/game/${id}`, {
        method: 'DELETE',
          headers: {
              'Content-Type': 'application/json',
              'X-XSRF-TOKEN': csrfToken
          },
        credentials: 'include',
      })

      games.value = games.value.filter(game => game.id !== id)
      
      if (currentGame.value?.id === id) {
        currentGame.value = null
      }
    } catch (err: any) {
      error.value = err.message || 'Failed to delete game'
      console.error('Error deleting game:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const getGameById = (id: number) => {
    return games.value.find(game => game.id === id)
  }

  const getGameStatusLabel = (status: number) => {
    return status === 0 ? 'Draft' : 'Published'
  }

  const checkGameNameExists = (name: string, excludeId?: number) => {
    return games.value.some(game => 
      game.name.toLowerCase() === name.toLowerCase() && 
      game.id !== excludeId
    )
  }

  return {
    games: readonly(games),
    currentGame: readonly(currentGame),
    loading: readonly(loading),
    error: readonly(error),
    fetchGames,
    fetchGame,
    createGame,
    updateGame,
    deleteGame,
    getGameById,
    getGameStatusLabel,
    checkGameNameExists
  }
})
