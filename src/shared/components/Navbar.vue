<script setup lang="ts">
import { useUserStore } from '@/core/stores/user.ts'
import SearchbBar from '@/shared/components/SearchbBar.vue'
import Button from '@/shared/components/Button.vue'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const router = useRouter()

const handleLogout = async () => {
  await userStore.logout()
  router.push('/login')
}
</script>

<template>
  <header class="sticky top-0 z-20 w-full bg-bg/90 backdrop-blur-md border-b border-border">
    <div class="max-w-[1180px] mx-auto flex items-center justify-between px-4 py-3.5 gap-4">
      
      <!-- Logo: Hidden on mobile (hidden), visible on medium screens and up (md:flex) -->
      <RouterLink to="/" class="hidden md:flex items-center gap-2.5 shrink-0">
        <div class="w-[22px] h-[22px] rounded-[6px] bg-accent flex items-center justify-center">
          <svg viewBox="0 0 24 24" fill="none" class="w-3 h-3" stroke="#12151C" stroke-width="2.4" stroke-linecap="round">
            <path d="M4 4a16 16 0 0 1 16 16M4 10a10 10 0 0 1 10 10M4 16a4 4 0 0 1 4 4"/>
          </svg>
        </div>
        <span class="text-lg font-serif font-semibold text-text tracking-tight whitespace-nowrap">
          Tech-watch
        </span>
      </RouterLink>

      <!-- Search Bar: Takes available space on mobile -->
      <SearchbBar />

      <!-- User Block: Always visible -->
      <div class="flex items-center gap-2 shrink-0">
        <span v-if="userStore.user" class="hidden sm:block text-sm text-text-muted mr-2">
          @{{ userStore.user.username }}
        </span>
        
        <div 
          class="w-[26px] h-[26px] rounded-full bg-gradient-to-br from-accent to-[#FFB37A] flex items-center justify-center text-[11px] font-semibold text-[#1A1006] cursor-pointer"
          @click="router.push('/profile')"
        >
          {{ userStore.user?.username?.substring(0, 2).toUpperCase() || '?' }}
        </div>
        
        <Button 
          label="Déconnexion" 
          @click="handleLogout" 
          severity="secondary" 
          class="py-1.5 px-3 text-xs hidden sm:block"
        />
        <!-- Mobile logout icon or simplified button could go here, but we'll keep it simple for now -->
      </div>
    </div>
  </header>
</template>

<style scoped></style>
