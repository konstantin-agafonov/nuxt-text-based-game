<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-center justify-between">
          <div>
            <button
              @click="navigateTo(`/games/${gameId}`)"
              class="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700"
            >
              <Icon name="heroicons:arrow-left" class="h-4 w-4 mr-1" />
              Back to Game
            </button>
            <h1 class="mt-2 text-3xl font-bold text-gray-900">Edit Scenario</h1>
            <p class="mt-1 text-gray-600">{{ game?.name }}</p>
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

      <!-- Scenario Editor -->
      <div v-else-if="game" class="bg-white shadow rounded-lg">
        <div class="px-6 py-4 border-b border-gray-200">
          <h2 class="text-lg font-medium text-gray-900">Game Scenario</h2>
          <p class="mt-1 text-sm text-gray-500">Edit the scenario data for your game</p>
        </div>
        <div class="px-6 py-4">
          <form @submit.prevent="handleSaveScenario" class="space-y-4">
            <div>
              <label for="scenario" class="block text-sm font-medium text-gray-700">Scenario Data (JSON)</label>
              <textarea
                id="scenario"
                v-model="scenarioText"
                rows="20"
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                placeholder="Enter your scenario data as JSON..."
              ></textarea>
              <p class="mt-1 text-sm text-gray-500">Enter valid JSON data for your game scenario</p>
            </div>

            <div class="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                @click="navigateTo(`/games/${gameId}`)"
                class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="scenarioLoading"
                class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
              >
                {{ scenarioLoading ? 'Saving...' : 'Save Scenario' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Middleware to ensure user is authenticated
/*definePageMeta({
  middleware: 'auth'
})*/

const route = useRoute()
const gamesStore = useGamesStore()
const { notify } = useNotification();

// Get game ID from route
const gameId = parseInt(route.params.id as string)

// Reactive state
const scenarioText = ref('')
const scenarioLoading = ref(false)

// Computed
const game = computed(() => gamesStore.currentGame)

// Load data on mount
onMounted(async () => {
  await gamesStore.fetchGame(gameId)
  
  // Initialize scenario text
  if (game.value?.scenario) {
    scenarioText.value = JSON.stringify(game.value.scenario, null, 2)
  }
})

// Save scenario handler
const handleSaveScenario = async () => {
  if (!game.value) return

  scenarioLoading.value = true

  try {
    // Parse JSON to validate
    const scenarioData = JSON.parse(scenarioText.value)
    
    await gamesStore.updateGame(game.value.id, { scenario: scenarioData })
    notify({text: 'Scenario saved successfully!'});
  } catch (error) {
    notify({text: 'Invalid JSON format. Please check your scenario data.', type: 'error'});
  } finally {
    scenarioLoading.value = false
  }
}
</script>
