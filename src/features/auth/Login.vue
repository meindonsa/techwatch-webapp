<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/core/stores/user.ts'
import Button from '@/shared/components/Button.vue'

const router = useRouter()
const userStore = useUserStore()

const email = ref('')
const password = ref('')
const error = ref<string | null>(null)
const loading = ref(false)

const handleLogin = async () => {
  error.value = null
  loading.value = true
  try {
    await userStore.login(email.value, password.value)
    router.push('/')
  } catch (e: any) {
    error.value = e.response?.data?.error || 'Une erreur est survenue lors de la connexion'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="flex items-center justify-center min-h-screen bg-[#12151C] p-6">
    <!-- .auth-card -->
    <div class="w-full max-w-[380px]">
      <!-- .auth-brand -->
      <div class="flex items-center justify-center gap-3 mb-8">
        <div
          class="w-[22px] h-[22px] rounded-[6px] bg-[#FF7A33] flex items-center justify-center shrink-0"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            class="w-3 h-3"
            stroke="#12151C"
            stroke-width="2.4"
            stroke-linecap="round"
          >
            <path d="M4 4a16 16 0 0 1 16 16M4 10a10 10 0 0 1 10 10M4 16a4 4 0 0 1 4 4" />
          </svg>
        </div>
        <span class="text-[20px] font-serif font-medium text-[#E8EAF0]">Tech-watch</span>
      </div>

      <!-- Title & Sub -->
      <h1 class="text-center text-[#E8EAF0] text-[24px] font-serif font-medium mb-1">
        Content de te revoir
      </h1>
      <p class="text-center text-[#8B93A7] text-[13.5px] mb-7">
        Connecte-toi pour retrouver tes flux
      </p>

      <div class="space-y-4">
        <!-- Field Email -->
        <div class="space-y-1 mb-4">
          <label class="block text-[12.5px] text-[#8B93A7]">Email</label>
          <input v-model="email" type="email" class="input-field" placeholder="ton@email.com" />
        </div>

        <!-- Field Password -->
        <div class="space-y-1 mb-4">
          <label class="block text-[12.5px] text-[#8B93A7]">Mot de passe</label>
          <input v-model="password" type="password" class="input-field" placeholder="••••••••" />
        </div>

        <div class="text-end mt-5 text-[13px] text-[#8B93A7]">
          <RouterLink
            to="/forgot-password"
            class="text-[#FF7A33] font-semibold hover:underline transition-colors"
          >
            Mot de passe oublié ?
          </RouterLink>
        </div>

        <!-- Error Message -->
        <div
          v-if="error"
          class="p-3 bg-red-900/20 border border-red-900/50 rounded-lg text-red-400 text-xs text-center mb-4"
        >
          {{ error }}
        </div>

        <!-- Login Button -->
        <Button
          label="Se connecter"
          @click="handleLogin"
          :disabled="loading"
          class="w-full block"
        />

        <!-- Footer -->
        <div class="text-center mt-5 text-[13px] text-[#8B93A7]">
          Pas encore de compte ?
          <RouterLink
            to="/register"
            class="text-[#FF7A33] font-semibold hover:underline transition-colors"
          >
            Créer un compte
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
h1 {
  font-family: 'Fraunces', serif;
}
</style>
