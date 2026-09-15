import api from '@/shared/api/axiosInstance.ts'
import type { AxiosResponse } from 'axios'
import { useUserStore } from '@/core/stores/user.ts'

export interface Article {
    id: number
    title: string
    link: string
    pub_date: string | Date | null
    summary: string | null
    author: string | null
    image: string | null
    feed_id: number
    fetched_at: string | Date
}

export const ArticleService = {
  async retrieveArticles(): Promise<AxiosResponse<Article[]>> {
    const userStore = useUserStore()
    const username = userStore.user?.username || 'guest'
    return api.get(`/articles/${username}/articles`)
  },

  async retrieveArticlesByFeed(feedId: number): Promise<AxiosResponse<Article[]>> {
    const userStore = useUserStore()
    const username = userStore.user?.username || 'guest'
    return api.get(`/articles/${username}/feed/${feedId}`)
  },

  async retrieveArticle(id: string | number): Promise<AxiosResponse<Article>> {
    return api.get(`/articles/${id}`)
  }
}
