<script setup lang="ts">
import { useFilterStore } from '@/core/stores/filter.ts'
import { useArticleStore } from '@/core/stores/article.ts'
import ArticleITem from '@/features/home/ArticleITem.vue'
import Sources from '@/features/home/Sources.vue'
import { computed, ref, watch, watchEffect } from 'vue'
import { ArticleService, type Article } from '@/shared/api/ArticleService.ts'
import Button from '@/shared/components/Button.vue'
import { useRouter } from 'vue-router'
import Skeleton from '@/shared/components/Skeleton.vue'

const router = useRouter()
const articleStore = useArticleStore()
const useFilter = useFilterStore()
const searchValue = computed(() => useFilter.searchValue)
const articles = computed(() => articleStore.articles)
const loading = computed(() => articleStore.loading)
const pagination = ref({
  total: 0,
  page: 0,
  size: 5,
})

const retrieveArticles = async (pageIndex = 0, searchKey: null | string = null) => {
  const { total } = await articleStore.fetchArticles(pageIndex, pagination.value.size, searchKey)
  pagination.value.total = total
  pagination.value.page = pageIndex
}

watchEffect(() => {
  retrieveArticles(0, searchValue.value)
})

const seeAll = () => {
  router.push('/articles')
}
</script>

<template>
  <div class="max-w-[1180px] mx-auto px-4 sm:px-6 lg:px-8">
    <!-- Sources Strip: Visible ONLY on mobile, placed ABOVE the page grid -->
    <div class="md:hidden mb-8">
      <Sources mode="strip" />
    </div>

    <div class="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
      <!-- Main Feed -->
      <main class="md:col-span-8 lg:col-span-9">
        <h1 class="font-serif text-[26px] font-medium text-text mb-6 tracking-tight">
          Accueil {{ searchValue ? `: ${searchValue}` : '' }}
        </h1>

        <div class="border-t border-border">
          <Skeleton v-if="loading" :count="5" />
          <TransitionGroup v-else>
            <ArticleITem v-for="article in articles" :key="article?.id" :article="article" />
          </TransitionGroup>

          <div v-if="articles.length > 0" class="text-center py-8">
            <Button label="Tout voir" @click="seeAll" severity="secondary" />
          </div>
          <div v-else-if="!loading" class="text-center py-20 text-text-muted">
            Aucun article trouvé.
          </div>
        </div>
      </main>

      <!-- Desktop Sources Rail -->
      <aside class="hidden md:block md:col-span-4 lg:col-span-3">
        <Sources mode="rail" />
      </aside>
    </div>
  </div>
</template>

<style scoped></style>
