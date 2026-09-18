<script setup lang="ts">
import { computed, ref } from 'vue'
import { hasInvalidString } from '@/shared/service/Utils.ts'
import Button from '@/shared/components/Button.vue'

const emit = defineEmits(['onCancel', 'onSave'])
const form = ref({
  name: '',
  url: '',
})

const isValid = computed(() => {
  return hasInvalidString(form.value.name, form.value.url)
})

const onCancel = () => {
  emit('onCancel')
}

const onclick = () => {
  emit("onSave", form.value)
}
</script>

<template>
  <input
    type="text"
    v-model="form.name"
    class="w-full px-3 py-2 mb-5 border border-white text-heading text-sm rounded-sm placeholder:text-gray-500 text-white"
    placeholder="Nom de la source"
  />

  <input
    type="text"
    v-model="form.url"
    class="w-full px-3 py-2 mb-5 border border-white text-heading text-sm rounded-sm placeholder:text-gray-500 text-white"
    placeholder="Url de la source"
  />
  <div class="w-full flex justify-between">
    <Button label="Annuler" @click="onCancel" severity="secondary" />
    <Button label="Enregister" @click="onclick" :disabled="isValid" severity="primary" />
  </div>
</template>

<style scoped></style>
