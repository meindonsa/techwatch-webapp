<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { SourceService, type Feed } from '@/shared/api/SourceService.ts'
import SourceForm from '@/features/home/SourceForm.vue'
import { isUrl } from '@/shared/service/Utils.ts'

interface Props {
  mode?: 'rail' | 'strip'
}
withDefaults(defineProps<Props>(), {
  mode: 'rail'
})

const loading = ref(false)
const errorMessage = ref<null | string>(null)
const showSource = ref(false)
const sources = ref<Feed[]>([])

const retrieveSources = async () => {
  loading.value = true
  try {
    const { data } = await SourceService.retrieveSources()
    if (data) sources.value = data
  } catch (e: any) {
    console.error('Erreur lors de la récupération des sources :', e)
  } finally {
    loading.value = false
  }
}

const hideForm = () => {
  showSource.value = !showSource.value
}

const onSubmit = (event: any) => {
  const req = event
  if (!isUrl(req?.url)) {
    errorMessage.value = 'Url invalid !'
    setTimeout(() => {
      errorMessage.value = null
    }, 2000)
    return
  }
  loading.value = true

  SourceService.createSource(req)
    .then((data) => {
      hideForm();
      retrieveSources()
    })
    .catch((error) => {
      errorMessage.value = error?.response?.data?.message || 'Erreur lors de la création'
      setTimeout(() => {
        errorMessage.value = null;
      }, 2000)
    })
    .finally(() => {
      loading.value = false;
    })
}

onMounted(() => {
  retrieveSources()
})
</script>

<template>
  <!-- MODE STRIP (Mobile) -->
  <div v-if="mode === 'strip'" class="flex gap-2 overflow-x-auto pb-4 no-scrollbar">
    <div 
      v-for="source of sources" 
      :key="source.id" 
      class="flex items-center gap-1.5 bg-surface border border-border px-3 py-1.5 rounded-full text-[12.5px] text-text-muted whitespace-nowrap cursor-pointer hover:text-text transition-colors"
    >
      <span class="w-1.5 h-1.5 rounded-full bg-new shrink-0"></span>
      <RouterLink :to="'/feed/' + source.id" class="hover:underline">{{ source.name }}</RouterLink>
    </div>
    <div 
      @click="showSource = true"
      class="flex items-center gap-1.5 bg-surface border border-dashed border-border px-3 py-1.5 rounded-full text-[12.5px] text-accent whitespace-nowrap cursor-pointer hover:border-accent transition-colors"
    >
      <span>+ Ajouter une source</span>
    </div>
  </div>

  <!-- MODE RAIL (Desktop) -->
  <aside v-else class="sticky top-24">
    <div class="flex items-center justify-between mb-3">
      <h2 class="text-sm font-semibold text-text-muted">Sources</h2>
      <div 
        @click="showSource = true"
        class="w-5 h-5 rounded-sm bg-surface border border-border text-text-muted flex items-center justify-center cursor-pointer hover:border-accent hover:text-accent transition-colors text-sm"
      >
        +
      </div>
    </div>
    
    <div v-if="showSource" class="mb-4">
      <SourceForm @onCancel="hideForm" @onSave="onSubmit($event)" />
    </div>

    <div v-else class="flex flex-col">
      <div 
        v-for="source of sources" 
        :key="source.id" 
        class="flex items-center justify-between py-2 border-b border-border last:border-0 text-sm text-text hover:text-accent transition-colors cursor-pointer"
      >
        <RouterLink :to="'/feed/' + source.id" class="flex items-center gap-2 truncate">
          <span class="w-1.5 h-1.5 rounded-full bg-new shrink-0"></span>
          <span class="truncate">{{ source.name }}</span>
        </RouterLink>
        <span class="text-[11.5px] text-text-faint ml-2">{{ source.article_count || 0 }}</span>
      </div>
    </div>

    <div v-if="errorMessage" class="text-red-400 text-xs mt-2 text-center">
      {{ errorMessage }}
    </div>
  </aside>
</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
