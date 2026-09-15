<script setup lang="ts">
import { RouterView } from 'vue-router'
import Navbar from '@/shared/components/Navbar.vue'
import Footer from '@/shared/components/Footer.vue'
</script>

<template>
  <div class="min-h-screen flex flex-col bg-bg">
    <Navbar />
    <main class="flex-grow pt-20">
      <RouterView />
    </main>
    <Footer />
  </div>
</template>

<style scoped></style>
