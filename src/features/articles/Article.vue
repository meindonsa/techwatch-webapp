<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { onMounted, ref, computed } from 'vue'
import { datePipe } from '@/shared/service/DateFormatter.ts'
import { useArticleStore } from '@/core/stores/article.ts'
import Button from '@/shared/components/Button.vue'

const route = useRoute()
const router = useRouter()
const articleStore = useArticleStore()

const loading = ref(false)
const { formatDate } = datePipe()
const id = Number(route.params.id)

const retrieveArticle = async () => {
  // 1. Check if article is already in store
  if (articleStore.currentArticle && articleStore.currentArticle.id === id) {
    return
  }

  loading.value = true
  try {
    await articleStore.fetchArticleById(id)
  } catch (e) {
    console.error('Erreur lors de la récupération de l\'article :', e)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  if (id) retrieveArticle()
})

const article = computed(() => articleStore.currentArticle)
</script>

<template>
  <div class="max-w-[680px] mx-auto px-5 py-8 md:py-10">
    <!-- Back Link -->
    <div 
      @click="router.push('/articles')" 
      class="inline-flex items-center gap-1.5 text-[13px] text-text-muted cursor-pointer hover:text-accent transition-colors mb-6"
    >
      <span>←</span> Retour au fil
    </div>

    <div v-if="loading" class="text-center text-text-muted py-20">
      Chargement de l'article...
    </div>

    <div v-else-if="article" class="flex flex-col">
      <!-- Source Header -->
      <div class="flex items-center gap-2.5 mb-4">
        <div class="w-[28px] h-[28px] rounded-lg bg-surface border border-border flex items-center justify-center text-[11px] font-semibold text-text-muted shrink-0">
          {{ article.title?.substring(0, 2).toUpperCase() || '??' }}
        </div>
        <span class="text-[13px] text-text-muted">{{ article.source_name || 'Source inconnue' }}</span>
      </div>

      <!-- Title -->
      <h1 class="font-serif text-[30px] font-medium leading-[1.25] text-text mb-3 tracking-tight">
        {{ article.title }}
      </h1>

      <!-- Meta -->
      <div class="text-[13px] text-text-faint mb-7 pb-7 border-b border-border">
        Par {{ article.author || 'Auteur inconnu' }} — {{ formatDate(article.fetched_at, 'medium') }}
      </div>

      <!-- Image -->
      <div v-if="article.image" class="mb-8">
        <img 
          :src="article.image" 
          :alt="article.title" 
          class="w-full h-auto max-h-[400px] object-cover rounded-xl border border-border shadow-sm"
        />
      </div>

      <!-- Body -->
      <div 
        v-if="article.summary" 
        class="text-[#C9CEDA] leading-[1.75] text-[15.5px] mb-10 prose prose-invert prose-indigo max-w-none" 
        v-html="article.summary"
      ></div>
      <div v-else class="text-gray-500 italic text-center py-10">
        Aucun résumé disponible pour cet article.
      </div>

      <!-- Original Link -->
      <div class="flex justify-start">
        <a 
          :href="article.link" 
          target="_blank" 
          class="text-[13.5px] text-accent border-b border-accent hover:opacity-80 transition-opacity"
        >
          Lire l'article original →
        </a>
      </div>
    </div>

    <div v-else class="text-center text-text-muted py-20">
      Article non trouvé.
    </div>
  </div>
</template>

<style scoped></style>
