<script setup lang="ts">
import { useRouter } from 'vue-router'
import { onMounted, ref } from 'vue'
import { datePipe } from '@/shared/service/DateFormatter.ts'
import { ArticleService, type Article } from '@/shared/api/ArticleService.ts'
import Button from '@/shared/components/Button.vue'

const loading = ref(false)
const router = useRouter()
const article = ref<any | null>(null)
const { formatDate } = datePipe()
const id = ref(router.currentRoute.value.params.fid as string)

const retrieveArticle = async () => {
  loading.value = true
  try {
    const { data } = await ArticleService.retrieveArticle(id.value)
    if (data) {
      article.value = data
    }
  } catch (e) {
    console.error('Erreur lors de la récupération de l\'article :', e)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  if (id.value) retrieveArticle()
})
</script>

<template>
  <main class="maw-w-screen w-screen min-h-screen bg-gray-900 py-20 px-10">
    <div class="flex justify-center">
      <div class="w-full max-w-3xl">
        <!-- Back Button -->
        <Button 
          label="← Retour aux articles" 
          @click="router.push('/articles')" 
          severity="secondary" 
          class="mb-8"
        />

        <div v-if="loading" class="text-center text-gray-400 py-20">
          Chargement de l'article...
        </div>

        <div v-else-if="article" class="bg-neutral-primary-soft border border-gray-500 rounded-base p-6 md:p-10 shadow-lg">
          <!-- Header -->
          <div class="mb-8">
            <h1 class="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
              {{ article.title }}
            </h1>
            <div class="flex flex-wrap items-center gap-4 text-sm text-gray-400 italic">
              <span class="flex items-center gap-1">
                👤 {{ article.author || 'Auteur inconnu' }}
              </span>
              <span class="flex items-center gap-1">
                📅 {{ formatDate(article.fetched_at, 'medium') }}
              </span>
            </div>
          </div>

          <!-- Image -->
          <div v-if="article.image" class="mb-8">
            <img 
              :src="article.image" 
              :alt="article.title" 
              class="w-full h-auto max-h-[400px] object-cover rounded-base border border-gray-600"
            />
          </div>

          <!-- Content with formatting -->
          <div 
            v-if="article.summary" 
            class="text-gray-300 leading-relaxed text-lg mb-10 prose prose-invert prose-indigo max-w-none" 
            v-html="article.summary"
          ></div>
          <div v-else class="text-gray-500 italic text-center py-10">
            Aucun résumé disponible pour cet article.
          </div>

          <!-- Footer -->
          <div class="flex items-center justify-between border-t border-gray-700 pt-6">
            <span class="text-sm text-gray-500">Source : {{ article.source_name || 'Flux inconnu' }}</span>
            <a 
              :href="article.link" 
              target="_blank" 
              class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-base transition duration-300 shadow-md"
            >
              Lire l'article complet →
            </a>
          </div>
        </div>

        <div v-else class="text-center text-gray-400 py-20">
          Article non trouvé.
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped></style>
