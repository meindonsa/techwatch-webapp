<script setup lang="ts">
import { onBeforeUnmount, watch } from 'vue'
import Button from '@/shared/components/Button.vue'

interface Props {
  open: boolean
  title: string
  message?: string
  confirmLabel?: string
  cancelLabel?: string
  loading?: boolean
  error?: string | null
}
const props = withDefaults(defineProps<Props>(), {
  message: '',
  confirmLabel: 'Confirmer',
  cancelLabel: 'Annuler',
  loading: false,
  error: null,
})

const emit = defineEmits<{ confirm: []; cancel: [] }>()

const onKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') emit('cancel')
}

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) window.addEventListener('keydown', onKeydown)
    else window.removeEventListener('keydown', onKeydown)
  },
  { immediate: true },
)

onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
      @click.self="emit('cancel')"
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        class="w-full max-w-[400px] rounded-xl border border-border bg-surface p-6 shadow-2xl"
      >
        <h2 id="confirm-dialog-title" class="font-serif text-lg font-medium text-text">
          {{ title }}
        </h2>
        <p v-if="message" class="mt-2 text-[13.5px] leading-relaxed text-text-muted">
          {{ message }}
        </p>
        <p v-if="error" class="mt-3 text-xs text-danger">{{ error }}</p>

        <div class="mt-6 flex justify-end gap-2">
          <Button
            :label="cancelLabel"
            severity="outline"
            :disabled="loading"
            @click="emit('cancel')"
          />
          <Button
            :label="loading ? 'Patiente…' : confirmLabel"
            severity="danger"
            :disabled="loading"
            @click="emit('confirm')"
          />
        </div>
      </div>
    </div>
  </Teleport>
</template>
