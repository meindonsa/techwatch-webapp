import api from '@/shared/api/axiosInstance.ts'
import type { AxiosResponse } from 'axios'

export interface User {
    id: number
    username: string
    email: string
    full_name: string
    created_at: string
}

export interface AuthResponse {
    accessToken: string
    refreshToken: string
    user: User
}

export interface LoginRequest {
    email: string
    password: string
}

export interface RegisterRequest {
    email: string
    full_name: string
    password: string
}

export interface RefreshRequest {
    refreshToken: string
  }

export interface UpdateProfileRequest {
    full_name: string
}

export interface UpdatePasswordRequest {
    currentPassword: string
    newPassword: string
}

export interface ForgotPasswordRequest {
    email: string
}

export interface ResetPasswordRequest {
    token: string
    password: string
}

export type OAuthProvider = 'google' | 'github'

export interface OAuthExchangeRequest {
    code: string
}

export interface OAuthProviderStatus {
    provider: OAuthProvider
    configured: boolean
    linked: boolean
    email: string | null
    linkedAt: string | null
}

export interface OAuthAccountsResponse {
    hasPassword: boolean
    providers: OAuthProviderStatus[]
}

/**
 * URL de départ du flux de connexion OAuth. Ce doit être une navigation complète
 * (window.location), pas un appel axios : l'API redirige vers Google / GitHub.
 */
export function getOAuthLoginUrl(provider: OAuthProvider): string {
  const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'
  return `${base}/auth/${provider}`
}

export const UserService = {
  async login(data: LoginRequest): Promise<AxiosResponse<AuthResponse>> {
    return api.post('/auth/login', data)
  },

  async oauthExchange(data: OAuthExchangeRequest): Promise<AxiosResponse<AuthResponse>> {
    return api.post('/auth/oauth/exchange', data)
  },

  async getOAuthAccounts(): Promise<AxiosResponse<OAuthAccountsResponse>> {
    return api.get('/users/me/oauth')
  },

  // Renvoie l'URL de consentement du provider : le front doit y naviguer (window.location)
  async startOAuthLink(provider: OAuthProvider): Promise<AxiosResponse<{ url: string }>> {
    return api.post(`/users/me/oauth/${provider}/start`)
  },

  async unlinkOAuthAccount(provider: OAuthProvider): Promise<AxiosResponse<{ message: string }>> {
    return api.delete(`/users/me/oauth/${provider}`)
  },

  async register(data: RegisterRequest): Promise<AxiosResponse<User>> {
    return api.post('/auth/register', data)
  },

  async refresh(data: RefreshRequest): Promise<AxiosResponse<{ accessToken: string }>> {
    return api.post('/auth/refresh', data)
  },

  async logout(refreshToken: string): Promise<AxiosResponse> {
    return api.post('/auth/logout', { refreshToken })
  },

  async getProfile(): Promise<AxiosResponse<User>> {
    return api.get('/users/me')
  },

  async updatePassword(data: UpdatePasswordRequest): Promise<AxiosResponse> {
    return api.patch('/users/me/password', data)
  },

  async updateProfile(data: UpdateProfileRequest): Promise<AxiosResponse<User>> {
    return api.patch('/users/me', data)
  },

  async deleteAccount(): Promise<AxiosResponse> {
    return api.delete('/users/me')
  },

  async forgotPassword(data: ForgotPasswordRequest): Promise<AxiosResponse<{ message: string }>> {
    return api.post('/auth/forgot-password', data)
  },

  async resetPassword(data: ResetPasswordRequest): Promise<AxiosResponse<{ message: string }>> {
    return api.post('/auth/reset-password', data)
  }
}
