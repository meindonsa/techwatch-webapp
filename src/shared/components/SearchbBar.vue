<script setup lang="ts">
import { useFilterStore } from '@/core/stores/filter.ts'
import { ref } from 'vue'
const useFilter = useFilterStore()

const searchKey = ref('')

const onSearching = (): void => {
  useFilter.search(searchKey.value.trim())
}
</script>

<template>
  <div class="flex-1 max-w-[420px]">
    <input 
      type="text" 
      v-model="searchKey" 
      @input="onSearching"
      class="w-full bg-surface border border-border text-text p-2 px-3 rounded-lg text-sm outline-none focus:border-accent transition-colors placeholder:text-text-faint"
      placeholder="Rechercher un article, une source…"
    />
  </div>
</template>

<style scoped></style>
