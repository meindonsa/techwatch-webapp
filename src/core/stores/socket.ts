import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { useUserStore } from './user.ts'
import { useArticleStore } from './article.ts'
import { useRouter } from 'vue-router'

export const useSocketStore = defineStore('socket', () => {
  const socket = ref<WebSocket | null>(null)
  const isConnected = ref(false)
  const userStore = useUserStore()
  const articleStore = useArticleStore()
  const router = useRouter()

  const connect = () => {
    if (socket.value || !userStore.user?.username) return

    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'
    const wsUrl = baseUrl.replace('http', 'ws')
    const username = userStore.user.username
    const token = userStore.accessToken
    
    // Include JWT token as query parameter for authentication
    socket.value = new WebSocket(`${wsUrl}/ws/${username}?token=${encodeURIComponent(token || '')}`)

    socket.value.onopen = () => {
      isConnected.value = true
      console.log('[Socket] Connected to API')
    }

    socket.value.onmessage = async (event) => {
      try {
        const data = JSON.parse(event.data)
        if (data.type === 'new_articles') {
          console.log(`[Socket] New articles available in feed ${data.feedId}`)
          
          const currentRoute = router.currentRoute.value
          const path = currentRoute.path
          const query = currentRoute.query

          const isHomePage = path === '/'
          const isArticlesPage1 = path === '/articles' && (!query.page || query.page === '1')

          if (isHomePage || isArticlesPage1) {
            console.log('[Socket] User is on page 1, triggering automatic update...')
            const size = isHomePage ? 5 : 50 
            const searchKey = (query.searchKey as string) || null
            await articleStore.fetchArticles(0, size, searchKey)
          }
        }
      } catch (e) {
        console.error('[Socket] Error parsing message', e)
      }
    }

    socket.value.onclose = async () => {
      isConnected.value = false
      socket.value = null
      console.log('[Socket] Disconnected. Attempting to reconnect in 5s...')
      
      // Try to refresh token before reconnecting if we have a refresh token
      if (userStore.refreshToken) {
        try {
          await userStore.refreshToken()
          console.log('[Socket] Token refreshed for reconnection')
        } catch (e) {
          console.error('[Socket] Failed to refresh token for reconnection:', e)
        }
      }
      
      setTimeout(connect, 5000)
    }

    socket.value.onerror = (error) => {
      console.error('[Socket] Error:', error)
    }
  }

  const disconnect = () => {
    if (socket.value) {
      socket.value.close()
      socket.value = null
      isConnected.value = false
    }
  }

  watch(() => userStore.user, (user) => {
    if (user) {
      connect()
    } else {
      disconnect()
    }
  }, { immediate: true })

  return {
    isConnected,
    connect,
    disconnect
  }
})
