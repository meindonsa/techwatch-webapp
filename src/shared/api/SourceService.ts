import api from '@/shared/api/axiosInstance.ts'
import type { AxiosResponse } from 'axios'
import { useUserStore } from '@/core/stores/user.ts'

export interface Feed {
  id: number
  type: 'rss' | 'atom'
  feed_url: string
  original_url: string
  name: string
  article_count: number
  created_at: string | Date
}

export interface NewSource {
    name: string
    url: string
}

export const SourceService = {
  async retrieveSources(): Promise<AxiosResponse<Feed[]>> {
    const userStore = useUserStore()
    const username = userStore.user?.username || 'guest'
    return api.get(`/feeds/by-username/${username}`)
  },

  async createSource(source: NewSource): Promise<AxiosResponse> {
    const userStore = useUserStore()
    const username = userStore.user?.username || 'guest'
    return api.post(`/feeds/${username}`, source)
  }
}
