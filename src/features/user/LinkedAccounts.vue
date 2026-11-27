<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  UserService,
  type OAuthAccountsResponse,
  type OAuthProvider,
} from '@/shared/api/UserService.ts'
import { getOAuthLinkErrorMessage } from '@/features/auth/oauthErrors.ts'
import Button from '@/shared/components/Button.vue'

const props = defineProps<{
  accounts: OAuthAccountsResponse | null
  failed?: boolean
}>()

const emit = defineEmits<{
  (e: 'refresh'): void
}>()

const route = useRoute()
const router = useRouter()

const PROVIDER_META: Record<OAuthProvider, { label: string; icon: string }> = {
  google: { label: 'Google', icon: 'bxl-google' },
  github: { label: 'GitHub', icon: 'bxl-github' },
}

const busy = ref<OAuthProvider | null>(null)
const message = ref<{ type: 'success' | 'error'; text: string } | null>(null)

// Providers à afficher : activés côté API, ou déjà liés (pour pouvoir les dissocier)
const rows = computed(() =>
  (props.accounts?.providers ?? []).filter((p) => p.configured || p.linked),
)

const linkedCount = computed(() => rows.value.filter((p) => p.linked).length)

// Un provider ne peut être dissocié que s'il reste un autre moyen de se connecter
const canUnlink = computed(() => !!props.accounts?.hasPassword || linkedCount.value > 1)

// Retour de l'API après une liaison : /profile?linked=<provider> ou /profile?link_error=<code>
onMounted(() => {
  const { linked, link_error: linkError } = route.query
  if (typeof linked === 'string' && linked in PROVIDER_META) {
    message.value = {
      type: 'success',
      text: `${PROVIDER_META[linked as OAuthProvider].label} est maintenant lié à ton compte.`,
    }
  } else if (linkError) {
    message.value = { type: 'error', text: getOAuthLinkErrorMessage(linkError) }
  }
  if (linked || linkError) {
    router.replace({ name: 'profile', query: {} })
  }
})

async function handleLink(provider: OAuthProvider) {
  busy.value = provider
  message.value = null
  try {
    const { data } = await UserService.startOAuthLink(provider)
    // Navigation complète vers la page de consentement ; l'API nous ramène sur /profile
    window.location.href = data.url
  } catch (e: any) {
    message.value = {
      type: 'error',
      text: e.response?.data?.error || 'Impossible de démarrer la liaison.',
    }
    busy.value = null
  }
}

async function handleUnlink(provider: OAuthProvider) {
  busy.value = provider
  message.value = null
  try {
    await UserService.unlinkOAuthAccount(provider)
    message.value = {
      type: 'success',
      text: `${PROVIDER_META[provider].label} a été dissocié de ton compte.`,
    }
    emit('refresh')
  } catch (e: any) {
    message.value = {
      type: 'error',
      text: e.response?.data?.error || 'Impossible de dissocier ce compte.',
    }
  } finally {
    busy.value = null
  }
}
</script>

<template>
  <section>
    <h2 class="text-sm font-semibold text-text mb-4">Comptes connectés</h2>
    <div class="p-6 rounded-xl bg-surface border border-border">
      <p v-if="failed" class="text-xs text-red-400">
        Impossible de charger tes comptes connectés pour le moment.
      </p>
      <p v-else-if="!accounts" class="text-xs text-text-muted">Chargement…</p>
      <p v-else-if="!rows.length" class="text-xs text-text-muted">
        Aucun mode de connexion externe n'est disponible pour le moment.
      </p>

      <ul v-else class="divide-y divide-border -my-3">
        <li
          v-for="p in rows"
          :key="p.provider"
          class="flex items-center justify-between gap-4 py-3"
        >
          <div class="flex items-center gap-3 min-w-0">
            <i
              class="bx text-xl text-text shrink-0"
              :class="PROVIDER_META[p.provider].icon"
              aria-hidden="true"
            ></i>
            <div class="min-w-0">
              <div class="text-sm font-medium text-text">{{ PROVIDER_META[p.provider].label }}</div>
              <div class="text-xs text-text-muted truncate">
                {{ p.linked ? p.email || 'Compte lié' : 'Non lié' }}
              </div>
            </div>
          </div>

          <Button
            v-if="p.linked"
            label="Dissocier"
            severity="outline"
            class="shrink-0"
            :disabled="busy !== null || !canUnlink"
            :aria-label="`Dissocier ${PROVIDER_META[p.provider].label}`"
            @click="handleUnlink(p.provider)"
          />
          <Button
            v-else
            label="Lier"
            severity="outline"
            class="shrink-0"
            :disabled="busy !== null"
            :aria-label="`Lier ${PROVIDER_META[p.provider].label}`"
            @click="handleLink(p.provider)"
          />
        </li>
      </ul>

      <p v-if="accounts && linkedCount > 0 && !canUnlink" class="text-xs text-text-muted mt-4">
        C'est ton seul moyen de connexion : définis un mot de passe ou lie un autre compte avant de
        le dissocier.
      </p>

      <p
        v-if="message"
        :class="[
          'text-xs mt-4 text-center',
          message.type === 'success' ? 'text-green-500' : 'text-red-500',
        ]"
        role="status"
      >
        {{ message.text }}
      </p>
    </div>
  </section>
</template>
