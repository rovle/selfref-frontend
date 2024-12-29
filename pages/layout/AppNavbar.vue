<template>
  <header
    class="fixed top-0 w-full border-b border-black/10 dark:border-white/10 bg-white dark:bg-black dark:text-white z-50"
  >
    <nav
      class="mx-auto flex h-14 max-w-screen-xl items-center justify-between px-4"
    >
      <div class="flex items-center gap-8">
        <NuxtLink to="/" aria-label="Home" class="text-sm font-bold">
          LOGO
        </NuxtLink>
        <div class="items-center gap-4 flex">
          <NuxtLink
            to="/create"
            aria-label="Create"
            class="text-sm hover:opacity-70"
            active-class="font-bold cursor-default hover:!opacity-100"
          >
            Create
          </NuxtLink>
          <NuxtLink
            to="/about"
            aria-label="About"
            class="text-sm hover:opacity-70"
            active-class="font-bold cursor-default hover:!opacity-100"
          >
            About
          </NuxtLink>
        </div>
      </div>
      <div class="flex items-center gap-4">
        <NuxtLink
          to="https://github.com/rovle/self-referential-quizzes"
          target="_blank"
          rel="noopener noreferrer"
          class="flex items-center gap-2 text-sm hover:opacity-70"
        >
          <Icon name="mdi:github" class="h-5 w-5" />
          <span class="hidden sm:block">Star on GitHub</span>
        </NuxtLink>
        <button
          @click="toggleColorMode"
          class="flex items-center justify-center p-1 pb-0 transition-colors focus:outline-none rounded-md hover:bg-black/5 hover:dark:bg-white/5"
          aria-label="Toggle color mode"
        >
          <!-- Sun icon for light mode -->
          <span v-if="$colorMode.value === 'light'" class="text-gray-700">
            <Icon name="mdi:white-balance-sunny" class="h-5 w-5" />
          </span>

          <!-- Moon icon for dark mode -->
          <span v-else class="text-gray-200">
            <Icon
              name="material-symbols-light:dark-mode-rounded"
              class="h-5 w-5"
            />
          </span>
        </button>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
const colorMode = useColorMode();

const toggleColorMode = () => {
  if (colorMode.value === 'light') {
    colorMode.preference = 'dark';
  } else {
    colorMode.preference = 'light';
  }
};
</script>
