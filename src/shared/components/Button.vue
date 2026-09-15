<script setup lang="ts">
interface Props {
  label?: string
  disabled?: boolean
  severity?: 'primary' | 'secondary' | 'danger' | 'outline'
}
withDefaults(defineProps<Props>(), {
  label: '',
  disabled: false,
  severity: 'primary'
})

const emit = defineEmits(['click'])

const severityClasses = {
  primary: 'bg-accent text-[#1A1006] hover:bg-[#FF8C4D]',
  secondary: 'bg-surface text-text border border-border hover:bg-surface-hover',
  danger: 'bg-danger text-white hover:bg-[#D4443E]',
  outline: 'bg-transparent text-text border border-border hover:bg-surface-hover'
}
</script>

<template>
  <button
    type="button"
    :disabled="disabled"
    :class="[severityClasses[severity], 'transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer font-medium rounded-lg px-4 py-2 text-sm']"
    @click="emit('click')"
  >
    <slot>{{ label }}</slot>
  </button>
</template>

<style scoped></style>
