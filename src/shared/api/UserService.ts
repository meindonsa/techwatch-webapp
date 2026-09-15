import api from '@/shared/api/axiosInstance.ts'
import type { AxiosResponse } from 'axios'

export interface User {
    id: number
    username: string
    created_at: string
}

export interface AuthResponse {
    accessToken: string
    refreshToken: string
    user: User
}

export interface LoginRequest {
    username: string
    password: string
}

export interface RegisterRequest {
    username: string
    password: string
}

export interface RefreshRequest {
    refreshToken: string
}

export const UserService = {
  async login(data: LoginRequest): Promise<AxiosResponse<AuthResponse>> {
    return api.post('/auth/login', data)
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

  async updatePassword(newPassword: string): Promise<AxiosResponse> {
    return api.patch('/users/me/password', { newPassword })
  },

  async deleteAccount(): Promise<AxiosResponse> {
    return api.delete('/users/me')
  }
}
