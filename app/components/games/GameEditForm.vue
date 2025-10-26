<script setup lang="ts">
  const categoriesStore = useCategoriesStore()

  const {
    handleSaveGame,
    errors,
    cancelEditing,
    editFormLoading,
  } = defineProps([
    'handleSaveGame',
    'errors',
    'cancelEditing',
    'editFormLoading'
  ])

  const model = defineModel({required: true})
</script>

<template>
  <form
      @submit.prevent="handleSaveGame"
      class="space-y-4"
  >
    <div>
      <label
          for="edit-name"
          class="block text-sm font-medium text-gray-700"
      >Name</label>
      <input
          id="edit-name"
          v-model="model.name"
          type="text"
          required
          class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          :class="{ 'border-red-300': errors.name }"
      />
      <p
          v-if="errors.name"
          class="mt-1 text-sm text-red-600"
      >
        {{ errors.name }}
      </p>
    </div>

    <div>
      <label
          for="edit-category"
          class="block text-sm font-medium text-gray-700"
      >Category</label>
      <select
          id="edit-category"
          v-model="model.category_id"
          required
          class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
      >
        <option value="">Select a category</option>
        <option
            v-for="category in categoriesStore.categories"
            :key="category.id"
            :value="category.id"
        >{{ category.name }}</option>
      </select>
    </div>

    <div>
      <label
          for="edit-description"
          class="block text-sm font-medium text-gray-700"
      >Description</label>
      <textarea
          id="edit-description"
          v-model="model.description"
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
</template>

<style scoped>

</style>