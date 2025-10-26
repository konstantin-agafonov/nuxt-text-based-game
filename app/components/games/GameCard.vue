<script setup lang="ts">
  const categoriesStore = useCategoriesStore()
  const gamesStore = useGamesStore()
  const { game } = defineProps(['game'])
</script>

<template>
  <div class="space-y-4">
    <div>
      <label class="block text-sm font-medium text-gray-700">Name</label>
      <p class="mt-1 text-sm text-gray-900">{{ game.name }}</p>
    </div>
    <div>
      <label class="block text-sm font-medium text-gray-700">Category</label>
      <p class="mt-1 text-sm text-gray-900">
        {{ categoriesStore.getCategoryName(game.category_id) }}
      </p>
    </div>
    <div>
      <label class="block text-sm font-medium text-gray-700">Status</label>
      <span :class="[
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
      <p class="mt-1 text-sm text-gray-900 whitespace-pre-wrap">
        {{ game.description || 'No description provided' }}
      </p>
    </div>
  </div>
</template>

<style scoped>

</style>