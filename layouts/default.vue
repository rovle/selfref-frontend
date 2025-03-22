<template>
  <div class="min-h-screen py-8 bg-neutral-100 dark:bg-neutral-900 relative">
    <AppNavbar />

    <div class="mt-10 slot-container">
      <slot />
    </div>

    <div class="flex-grow-1"></div>
  </div>
</template>

<script setup lang="ts">
import AppNavbar from '../components/AppNavbar.vue'
</script>

<style scoped>
.slot-container {
  contain: paint;
}
</style>
