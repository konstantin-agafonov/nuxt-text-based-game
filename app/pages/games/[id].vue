<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-center justify-between">
          <div>
            <button
              @click="navigateTo('/games')"
              class="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700"
            >
              <Icon name="heroicons:arrow-left" class="h-4 w-4 mr-1" />
              Back to Games
            </button>
            <h1 class="mt-2 text-3xl font-bold text-gray-900">
              {{ isEditing ? 'Edit Game' : game?.name || 'Loading...' }}
            </h1>
          </div>
          <div class="flex space-x-3">
            <button
              v-if="!isEditing"
              @click="startEditing"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              <Icon name="heroicons:pencil" class="h-4 w-4 mr-2" />
              Edit
            </button>
            <button
              v-if="!isEditing"
              @click="navigateTo(`/games/${game?.id}/scenario`)"
              class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <Icon name="heroicons:document-text" class="h-4 w-4 mr-2" />
              Edit Scenario
            </button>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="gamesStore.loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>

      <!-- Error State -->
      <div v-else-if="gamesStore.error" class="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
        <div class="flex">
          <Icon name="heroicons:exclamation-triangle" class="h-5 w-5 text-red-400" />
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800">Error</h3>
            <div class="mt-2 text-sm text-red-700">{{ gamesStore.error }}</div>
          </div>
        </div>
      </div>

      <!-- Game Content -->
      <div v-else-if="game" class="space-y-6">
        <!-- Game Info Card -->
        <div class="bg-white shadow rounded-lg">
          <div class="px-6 py-4 border-b border-gray-200">
            <h2 class="text-lg font-medium text-gray-900">Game Information</h2>
          </div>
          <div class="px-6 py-4">
            <div v-if="!isEditing" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Game Name</label>
                <p class="mt-1 text-sm text-gray-900">{{ game.name }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Category</label>
                <p class="mt-1 text-sm text-gray-900">{{ categoriesStore.getCategoryName(game.category_id) }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Status</label>
                <span 
                  :class="[
                    'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                    game.status === 0 
                      ? 'bg-yellow-100 text-yellow-800' 
                      : 'bg-green-100 text-green-800'
                  ]"
                >
                  {{ gamesStore.getGameStatusLabel(game.status) }}
                </span>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Description</label>
                <p class="mt-1 text-sm text-gray-900 whitespace-pre-wrap">{{ game.description || 'No description provided' }}</p>
              </div>
            </div>

            <!-- Edit Form -->
            <form v-else @submit.prevent="handleSaveGame" class="space-y-4">
              <div>
                <label for="edit-name" class="block text-sm font-medium text-gray-700">Game Name</label>
                <input
                  id="edit-name"
                  v-model="editForm.name"
                  type="text"
                  required
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  :class="{ 'border-red-300': editFormErrors.name }"
                />
                <p v-if="editFormErrors.name" class="mt-1 text-sm text-red-600">{{ editFormErrors.name }}</p>
              </div>

              <div>
                <label for="edit-category" class="block text-sm font-medium text-gray-700">Category</label>
                <select
                  id="edit-category"
                  v-model="editForm.category_id"
                  required
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="">Select a category</option>
                  <option v-for="category in categoriesStore.categories" :key="category.id" :value="category.id">
                    {{ category.name }}
                  </option>
                </select>
              </div>

              <div>
                <label for="edit-description" class="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  id="edit-description"
                  v-model="editForm.description"
                  rows="4"
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                ></textarea>
              </div>

              <div class="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  @click="cancelEditing"
                  class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  :disabled="editFormLoading"
                  class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                >
                  {{ editFormLoading ? 'Saving...' : 'Save Changes' }}
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- Scenario Section -->
        <div class="bg-white shadow rounded-lg">
          <div class="px-6 py-4 border-b border-gray-200">
            <h2 class="text-lg font-medium text-gray-900">Game Scenario</h2>
          </div>
          <div class="px-6 py-4">
            <div v-if="game.scenario && Object.keys(game.scenario).length > 0">
              <pre class="text-sm text-gray-900 whitespace-pre-wrap">{{ JSON.stringify(game.scenario, null, 2) }}</pre>
            </div>
            <div v-else class="text-center py-8">
              <Icon name="heroicons:document-text" class="mx-auto h-12 w-12 text-gray-400" />
              <h3 class="mt-2 text-sm font-medium text-gray-900">No scenario</h3>
              <p class="mt-1 text-sm text-gray-500">This game doesn't have a scenario yet.</p>
              <div class="mt-6">
                <button
                  @click="navigateTo(`/games/${game.id}/scenario`)"
                  class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  <Icon name="heroicons:plus" class="h-4 w-4 mr-2" />
                  Create Scenario
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCategoriesStore } from '~/stores/categories'
import { useGamesStore, type UpdateGameData } from '~/stores/games'

// Middleware to ensure user is authenticated
definePageMeta({
  middleware: 'auth'
})

const route = useRoute()
const categoriesStore = useCategoriesStore()
const gamesStore = useGamesStore()
const toast = useToast()

// Get game ID from route
const gameId = parseInt(route.params.id as string)

// Reactive state
const isEditing = ref(false)
const editFormLoading = ref(false)

// Edit form
const editForm = ref<UpdateGameData>({
  name: '',
  description: '',
  category_id: 0
})

const editFormErrors = ref<Record<string, string>>({})

// Computed
const game = computed(() => gamesStore.currentGame)

// Load data on mount
onMounted(async () => {
  await Promise.all([
    categoriesStore.fetchCategories(),
    gamesStore.fetchGame(gameId)
  ])
})

// Edit handlers
const startEditing = () => {
  if (!game.value) return
  
  editForm.value = {
    name: game.value.name,
    description: game.value.description || '',
    category_id: game.value.category_id
  }
  isEditing.value = true
  editFormErrors.value = {}
}

const cancelEditing = () => {
  isEditing.value = false
  editFormErrors.value = {}
}

const handleSaveGame = async () => {
  if (!game.value) return

  editFormErrors.value = {}
  
  // Validate form
  if (!editForm.value.name?.trim()) {
    editFormErrors.value.name = 'Game name is required'
    return
  }

  if (gamesStore.checkGameNameExists(editForm.value.name, game.value.id)) {
    editFormErrors.value.name = 'A game with this name already exists'
    return
  }

  if (!editForm.value.category_id) {
    return
  }

  editFormLoading.value = true

  try {
    await gamesStore.updateGame(game.value.id, editForm.value)
    isEditing.value = false
    toast.success('Game updated successfully!')
  } catch (error) {
    toast.error('Failed to update game')
  } finally {
    editFormLoading.value = false
  }
}
</script>
