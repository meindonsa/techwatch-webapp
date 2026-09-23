<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'
import { useUserStore } from '@/core/stores/user.ts'
import Button from '@/shared/components/Button.vue'

const userStore = useUserStore()

const email = ref('')
const error = ref<string | null>(null)
const loading = ref(false)
const sent = ref(false)

// Délai avant de pouvoir renvoyer un lien (évite le spam d'e-mails)
const RESEND_DELAY = 60
const cooldown = ref(0)
let timer: ReturnType<typeof setInterval> | null = null

const startCooldown = () => {
  cooldown.value = RESEND_DELAY
  if (timer) clearInterval(timer)
  timer = setInterval(() => {
    cooldown.value--
    if (cooldown.value <= 0 && timer) {
      clearInterval(timer)
      timer = null
    }
  }, 1000)
}

const handleSubmit = async () => {
  if (loading.value || cooldown.value > 0) return

  if (!email.value.trim()) {
    error.value = 'Saisis l’adresse email de ton compte'
    return
  }

  error.value = null
  loading.value = true
  try {
    await userStore.forgotPassword(email.value.trim())
    sent.value = true
    startCooldown()
  } catch (e: any) {
    error.value =
      e.response?.data?.error ||
      'Impossible d’envoyer le lien pour le moment. Réessaie dans un instant.'
  } finally {
    loading.value = false
  }
}

const useAnotherEmail = () => {
  sent.value = false
  error.value = null
}

onBeforeUnmount(() => {
  if (timer) clearInterval(timer)
})
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

      <!-- État 1 : formulaire -->
      <template v-if="!sent">
        <h1 class="text-center text-[#E8EAF0] text-[24px] font-serif font-medium mb-1">
          Mot de passe oublié ?
        </h1>
        <p class="text-center text-[#8B93A7] text-[13.5px] mb-7">
          Saisis ton email, on t’envoie un lien pour en choisir un nouveau
        </p>

        <div class="space-y-4">
          <!-- Field Email -->
          <div class="space-y-1 mb-4">
            <label for="forgot-email" class="block text-[12.5px] text-[#8B93A7]">Email</label>
            <input
              id="forgot-email"
              v-model="email"
              type="email"
              autocomplete="email"
              class="input-field"
              placeholder="ton@email.com"
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
            :label="loading ? 'Envoi en cours…' : 'Envoyer le lien'"
            @click="handleSubmit"
            :disabled="loading"
            class="w-full block"
          />

          <!-- Footer -->
          <div class="text-center mt-5 text-[13px] text-[#8B93A7]">
            Tu t’en souviens ?
            <RouterLink
              to="/login"
              class="text-[#FF7A33] font-semibold hover:underline transition-colors"
            >
              Se connecter
            </RouterLink>
          </div>
        </div>
      </template>

      <!-- État 2 : lien envoyé -->
      <template v-else>
        <h1 class="text-center text-[#E8EAF0] text-[24px] font-serif font-medium mb-1">
          Vérifie ta boîte mail
        </h1>
        <p class="text-center text-[#8B93A7] text-[13.5px] mb-7">
          Si un compte existe pour
          <span class="text-[#E8EAF0]">{{ email }}</span
          >, un lien de réinitialisation vient de partir. Il est valable 1 heure.
        </p>

        <div class="space-y-4">
          <div
            v-if="error"
            role="alert"
            class="p-3 bg-red-900/20 border border-red-900/50 rounded-lg text-red-400 text-xs text-center mb-4"
          >
            {{ error }}
          </div>

          <Button
            :label="cooldown > 0 ? `Renvoyer le lien (${cooldown} s)` : 'Renvoyer le lien'"
            @click="handleSubmit"
            :disabled="loading || cooldown > 0"
            class="w-full block"
          />

          <div class="text-center mt-5 text-[13px] text-[#8B93A7] space-y-2">
            <p>
              Rien reçu ? Regarde dans tes spams, ou
              <button
                type="button"
                class="text-[#FF7A33] font-semibold hover:underline transition-colors"
                @click="useAnotherEmail"
              >
                change d’adresse</button
              >.
            </p>
            <p>
              <RouterLink
                to="/login"
                class="text-[#FF7A33] font-semibold hover:underline transition-colors"
              >
                Retour à la connexion
              </RouterLink>
            </p>
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
