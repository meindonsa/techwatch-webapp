<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/core/stores/user.ts'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

// L'API redirige ici avec ?code=<code à usage unique, valable 60 s> après Google / GitHub
onMounted(async () => {
  const code = route.query.code

  if (typeof code !== 'string' || !code) {
    router.replace({ name: 'login', query: { error: 'invalid_state' } })
    return
  }

  try {
    await userStore.loginWithCode(code)
    router.replace('/')
  } catch {
    // Code invalide, expiré ou déjà utilisé
    router.replace({ name: 'login', query: { error: 'invalid_code' } })
  }
})
</script>

<template>
  <div class="flex items-center justify-center min-h-screen bg-[#12151C] p-6">
    <div class="flex flex-col items-center gap-4" role="status" aria-live="polite">
      <div
        class="w-8 h-8 rounded-full border-2 border-border border-t-accent animate-spin"
        aria-hidden="true"
      ></div>
      <p class="text-[#8B93A7] text-[13.5px]">Connexion en cours…</p>
    </div>
  </div>
</template>
