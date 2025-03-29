<template>
  <div class="min-h-screen py-8 bg-neutral-100 dark:bg-neutral-900">
    <AppNavbar />

    <div class="mt-10">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import AppNavbar from '../components/AppNavbar.vue'
</script>
