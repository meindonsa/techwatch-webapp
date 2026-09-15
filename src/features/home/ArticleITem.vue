<script setup lang="ts">
import { datePipe } from '@/shared/service/DateFormatter.ts'

defineProps(['article'])
const { formatDate } = datePipe()
</script>

<template>
  <RouterLink
    :to="'article/' + article.id"
    class="flex gap-3.5 p-4 border-b border-border transition-colors hover:bg-surface-hover cursor-pointer group"
  >
    <!-- Article Avatar -->
    <div class="w-[34px] h-[34px] rounded-lg bg-surface border border-border flex items-center justify-center text-[12px] font-semibold text-text-muted shrink-0">
      {{ article.title?.substring(0, 2).toUpperCase() || '??' }}
    </div>

    <!-- Article Body -->
    <div class="min-w-0 flex-1">
      <h3 class="font-serif text-[17px] font-medium leading-[1.35] mb-1 group-hover:text-accent transition-colors truncate">
        {{ article.title }}
      </h3>
      
      <div class="flex items-center gap-2 text-[12.5px] text-text-muted flex-wrap">
        <!-- Source: just the name, no dot here according to la context.html -->
        <span class="text-text-faint">{{ article.source_name || 'Source inconnue' }}</span>
        <span class="hidden sm:inline">•</span>
        <span class="text-text">{{ article.author || 'Inconnu' }}</span>
        <span class="hidden sm:inline">•</span>
        <span>{{ formatDate(article.fetched_at, 'mediumDate') }}</span>
      </div>
    </div>
  </RouterLink>
</template>

<style scoped></style>
