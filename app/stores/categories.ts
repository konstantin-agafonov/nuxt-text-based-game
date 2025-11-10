export interface Category {
  id: number
  name: string
  created_at: string
  updated_at: string
}

export const useCategoriesStore = defineStore('categories', () => {
  const categories = ref<Category[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const config = useRuntimeConfig()
  const apiBase = config.public.apiBase

  const fetchCategories = async () => {
    loading.value = true
    error.value = null
    
    try {
      const { data } = await $fetch<{ data: Category[] }>(`${apiBase}/api/v1/category`, {
          credentials: 'include'
      })
      categories.value = data
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch categories'
      console.error('Error fetching categories:', err)
    } finally {
      loading.value = false
    }
  }

  const getCategoryById = (id: number) => {
    return categories.value.find(category => category.id === id)
  }

  const getCategoryName = (id: number) => {
    const category = getCategoryById(id)
    return category?.name || 'Unknown Category'
  }

  return {
    categories,
    loading,
    error,
    fetchCategories,
    getCategoryById,
    getCategoryName
  }
})
