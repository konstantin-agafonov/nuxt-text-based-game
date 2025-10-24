<template>
  <!-- Header -->
  <div class="mb-8">
    <h1 class="text-3xl font-bold text-gray-900">Games</h1>
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

  <!-- Games Table -->
  <div v-else class="bg-white shadow rounded-lg">
    <div class="px-6 py-4 border-b border-gray-200">
      <div class="flex justify-between items-center">
        <h2 class="text-lg font-medium text-gray-900">Games</h2>
        <button
            @click="showCreateForm = true"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Icon name="heroicons:plus" class="h-4 w-4 mr-2" />
          New Game
        </button>
      </div>
    </div>

    <div v-if="gamesStore.games.length === 0" class="text-center py-12">
      <Icon name="heroicons:game-controller" class="mx-auto h-12 w-12 text-gray-400" />
      <h3 class="mt-2 text-sm font-medium text-gray-900">No games</h3>
      <p class="mt-1 text-sm text-gray-500">Get started by creating a new game.</p>
      <div class="mt-6">
        <button
            @click="showCreateForm = true"
            class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          <Icon name="heroicons:plus" class="h-4 w-4 mr-2" />
          New Game
        </button>
      </div>
    </div>

    <div v-else class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
        <tr>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Game Name
          </th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Category
          </th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Status
          </th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Actions
          </th>
        </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
        <tr v-for="game in gamesStore.games" :key="game.id" class="hover:bg-gray-50">
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="text-sm font-medium text-gray-900">{{ game.name }}</div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="text-sm text-gray-900">{{ categoriesStore.getCategoryName(game.category_id) }}</div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
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
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
            <div class="flex space-x-2">
              <button
                  @click="navigateTo(`/games/${game.id}`)"
                  class="text-blue-600 hover:text-blue-900"
                  title="View Game"
              >
                <Icon name="heroicons:eye" class="h-4 w-4" />
              </button>
              <button
                  @click="editGame(game)"
                  class="text-indigo-600 hover:text-indigo-900"
                  title="Edit Game"
              >
                <Icon name="heroicons:pencil" class="h-4 w-4" />
              </button>
              <button
                  @click="confirmDeleteGame(game)"
                  class="text-red-600 hover:text-red-900"
                  title="Delete Game"
              >
                <Icon name="heroicons:trash" class="h-4 w-4" />
              </button>
            </div>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- Create Game Modal -->
  <VueFinalModal
      v-model="showCreateForm"
      class="flex justify-center items-center"
      content-class="max-w-md mx-4 bg-white rounded-lg shadow-lg"
  >
    <div class="p-6">
      <h3 class="text-lg font-medium text-gray-900 mb-4">Create New Game</h3>

      <form @submit.prevent="handleCreateGame" class="space-y-4">
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700">Game Name</label>
          <input
              id="name"
              v-model="createForm.name"
              type="text"
              required
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              :class="{ 'border-red-300': createFormErrors.name }"
          />
          <p v-if="createFormErrors.name" class="mt-1 text-sm text-red-600">{{ createFormErrors.name }}</p>
        </div>

        <div>
          <label for="category" class="block text-sm font-medium text-gray-700">Category</label>
          <select
              id="category"
              v-model="createForm.category_id"
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
          <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
          <textarea
              id="description"
              v-model="createForm.description"
              rows="3"
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          ></textarea>
        </div>

        <div class="flex justify-end space-x-3 pt-4">
          <button
              type="button"
              @click="showCreateForm = false"
              class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
              type="submit"
              :disabled="createFormLoading"
              class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
          >
            {{ createFormLoading ? 'Creating...' : 'Create Game' }}
          </button>
        </div>
      </form>
    </div>
  </VueFinalModal>

  <!-- Delete Confirmation Modal -->
  <VueFinalModal
      v-model="showDeleteModal"
      class="flex justify-center items-center"
      content-class="max-w-md mx-4 bg-white rounded-lg shadow-lg"
  >
    <div class="p-6">
      <div class="flex items-center">
        <Icon name="heroicons:exclamation-triangle" class="h-6 w-6 text-red-600" />
        <h3 class="ml-3 text-lg font-medium text-gray-900">Delete Game</h3>
      </div>
      <div class="mt-2">
        <p class="text-sm text-gray-500">
          Are you sure you want to delete "{{ gameToDelete?.name }}"? This action cannot be undone.
        </p>
      </div>
      <div class="flex justify-end space-x-3 mt-4">
        <button
            @click="showDeleteModal = false"
            class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
            @click="handleDeleteGame"
            :disabled="deleteLoading"
            class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-50"
        >
          {{ deleteLoading ? 'Deleting...' : 'Delete' }}
        </button>
      </div>
    </div>
  </VueFinalModal>
</template>

<script setup lang="ts">
// Middleware to ensure user is authenticated
definePageMeta({
  middleware: 'auth'
})

const categoriesStore = useCategoriesStore()
const gamesStore = useGamesStore()
const { notify } = useNotification();

// Reactive state
const showCreateForm = ref(false)
const showDeleteModal = ref(false)
const gameToDelete = ref<any>(null)
const createFormLoading = ref(false)
const deleteLoading = ref(false)

// Create form
const createForm = ref<CreateGameData>({
  name: '',
  description: '',
  category_id: 0
})

const createFormErrors = ref<Record<string, string>>({})

// Load data on mount
onMounted(async () => {
  await Promise.all([
    categoriesStore.fetchCategories(),
    gamesStore.fetchGames()
  ])
})

// Create game handler
const handleCreateGame = async () => {
  createFormErrors.value = {}
  
  // Validate form
  if (!createForm.value.name.trim()) {
    createFormErrors.value.name = 'Game name is required'
    return
  }

  if (gamesStore.checkGameNameExists(createForm.value.name)) {
    createFormErrors.value.name = 'A game with this name already exists'
    return
  }

  if (!createForm.value.category_id) {
    return
  }

  createFormLoading.value = true

  try {
    await gamesStore.createGame(createForm.value)
    showCreateForm.value = false
    createForm.value = { name: '', description: '', category_id: 0 }
    notify({text: 'Game created successfully!'});
  } catch (error) {
    notify({text: 'Failed to create game', type: 'error'});
  } finally {
    createFormLoading.value = false
  }
}

// Edit game handler
const editGame = (game: any) => {
  navigateTo(`/games/${game.id}`)
}

// Delete game handlers
const confirmDeleteGame = (game: any) => {
  gameToDelete.value = game
  showDeleteModal.value = true
}

const handleDeleteGame = async () => {
  if (!gameToDelete.value) return

  deleteLoading.value = true

  try {
    await gamesStore.deleteGame(gameToDelete.value.id)
    showDeleteModal.value = false
    gameToDelete.value = null
    notify({text: 'Game deleted successfully!'});
  } catch (error) {
    notify({text: 'Failed to delete game', type: 'error'});
  } finally {
    deleteLoading.value = false
  }
}
</script>
