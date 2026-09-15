<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/core/stores/user.ts'
import { UserService } from '@/shared/api/UserService.ts'
import Button from '@/shared/components/Button.vue'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const router = useRouter()

const profile = ref(userStore.user)
const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const isUpdating = ref(false)
const isDeleting = ref(false)
const message = ref({ type: '', text: '' })

async function fetchProfile() {
  try {
    const { data } = await UserService.getProfile()
    profile.value = data
    userStore.user = data
  } catch (e) {
    console.error('Error fetching profile:', e)
  }
}

async function handleUpdatePassword() {
  if (newPassword.value.length < 8) {
    message.value = { type: 'error', text: 'Le nouveau mot de passe doit contenir au moins 8 caractères.' }
    return
  }
  if (newPassword.value !== confirmPassword.value) {
    message.value = { type: 'error', text: 'Les mots de passe de confirmation ne correspondent pas.' }
    return
  }

  isUpdating.value = true
  message.value = { type: '', text: '' }

  try {
    // Note: The backend current implementation only takes newPassword. 
    // In a real scenario, we'd send currentPassword too.
    await UserService.updatePassword(newPassword.value)
    message.value = { type: 'success', text: 'Mot de passe mis à jour avec succès !' }
    currentPassword.value = ''
    newPassword.value = ''
    confirmPassword.value = ''
  } catch (e: any) {
    message.value = { type: 'error', text: e.response?.data?.error || 'Une erreur est survenue.' }
  } finally {
    isUpdating.value = false
  }
}

async function handleDeleteAccount() {
  if (!confirm('Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.')) return

  isDeleting.value = true
  try {
    await UserService.deleteAccount()
    await userStore.logout()
    router.push('/login')
  } catch (e: any) {
    alert(e.response?.data?.error || 'Erreur lors de la suppression du compte.')
  } finally {
    isDeleting.value = false
  }
}

onMounted(fetchProfile)
</script>

<template>
  <div class="max-w-[560px] mx-auto py-8 px-5">
    <!-- Profile Header -->
    <div class="flex items-center gap-3.5 mb-8">
      <div class="w-[52px] h-[52px] rounded-full bg-accent flex items-center justify-center text-lg font-semibold text-bg shrink-0">
        {{ profile?.username?.substring(0, 2).toUpperCase() || '??' }}
      </div>
      <div>
        <h1 class="font-serif text-[22px] font-medium leading-tight">
          {{ profile?.username }}
        </h1>
        <p class="text-text-muted text-[13px] mt-0.5">
          Membre depuis {{ profile?.created_at ? new Date(profile.created_at).getFullYear() : '2026' }}
        </p>
      </div>
    </div>

    <!-- Settings Sections -->
    <div class="space-y-10">
      <!-- Password Section -->
      <section>
        <h2 class="text-sm font-semibold text-text mb-4">Mot de passe</h2>
        <div class="p-6 rounded-xl bg-surface border border-border space-y-4">
          <div class="space-y-1.5">
            <label class="text-xs font-medium text-text-faint uppercase tracking-wider">Mot de passe actuel</label>
            <input 
              v-model="currentPassword"
              type="password" 
              placeholder="••••••••"
              class="w-full bg-bg border border-border rounded-lg px-4 py-2.5 text-sm text-text focus:ring-1 focus:ring-accent outline-none transition-all"
            />
          </div>
          <div class="space-y-1.5">
            <label class="text-xs font-medium text-text-faint uppercase tracking-wider">Nouveau mot de passe</label>
            <input 
              v-model="newPassword"
              type="password" 
              placeholder="8 caractères minimum"
              class="w-full bg-bg border border-border rounded-lg px-4 py-2.5 text-sm text-text focus:ring-1 focus:ring-accent outline-none transition-all"
            />
          </div>
          <div class="space-y-1.5">
            <label class="text-xs font-medium text-text-faint uppercase tracking-wider">Confirmer le nouveau mot de passe</label>
            <input 
              v-model="confirmPassword"
              type="password" 
              placeholder="••••••••"
              class="w-full bg-bg border border-border rounded-lg px-4 py-2.5 text-sm text-text focus:ring-1 focus:ring-accent outline-none transition-all"
            />
          </div>
          
          <Button 
            :disabled="isUpdating" 
            @click="handleUpdatePassword"
            class="w-full mt-2"
          >
            {{ isUpdating ? 'Mise à jour...' : 'Mettre à jour le mot de passe' }}
          </Button>
          
          <p v-if="message.text" :class="['text-xs mt-3 text-center', message.type === 'success' ? 'text-green-500' : 'text-red-500']">
            {{ message.text }}
          </p>
        </div>
      </section>

      <!-- Session Section -->
      <section>
        <h2 class="text-sm font-semibold text-text mb-4">Session</h2>
        <div class="p-6 rounded-xl bg-surface border border-border">
          <div class="flex items-center justify-between gap-4">
            <div class="min-w-0">
              <div class="text-sm font-medium text-text">Déconnexion</div>
              <div class="text-xs text-text-muted truncate">Termine ta session sur cet appareil</div>
            </div>
            <Button 
              variant="outline" 
              @click="userStore.logout(); router.push('/login')" 
              class="shrink-0"
            >
              Se déconnecter
            </Button>
          </div>
        </div>
      </section>

      <!-- Danger Zone -->
      <section>
        <h2 class="text-sm font-semibold text-text mb-4">Zone sensible</h2>
        <div class="p-6 rounded-xl bg-surface border border-border border-l-red-500 border-l-4">
          <div class="text-sm font-medium text-text mb-2">Supprimer mon compte</div>
          <p class="text-xs text-text-muted mb-6 leading-relaxed">
            Cette action est définitive : tes sources, articles lus et session seront supprimés. Impossible à annuler.
          </p>
          <Button 
            variant="danger" 
            :disabled="isDeleting"
            @click="handleDeleteAccount"
          >
            {{ isDeleting ? 'Suppression...' : 'Supprimer mon compte' }}
          </Button>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped></style>
