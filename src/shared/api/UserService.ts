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
