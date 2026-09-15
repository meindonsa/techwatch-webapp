<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { SourceService, type Feed } from '@/shared/api/SourceService.ts'
import SourceForm from '@/features/home/SourceForm.vue'
import { isUrl } from '@/shared/service/Utils.ts'

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
  <div
    class="w-full max-w-sm p-6 bg-neutral-primary-soft border border-gray-500 rounded-base shadow-xs"
  >
    <h5
      class="flex justify-between mb-4 text-xl font-semibold leading-none text-heading text-white"
    >
      <span>Sources</span>
      <span class="cursor-pointer" @click="hideForm">+</span>
    </h5>
    <Transition>
      <span v-if="errorMessage != null" class="text-red-500 text-sm font-light">{{
        errorMessage
      }}</span>
    </Transition>
    <div class="flow-root mt-3">
      <SourceForm v-if="showSource" @onCancel="hideForm" @onSave="onSubmit($event)" />
      <div class="text-center text-gray-700" v-if="loading">Chargement ...</div>
      <TransitionGroup
        v-if="!showSource"
        tag="ul"
        mode="easy-in-out"
        role="list"
        class="divide-default text-gray-300"
      >
        <li
          v-for="source of sources"
          :key="source?.id"
          class="text-sm text-body truncate mb-2 hover:text-indigo-500 transition ease-in-out duration-300"
        >
          <a
            :href="source?.feed_url"
            target="_blank"
            class="cursor-pointer hover:underline hover:underline-offset-4"
          >
            {{ source?.name }}
          </a>
        </li>
      </TransitionGroup>
    </div>
  </div>
</template>

<style scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
