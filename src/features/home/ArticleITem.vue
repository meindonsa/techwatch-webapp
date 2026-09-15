<script setup lang="ts">
import { datePipe } from '@/shared/service/DateFormatter.ts'
import { useArticleStore } from '@/core/stores/article.ts'
import { useRouter } from 'vue-router'

const props = defineProps(['article'])
const { formatDate } = datePipe()
const articleStore = useArticleStore()
const router = useRouter()

const handleNavigate = () => {
  // 1. Mark the article as selected in the store first
  articleStore.setSelectedId(props.article.id)
  // 2. Navigate to the CORRECT route: /article/:id (singular)
  router.push(`/article/${props.article.id}`)
}
</script>

<template>
  <div
    @click="handleNavigate"
    class="flex gap-3.5 p-4 border-b border-border transition-colors hover:bg-surface-hover cursor-pointer group"
  >
    <!-- Article Avatar -->
    <div class="w-[34px] h-[34px] rounded-lg bg-surface border border-border flex items-center justify-center text-[12px] font-semibold text-text-muted shrink-to-0 shrink-0">
      {{ article.title?.substring(0, 2).toUpperCase() || '??' }}
    </div>

    <!-- Article Body -->
    <div class="min-w-0 flex-1">
      <h3 class="font-serif text-[17px] font-medium leading-[1.35] mb-1 group-hover:text-accent transition-colors truncate">
        {{ article.title }}
      </h3>
      
      <div class="flex items-center gap-2 text-[12.5px] text-text-muted flex-wrap">
        <span class="flex items-center gap-1.5 text-text-faint">
          {{ article.source_name || 'Source inconnue' }}
        </span>
        <span class="hidden sm:inline">•</span>
        <span class="text-text">{{ article.author || 'Inconnu' }}</span>
        <span class="hidden sm:inline">•</span>
        <span>{{ formatDate(article.fetched_at, 'mediumDate') }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
