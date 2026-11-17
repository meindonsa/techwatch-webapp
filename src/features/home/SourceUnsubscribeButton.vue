<script setup lang="ts">
// Bouton poubelle d'une source. Le parent doit porter la classe `group` : l'icône n'apparaît
// qu'au survol de la ligne (ou au focus clavier), et reste visible sur les écrans sans survol.
defineProps<{
  name: string
  busy?: boolean
}>()
</script>

<template>
  <button
    type="button"
    :disabled="busy"
    :aria-label="`Se désabonner de ${name}`"
    :title="`Se désabonner de ${name}`"
    :class="{ 'opacity-50! cursor-wait': busy }"
    class="w-5 h-5 shrink-0 flex items-center justify-center rounded-sm text-text-faint cursor-pointer transition-all opacity-0 group-hover:opacity-100 focus-visible:opacity-100 [@media(hover:none)]:opacity-100 hover:text-danger hover:bg-danger-soft"
  >
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="w-3.5 h-3.5"
      aria-hidden="true"
    >
      <path d="M3 6h18" />
      <path d="M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
    </svg>
  </button>
</template>
