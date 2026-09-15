<script setup lang="ts">
import { useFilterStore } from '@/core/stores/filter.ts'
import ArticleITem from '@/features/home/ArticleITem.vue'
import Sources from '@/features/home/Sources.vue'
import { computed, ref, watchEffect } from 'vue'
import { ArticleService, type Article } from '@/shared/api/ArticleService.ts'
import Button from '@/shared/components/Button.vue'
import { useRouter } from 'vue-router'
import Skeleton from '@/shared/components/Skeleton.vue'

const router = useRouter()
const loading = ref(false)
const useFilter = useFilterStore()
const searchValue = computed(() => useFilter.searchValue)
const articles = ref<Article[]>([])
const pagination = ref({
  total: 0,
  page: 0,
  size: 5,
})
const retrieveArticles = async (pageIndex = 0, searchKey: null | string = null) => {
  loading.value = true
  try {
    const { data } = await ArticleService.retrieveArticles()
    if (data) {
      articles.value = data
      pagination.value.total = data.length
      pagination.value.page = pageIndex
    }
  } catch (e) {
    console.error('Erreur lors de la récupération :', e)
  } finally {
    loading.value = false
  }
}

watchEffect(() => {
  retrieveArticles(0, searchValue.value)
})

const seeAll = () => {
  router.push('/articles')
}
</script>

<template>
  <main class="maw-w-screen w-screen min-h-screen bg-gray-900 py-20 px-10">
    <h1 class="text-2xl font-bold text-white mb-10">Accueil {{ searchValue }}</h1>
    <div class="flex gap-5">
      <div class="w-[70%]">
        <Skeleton v-if="loading" :count="5" />
        <TransitionGroup>
          <ArticleITem v-for="article in articles" :key="article?.id" :article="article" />
        </TransitionGroup>
        <div class="text-center py-5">
          <Button label="Tout voir" @click="seeAll" severity="secondary" />
        </div>
      </div>
      <div class="w-[30%]">
        <Sources />
      </div>
    </div>
  </main>
</template>
