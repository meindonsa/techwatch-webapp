<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { SourceService, type Feed } from '@/shared/api/SourceService.ts'
import SourceForm from '@/features/home/SourceForm.vue'
import { isUrl } from '@/shared/service/Utils.ts'
import SourceUnsubscribeButton from '@/features/home/SourceUnsubscribeButton.vue'
import ConfirmDialog from '@/shared/components/ConfirmDialog.vue'

interface Props {
  mode?: 'rail' | 'strip'
}
withDefaults(defineProps<Props>(), {
  mode: 'rail'
})

const emit = defineEmits<{ unsubscribed: [feedId: number] }>()

const loading = ref(false)
const errorMessage = ref<null | string>(null)
const showSource = ref(false)
const sources = ref<Feed[]>([])

const pendingSource = ref<Feed | null>(null)
const unsubscribing = ref(false)
const unsubscribeError = ref<null | string>(null)

const askUnsubscribe = (source: Feed) => {
  unsubscribeError.value = null
  pendingSource.value = source
}

const cancelUnsubscribe = () => {
  if (unsubscribing.value) return
  pendingSource.value = null
}

const confirmUnsubscribe = async () => {
  const source = pendingSource.value
  if (!source || unsubscribing.value) return

  unsubscribing.value = true
  unsubscribeError.value = null
  try {
    await SourceService.unsubscribeUserFromFeed(source.id)
    sources.value = sources.value.filter((s) => s.id !== source.id)
    pendingSource.value = null
    emit('unsubscribed', source.id)
  } catch (e: any) {
    unsubscribeError.value =
      e?.response?.data?.error || e?.response?.data?.message || 'Erreur lors du désabonnement'
  } finally {
    unsubscribing.value = false
  }
}

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

const toggleForm = () => {
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
      toggleForm();
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
  <!-- MODE STRIP (Mobile: horizontal scroll above feed) -->
  <div v-if="mode === 'strip'" class="flex gap-2 overflow-x-auto pb-4 no-scrollbar">
    <div 
      v-for="source of sources" 
      :key="source.id" 
      class="group flex items-center gap-1.5 bg-surface border border-border px-3 py-1.5 rounded-full text-[12.5px] text-text-muted whitespace-nowrap cursor-pointer hover:text-text transition-colors"
    >
      <span class="w-1.5 h-1.5 rounded-full bg-new shrink-0"></span>
      <RouterLink :to="'/feed/' + source.id" class="hover:underline">{{ source.name }}</RouterLink>
      <SourceUnsubscribeButton :name="source.name" @click="askUnsubscribe(source)" />
    </div>
    <div 
      @click="toggleForm"
      class="flex items-center gap-1.5 bg-surface border border-dashed border-border px-3 py-1.5 rounded-full text-[12.5px] text-accent whitespace-nowrap cursor-pointer hover:border-accent transition-colors"
    >
      <span>+ Ajouter une source</span>
    </div>
  </div>

  <!-- MODE RAIL (Desktop: fixed side column) -->
  <aside v-else class="sticky top-24">
    <div class="flex items-center justify-between mb-3">
      <h2 class="text-sm font-semibold text-text-muted">Sources</h2>
      <div 
        @click="toggleForm"
        class="w-5 h-5 rounded-sm bg-surface border border-border text-text-muted flex items-center justify-center cursor-pointer hover:border-accent hover:text-accent transition-colors text-sm"
      >
        +
      </div>
    </div>
    
    <div v-if="showSource" class="mb-4">
      <SourceForm @onCancel="toggleForm" @onSave="onSubmit($event)" />
    </div>

    <div v-else class="flex flex-col">
      <div 
        v-for="source of sources" 
        :key="source.id" 
        class="group flex items-center justify-between py-2 border-b border-border last:border-0 text-sm text-text hover:text-accent transition-colors cursor-pointer"
      >
        <RouterLink :to="'/feed/' + source.id" class="flex items-center gap-2 truncate">
          <span class="w-1.5 h-1.5 rounded-full bg-new shrink-0"></span>
          <span class="truncate">{{ source.name }}</span>
        </RouterLink>
        <div class="flex items-center gap-1 ml-2 shrink-0">
          <SourceUnsubscribeButton :name="source.name" @click="askUnsubscribe(source)" />
          <span class="text-[11.5px] text-text-faint">{{ source.article_count || 0 }}</span>
        </div>
      </div>
    </div>

    <div v-if="errorMessage" class="text-red-400 text-xs mt-2 text-center">
      {{ errorMessage }}
    </div>
  </aside>

  <ConfirmDialog
    :open="pendingSource !== null"
    title="Se désabonner de cette source ?"
    :message="`Tu ne recevras plus les articles de « ${pendingSource?.name ?? ''} ». Cette action est définitive : pour suivre à nouveau cette source, il faudra la rajouter.`"
    confirm-label="Se désabonner"
    :loading="unsubscribing"
    :error="unsubscribeError"
    @confirm="confirmUnsubscribe"
    @cancel="cancelUnsubscribe"
  />
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
