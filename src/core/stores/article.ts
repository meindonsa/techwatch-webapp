import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { ArticleService, type Article } from '@/shared/api/ArticleService.ts'

export const useArticleStore = defineStore('article', () => {
  const articles = ref<Article[]>([])
  const selectedArticleId = ref<number | null>(null)
  const loading = ref(false)

  const currentArticle = computed(() => {
    if (!selectedArticleId.value) return null
    return articles.value.find(a => a.id === selectedArticleId.value) || null
  })

  async function fetchArticles(index = 0, size = 10, searchKey: string | null = null): Promise<{ total: number }> {
    loading.value = true
    try {
      const { data } = await ArticleService.retrieveArticles({ 
        index, 
        size, 
        searchKey: searchKey || undefined 
      })
      if (data) {
        articles.value = data.objects || []
        return { total: data.total || 0 }
      }
      return { total: 0 }
    } catch (e) {
      console.error('Error fetching articles:', e)
      return { total: 0 }
    } finally {
      loading.value = false
    }
  }

  const setSelectedId = (id: number) => {
    selectedArticleId.value = id
  }

  async function fetchArticleById(id: number): Promise<Article | null> {
    try {
      const { data } = await ArticleService.retrieveArticle(id)
      if (data) {
        if (!articles.value.find(a => a.id === id)) {
          articles.value.push(data)
        }
        return data
      }
    } catch (e) {
      console.error('Error fetching article:', e)
    }
    return null
  }

  return { 
    articles, 
    selectedArticleId, 
    currentArticle, 
    loading,
    fetchArticles,
    setSelectedId, 
    fetchArticleById 
  }
})
