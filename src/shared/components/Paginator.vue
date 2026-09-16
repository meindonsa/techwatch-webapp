<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  totalItems: number
  itemsPerPage: number
  currentPage: number
}>()

const emit = defineEmits(['change-page', 'change-size'])

const totalPages = computed(() => Math.ceil(props.totalItems / props.itemsPerPage))

const goToPage = (page: number) => {
  if (page >= 0 && page < totalPages.value) {
    emit('change-page', page)
  }
}

const updateSize = (event: Event) => {
  const target = event.target as HTMLSelectElement
  emit('change-size', Number(target.value))
}
</script>

<template>
  <div v-if="totalPages > 1" class="flex flex-col sm:flex-row justify-center items-center gap-4 mt-8 text-white">
    <div class="flex items-center gap-2">
      <span class="text-sm text-text-muted">Afficher</span>
      <select 
        :value="itemsPerPage" 
        @change="updateSize"
        class="bg-gray-800 text-white text-sm rounded px-2 py-1 outline-none border border-gray-700 focus:border-gray-500"
      >
        <option :value="10">10</option>
        <option :value="20">20</option>
        <option :value="50">50</option>
      </select>
      <span class="text-sm text-text-muted">par page</span>
    </div>

    <div class="flex items-center gap-4">
      <button
        @click="goToPage(currentPage - 1)"
        :disabled="currentPage === 0"
        class="px-4 py-2 bg-gray-800 rounded disabled:opacity-50 hover:bg-gray-700 transition-colors"
      >
        Précédent
      </button>

      <span class="text-sm">Page {{ currentPage + 1 }} sur {{ totalPages }}</span>

      <button
        @click="goToPage(currentPage + 1)"
        :disabled="currentPage >= totalPages - 1"
        class="px-4 py-2 bg-gray-800 rounded disabled:opacity-50 hover:bg-gray-700 transition-colors"
      >
        Suivant
      </button>
    </div>
  </div>
</template>

<style scoped></style>
