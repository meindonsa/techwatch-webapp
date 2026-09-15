<script setup lang="ts">
interface Props {
  label: string
  disabled?: boolean
  severity?: 'primary' | 'secondary' | 'danger'
}
withDefaults(defineProps<Props>(), {
  label: 'Valider',
  disabled: false,
  severity: 'primary'
})

const emit = defineEmits(['onclick'])

const handleClick = () => {
  emit('onclick')
}

const severityClasses = {
  primary: 'bg-accent text-[#1A1006] hover:bg-[#FF8C4D]',
  secondary: 'bg-surface text-text border border-border hover:bg-surface-hover',
  danger: 'bg-transparent text-danger border border-danger hover:bg-danger-soft'
}
</script>

<template>
  <button
    type="button"
    :disabled="disabled"
    :class="[severityClasses[severity], 'transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer font-medium']"
    :style="{
      padding: '9px 16px',
      borderRadius: '8px',
      fontSize: '13px',
      border: severity === 'primary' ? '1px solid transparent' : '1px solid',
    }"
    @click="handleClick"
  >
    {{ label }}
  </button>
</template>

<style scoped></style>
