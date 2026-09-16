<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { computed, ref, watch } from 'vue'
import { useFilterStore } from '@/core/stores/filter.ts'
import { useArticleStore } from '@/core/stores/article.ts'
import { ArticleService, type Article } from '@/shared/api/ArticleService.ts'
import ArticleITem from '@/features/home/ArticleITem.vue'
import Paginator from '@/shared/components/Paginator.vue'
import Skeleton from '@/shared/components/Skeleton.vue'

const route = useRoute()
const router = useRouter()
const currentPage = computed(() => Number(route.query.page) || 1)

const articleStore = useArticleStore()
const useFilter = useFilterStore()
const searchValue = computed(() => useFilter.searchValue)
const articles = computed(() => articleStore.articles)
const loading = computed(() => articleStore.loading)
const pagination = ref({ total: 0, page: 0, size: 10 })

const retrieveArticles = async (pageIndex = 0) => {
  const { total } = await articleStore.fetchArticles(pageIndex, pagination.value.size, searchValue.value)
  pagination.value.total = total
  pagination.value.page = pageIndex
}

const handlePageChange = (newPage: number) => {
  goToPage(newPage + 1)
}

const handleSizeChange = (newSize: number) => {
  pagination.value.size = newSize
  goToPage(1)
}

const goToPage = (page: number) => {
  router.push({ path: '/articles', query: { page } })
}

watch(
  searchValue,
  () => {
    goToPage(1)
  }
)

watch(
  currentPage,
  (newPage) => {
    retrieveArticles(newPage - 1)
  },
  { immediate: true },
)
</script>

<template>
  <div class="max-w-[1180px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <h1 class="font-serif text-[26px] font-medium text-text mb-6 tracking-tight">
      Articles {{ searchValue ? `: ${searchValue}` : '' }}
    </h1>
    
    <div class="border-t border-border">
      <Skeleton v-if="loading" :count="5" />
      <TransitionGroup v-else>
        <ArticleITem v-for="article in articles" :key="article?.id" :article="article" />
      </TransitionGroup>
      
      <div v-if="articles.length > 0" class="flex justify-center py-10">
        <Paginator
          :total-items="pagination.total"
          :items-per-page="pagination.size"
          :current-page="pagination.page"
          @change-page="handlePageChange"
          @change-size="handleSizeChange"
        />
      </div>
      <div v-else-if="!loading" class="text-center py-20 text-text-muted">
        Aucun article trouvé.
      </div>
    </div>
  </div>
</template>

<style scoped></style>
