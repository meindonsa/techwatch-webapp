import { defineStore } from 'pinia'
import { ref, computed, type Ref } from 'vue'
import { ArticleService, type Article } from '@/shared/api/ArticleService.ts'

export const useArticleStore = defineStore('article', () => {
  const articles = ref<Article[]>([])
  const selectedArticleId = ref<number | null>(null)

  const currentArticle = computed(() => {
    if (!selectedArticleId.value) return null
    return articles.value.find(a => a.id === selectedArticleId.value) || null
  })

  const setArticles = (data: Article[]) => {
    articles.value = data
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
    setArticles, 
    setSelectedId, 
    fetchArticleById 
  }
})
