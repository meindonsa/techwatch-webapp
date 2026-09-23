<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/core/stores/user.ts'
import Button from '@/shared/components/Button.vue'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const MIN_LENGTH = 12

function isStrongPassword(pwd: string): boolean {
  if (pwd.length < 12) return false
  if (!/[A-Z]/.test(pwd)) return false
  if (!/[a-z]/.test(pwd)) return false
  if (!/[0-9]/.test(pwd)) return false
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd)) return false
  return true
}

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

// Le token arrive via le lien reçu par email : /reset-password?token=...
const token = computed(() => {
  const t = route.query.token
  return typeof t === 'string' ? t : ''
})

const password = ref('')
const confirmation = ref('')
const showPassword = ref(false)
const error = ref<string | null>(null)
const loading = ref(false)
const done = ref(false)

const handleSubmit = async () => {
  if (loading.value) return

  if (password.value.length < MIN_LENGTH) {
    error.value = `Le mot de passe doit contenir au moins ${MIN_LENGTH} caractères`
    return
  }
  if (!isStrongPassword(password.value)) {
    error.value =
      'Le mot de passe doit contenir au moins : 1 majuscule, 1 minuscule, 1 chiffre, 1 caractère spécial'
    return
  }
  if (password.value !== confirmation.value) {
    error.value = 'Les deux mots de passe ne correspondent pas'
    return
  }

  error.value = null
  loading.value = true
  try {
    await userStore.resetPassword(token.value, password.value)
    done.value = true
  } catch (e: any) {
    error.value =
      e.response?.data?.error ||
      'Impossible de mettre à jour ton mot de passe. Le lien a peut-être expiré.'
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

      <!-- État : lien invalide (pas de token dans l'URL) -->
      <template v-if="!token">
        <h1 class="text-center text-[#E8EAF0] text-[24px] font-serif font-medium mb-1">
          Lien invalide
        </h1>
        <p class="text-center text-[#8B93A7] text-[13.5px] mb-7">
          Ce lien est incomplet ou a expiré. Demande-en un nouveau pour continuer.
        </p>
        <Button
          label="Demander un nouveau lien"
          @click="router.push('/forgot-password')"
          class="w-full block"
        />
      </template>

      <!-- État : mot de passe mis à jour -->
      <template v-else-if="done">
        <h1 class="text-center text-[#E8EAF0] text-[24px] font-serif font-medium mb-1">
          Mot de passe mis à jour
        </h1>
        <p class="text-center text-[#8B93A7] text-[13.5px] mb-7">
          Tu peux maintenant te connecter avec ton nouveau mot de passe.
        </p>
        <Button label="Se connecter" @click="router.push('/login')" class="w-full block" />
      </template>

      <!-- État : formulaire -->
      <template v-else>
        <h1 class="text-center text-[#E8EAF0] text-[24px] font-serif font-medium mb-1">
          Nouveau mot de passe
        </h1>
        <p class="text-center text-[#8B93A7] text-[13.5px] mb-7">
          Choisis un mot de passe d’au moins {{ MIN_LENGTH }} caractères
        </p>

        <div class="space-y-4">
          <!-- Field Password -->
          <div class="space-y-1 mb-4">
            <div class="flex items-center justify-between">
              <label for="reset-password" class="block text-[12.5px] text-[#8B93A7]"
                >Nouveau mot de passe</label
              >
              <button
                type="button"
                class="text-[12px] text-[#8B93A7] hover:text-[#E8EAF0] transition-colors"
                :aria-pressed="showPassword"
                @click="showPassword = !showPassword"
              >
                {{ showPassword ? 'Masquer' : 'Afficher' }}
              </button>
            </div>
            <input
              id="reset-password"
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              autocomplete="new-password"
              class="input-field"
              placeholder="••••••••"
              @keyup.enter="handleSubmit"
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
                    passwordStrength.score === 5 && i === 4 ? 'bg-green-500' : '',
                  ]"
                />
              </div>
              <div class="flex flex-wrap gap-1.5 text-[11px] text-[#8B93A7]">
                <span :class="passwordStrength.checks.length ? 'text-[#FF7A33]' : 'text-[#8B93A7]'"
                  >12+ caractères</span
                >
                <span :class="passwordStrength.checks.upper ? 'text-[#FF7A33]' : 'text-[#8B93A7]'"
                  >Majuscule</span
                >
                <span :class="passwordStrength.checks.lower ? 'text-[#FF7A33]' : 'text-[#8B93A7]'"
                  >Minuscule</span
                >
                <span :class="passwordStrength.checks.digit ? 'text-[#FF7A33]' : 'text-[#8B93A7]'"
                  >Chiffre</span
                >
                <span :class="passwordStrength.checks.special ? 'text-[#FF7A33]' : 'text-[#8B93A7]'"
                  >Spécial</span
                >
              </div>
            </div>
          </div>

          <!-- Field Confirmation -->
          <div class="space-y-1 mb-4">
            <label for="reset-confirmation" class="block text-[12.5px] text-[#8B93A7]"
              >Confirme le mot de passe</label
            >
            <input
              id="reset-confirmation"
              v-model="confirmation"
              :type="showPassword ? 'text' : 'password'"
              autocomplete="new-password"
              class="input-field"
              placeholder="••••••••"
              @keyup.enter="handleSubmit"
            />
          </div>

          <!-- Error Message -->
          <div
            v-if="error"
            role="alert"
            class="p-3 bg-red-900/20 border border-red-900/50 rounded-lg text-red-400 text-xs text-center mb-4"
          >
            {{ error }}
          </div>

          <!-- Submit Button -->
          <Button
            :label="loading ? 'Mise à jour…' : 'Mettre à jour le mot de passe'"
            @click="handleSubmit"
            :disabled="loading"
            class="w-full block"
          />

          <!-- Footer -->
          <div class="text-center mt-5 text-[13px] text-[#8B93A7]">
            <RouterLink
              to="/login"
              class="text-[#FF7A33] font-semibold hover:underline transition-colors"
            >
              Retour à la connexion
            </RouterLink>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
h1 {
  font-family: 'Fraunces', serif;
}
</style>
