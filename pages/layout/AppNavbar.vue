<template>
  <header
    class="fixed top-0 w-full border-b border-black/10 dark:border-white/10 bg-white dark:bg-black dark:text-white z-50"
  >
    <nav
      class="mx-auto flex h-14 max-w-screen-xl items-center justify-between px-4"
    >
      <div class="flex items-center gap-6">
        <NuxtLink to="/" aria-label="Home" class="text-sm font-bold">
          LOGO
        </NuxtLink>
        <div class="hidden items-center gap-4 sm:flex">
          <NuxtLink
            to="/create"
            aria-label="Create"
            class="text-sm hover:opacity-70"
          >
            Create
          </NuxtLink>
          <NuxtLink
            to="/about"
            aria-label="About"
            class="text-sm hover:opacity-70"
          >
            About
          </NuxtLink>
        </div>
      </div>
      <NuxtLink
        to="https://github.com/rovle/self-referential-quizzes"
        target="_blank"
        rel="noopener noreferrer"
        class="flex items-center gap-2 text-sm hover:opacity-70"
      >
        <Github class="h-4 w-4" />
        Star on GitHub
      </NuxtLink>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { Github } from 'lucide-vue-next';
</script>
