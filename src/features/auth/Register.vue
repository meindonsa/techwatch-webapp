<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/core/stores/user.ts'
import Button from '@/shared/components/Button.vue'

const router = useRouter()
const userStore = useUserStore()

const username = ref('')
const password = ref('')
const error = ref<string | null>(null)
const loading = ref(false)

// Password strength validation (matches API requirements: min 12 chars, upper, lower, digit, special)
const passwordStrength = computed(() => {
  const pwd = password.value
  const checks = {
    length: pwd.length >= 12,
    upper: /[A-Z]/.test(pwd),
    lower: /[a-z]/.test(pwd),
    digit: /[0-9]/.test(pwd),
    special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd),
  }
  const score = Object.values(checks).filter(Boolean).length
  return { checks, score, isValid: score === 5 }
})

const handleRegister = async () => {
  error.value = null
  loading.value = true
  try {
    await userStore.register(username.value, password.value)
    router.push('/login')
  } catch (e: any) {
    error.value = e.response?.data?.error || 'Une erreur est survenue lors de l\'inscription'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="flex items-center justify-center min-h-screen bg-[#12151C] p-6">
    <div class="card-auth">
      <div class="flex items-center justify-center gap-3 mb-8">
        <div class="w-6 h-6 rounded-md bg-[#FF7A33] flex items-center justify-center shrink-0">
          <svg viewBox="0 0 24 24" fill="none" class="w-3 h-3" stroke="#12151C" stroke-width="2.4" stroke-linecap="round">
            <path d="M4 4a16 16 0 0 1 16 16M4 10a10 10 0 0 1 10 10M4 16a4 4 0 0 1 4 4"/>
          </svg>
        </div>
        <span class="text-xl font-serif font-medium text-[#E8EAF0]">Tech-watch</span>
      </div>

      <h1 class="text-center text-[#E8EAF0] text-2xl font-serif font-medium mb-1">Créer un compte</h1>
      <p class="text-center text-[#8B93A7] text-sm mb-7">Commence à suivre tes sites préférés</p>
      
      <div class="space-y-4">
        <div class="space-y-1">
          <label class="label-field">Nom d'utilisateur</label>
          <input 
            v-model="username" 
            type="text" 
            class="input-field"
            placeholder="Choisis un pseudo"
          />
        </div>
        <div class="space-y-1">
          <label class="block text-[12.5px] text-[#8B93A7]">Mot de passe</label>
          <input 
            v-model="password" 
            type="password" 
            class="input-field"
            placeholder="••••••••"
            @input="() => {}"
          />
          <!-- Password strength indicator -->
          <div v-if="password" class="space-y-1.5">
            <div class="flex gap-1 h-2">
              <div 
                v-for="(_, i) in 5" 
                :key="i" 
                class="flex-1 rounded transition-colors"
                :class="[
                  passwordStrength.score > i ? 'bg-[#FF7A33]' : 'bg-[#2D323F]',
                  passwordStrength.score === 5 && i === 4 ? 'bg-green-500' : ''
                ]"
              />
            </div>
            <div class="flex flex-wrap gap-1.5 text-[11px] text-[#8B93A7]">
              <span :class="passwordStrength.checks.length ? 'text-[#FF7A33]' : 'text-[#8B93A7]'">12+ caractères</span>
              <span :class="passwordStrength.checks.upper ? 'text-[#FF7A33]' : 'text-[#8B93A7]'">Majuscule</span>
              <span :class="passwordStrength.checks.lower ? 'text-[#FF7A33]' : 'text-[#8B93A7]'">Minuscule</span>
              <span :class="passwordStrength.checks.digit ? 'text-[#FF7A33]' : 'text-[#8B93A7]'">Chiffre</span>
              <span :class="passwordStrength.checks.special ? 'text-[#FF7A33]' : 'text-[#8B93A7]'">Spécial</span>
            </div>
            <p v-if="!passwordStrength.isValid" class="text-red-400 text-[11px]">
              Le mot de passe doit contenir : 12+ caractères, 1 majuscule, 1 minuscule, 1 chiffre, 1 caractère spécial
            </p>
          </div>
        </div>
        
        <div v-if="error" class="p-3 bg-red-900/20 border border-red-900/50 rounded-lg text-red-400 text-xs text-center mb-4">
          {{ error }}
        </div>
        
        <Button 
          label="S'inscrire" 
          @click="handleRegister" 
          :disabled="loading"
          class="w-full block"
        />
        
        <div class="text-center mt-5 text-sm text-[#8B93A7]">
          Déjà inscrit ? 
          <RouterLink to="/login" class="text-[#FF7A33] font-semibold hover:underline transition-colors">
            Se connecter
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
