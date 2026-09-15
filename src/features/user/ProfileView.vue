<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/core/stores/user.ts'
import { UserService } from '@/shared/api/UserService.ts'
import Button from '@/shared/components/Button.vue'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const router = useRouter()

const profile = ref(userStore.user)
const newPassword = ref('')
const isUpdating = ref(false)
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
  if (newPassword.value.length < 6) {
    message.value = { type: 'error', text: 'Le mot de passe doit contenir au moins 6 caractères.' }
    return
  }

  isUpdating.value = true
  message.value = { type: '', text: '' }

  try {
    await UserService.updatePassword(newPassword.value)
    message.value = { type: 'success', text: 'Mot de passe mis à jour avec succès !' }
    newPassword.value = ''
  } catch (e: any) {
    message.value = { type: 'error', text: e.response?.data?.error || 'Une erreur est survenue.' }
  } finally {
    isUpdating.value = false
  }
}

onMounted(fetchProfile)
</script>

<template>
  <div class="max-w-2xl mx-auto py-12 px-6">
    <!-- Header -->
    <header class="mb-12">
      <h1 class="font-serif text-5xl mb-4">Mon Profil</h1>
      <p class="text-text-muted text-lg">Gérez vos informations personnelles et vos paramètres de sécurité.</p>
    </header>

    <div class="grid gap-12">
      <!-- User Info Card -->
      <section class="p-8 rounded-2xl bg-surface border border-border">
        <h2 class="text-sm font-bold uppercase tracking-widest text-accent mb-6">Informations</h2>
        
        <div class="space-y-6">
          <div class="flex items-center justify-between pb-4 border-b border-border/50">
            <span class="text-text-faint">Nom d'utilisateur</span>
            <span class="font-medium text-text">{{ profile?.username }}</span>
          </div>
          <div class="flex items-center justify-between pb-4 border-b border-border/50">
            <span class="text-text-faint">Date d'inscription</span>
            <span class="font-medium text-text">
              {{ profile?.created_at ? new Date(profile.created_at).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Inconnue' }}
            </span>
          </div>
        </div>

        <div class="mt-8">
          <Button 
            variant="outline" 
            @click="() => router.push(`/articles?username=${profile?.username}`)"
          >
            Voir mes articles
          </Button>
        </div>
      </section>

      <!-- Security Card -->
      <section class="p-8 rounded-2xl bg-surface border border-border">
        <h2 class="text-sm font-bold uppercase tracking-widest text-accent mb-6">Sécurité</h2>
        
        <div class="space-y-4">
          <div class="space-y-2">
            <label class="text-xs font-medium text-text-faint uppercase">Nouveau mot de passe</label>
            <input 
              v-model="newPassword"
              type="password" 
              placeholder="••••••••"
              class="w-full bg-bg border border-border rounded-lg px-4 py-3 text-text focus:ring-2 focus:ring-accent outline-none transition-all"
            />
          </div>

          <Button 
            :disabled="isUpdating" 
            @click="handleUpdatePassword"
          >
            {{ isUpdating ? 'Mise à jour...' : 'Modifier le mot de passe' }}
          </Button>

          <p v-if="message.text" :class="['text-sm mt-4', message.type === 'success' ? 'text-green-500' : 'text-red-500']">
            {{ message.text }}
          </p>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped></style>
