<script setup lang="ts">
const isCollapsed = ref(true)

const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value
}

const menuItems = [
  { icon: 'heroicons:home', text: 'Home', href: '#' },
  { icon: 'heroicons:user', text: 'Profile', href: '#' },
  { icon: 'heroicons:settings', text: 'Settings', href: '#' },
  { icon: 'heroicons:chart-bar', text: 'Analytics', href: '#' },
  { icon: 'heroicons:document-text', text: 'Documents', href: '#' },
  { icon: 'heroicons:mail', text: 'Messages', href: '#' },
  { icon: 'heroicons:calendar', text: 'Calendar', href: '#' },
  { icon: 'heroicons:folder', text: 'Files', href: '#' }
]
</script>

<template>
  <aside 
    :class="[
      'h-screen border-r border-black transition-all duration-300 ease-in-out relative',
      isCollapsed ? 'w-16' : 'w-64'
    ]"
  >
    <!-- Toggle Button -->
    <button
      @click="toggleCollapse"
      class="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors duration-200 z-10"
    >
      <Icon 
        :name="isCollapsed ? 'heroicons:chevron-right' : 'heroicons:chevron-left'" 
        class="w-4 h-4"
      />
    </button>

    <!-- Menu Items -->
    <nav class="pt-16 px-4 space-y-2">
      <template v-for="item in menuItems" :key="item.text">
        <!-- Expanded State -->
        <a
          v-if="!isCollapsed"
          :href="item.href"
          class="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 group"
        >
          <Icon :name="item.icon" class="w-5 h-5 text-gray-600 group-hover:text-gray-900" />
          <span class="text-sm font-medium text-gray-700 group-hover:text-gray-900">{{ item.text }}</span>
        </a>

        <!-- Collapsed State -->
        <a
          v-else
          :href="item.href"
          class="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 transition-colors duration-200 group mx-auto"
          :title="item.text"
        >
          <Icon :name="item.icon" class="w-5 h-5 text-gray-600 group-hover:text-gray-900" />
        </a>
      </template>
    </nav>
  </aside>
</template>

<style scoped>

</style>