<script setup lang="ts">
import { getOAuthLoginUrl, type OAuthProvider } from '@/shared/api/UserService.ts'
import Button from '@/shared/components/Button.vue'

withDefaults(
  defineProps<{
    disabled?: boolean
    // Texte du séparateur ("ou continuer avec", "ou s'inscrire avec"…)
    intro?: string
  }>(),
  {
    disabled: false,
    intro: 'ou continuer avec',
  },
)

const emit = defineEmits<{
  (e: 'start', provider: OAuthProvider): void
}>()

const providers: { id: OAuthProvider; label: string; icon: string }[] = [
  { id: 'google', label: 'Google', icon: 'bxl-google' },
  { id: 'github', label: 'GitHub', icon: 'bxl-github' },
]

const handleClick = (provider: OAuthProvider) => {
  emit('start', provider)
  // Navigation complète : l'API redirige vers la page de consentement du fournisseur
  window.location.href = getOAuthLoginUrl(provider)
}
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center gap-3 text-[12px] text-[#8B93A7]">
      <span class="h-px flex-1 bg-border"></span>
      {{ intro }}
      <span class="h-px flex-1 bg-border"></span>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <Button
        v-for="provider in providers"
        :key="provider.id"
        severity="outline"
        :disabled="disabled"
        :aria-label="`Continuer avec ${provider.label}`"
        class="w-full flex items-center justify-center gap-2"
        @click="handleClick(provider.id)"
      >
        <i class="bx text-lg" :class="provider.icon" aria-hidden="true"></i>
        {{ provider.label }}
      </Button>
    </div>
  </div>
</template>
