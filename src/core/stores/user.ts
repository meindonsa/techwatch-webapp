import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { UserService, type User } from '@/shared/api/UserService.ts'
import { useRouter } from 'vue-router'

export const useUserStore = defineStore('user', () => {
  const router = useRouter()
  // Initialize state from localStorage to persist across refreshes
  const user = ref<User | null>(
    localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null
  )
  const accessToken = ref<string | null>(localStorage.getItem('access_token') ?? null)
  const refreshToken = ref<string | null>(localStorage.getItem('refresh_token') ?? null)

  const isAuthenticated = computed(() => !!accessToken.value)

  async function login(username: string, password: string) {
    const { data } = await UserService.login({ username, password })

    user.value = data.user
    accessToken.value = data.accessToken
    refreshToken.value = data.refreshToken

    // Persist to localStorage
    localStorage.setItem('user', JSON.stringify(data.user))
    localStorage.setItem('access_token', data.accessToken)
    localStorage.setItem('refresh_token', data.refreshToken)
    router.push('/home')
  }

  async function register(username: string, password: string) {
    await UserService.register({ username, password })
  }

  async function logout() {
    if (refreshToken.value) {
      try {
        await UserService.logout(refreshToken.value)
        router.push('/login');
      } catch (e) {
        console.error('Logout error:', e)
      }
    }
    
    user.value = null
    accessToken.value = null
    refreshToken.value = null
    
    // Clear localStorage
    localStorage.removeItem('user')
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
  }

  async function refreshToken() {
    if (!refreshToken.value) throw new Error('No refresh token')
    
    const { data } = await UserService.refresh({ refreshToken: refreshToken.value })
    accessToken.value = data.accessToken
    localStorage.setItem('access_token', data.accessToken)
    return data.accessToken
  }

  return { 
    user, 
    accessToken, 
    refreshToken, 
    isAuthenticated, 
    login, 
    register, 
    logout,
    refreshToken
  }
})
