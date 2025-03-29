<template>
  <header
    class="absolute top-0 w-full bg-neutral-100 dark:bg-neutral-900 dark:text-white z-50"
  >
    <div class="flex justify-center px-4 pt-6 sm:hidden">
      <NuxtLink to="/" aria-label="Home" class="font-bold">
        Self-Referential Quiz Builder
      </NuxtLink>
    </div>
    <nav
      class="mx-auto flex h-20 max-w-screen-xl items-center justify-center sm:justify-between px-4"
    >
      <div class="flex items-center gap-4 sm:gap-16">
        <NuxtLink to="/" aria-label="Home" class="hidden sm:block font-bold">
          Self-Referential Quiz Builder
        </NuxtLink>
      </div>
      <div class="flex items-center gap-4 sm:gap-12">
        <div class="flex items-center gap-4 sm:gap-8">
          <NuxtLink
            to="/about"
            aria-label="About"
            class="xs:text-sm sm:text-md hover:opacity-70"
            active-class="font-bold cursor-default hover:!opacity-100"
          >
            About
          </NuxtLink>
          <NuxtLink
            to="/create"
            aria-label="Create"
            class="xs:text-sm sm:text-md px-4 py-2 rounded-md dark:bg-white dark:text-black bg-black text-white hover:opacity-90 transition-opacity"
            active-class="cursor-default hover:!opacity-100"
          >
            Create
          </NuxtLink>
        </div>
        <div class="flex items-center gap-2 sm:gap-6">
          <NuxtLink
            to="https://github.com/rovle/self-referential-quizzes"
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center justify-center p-1 transition-colors focus:outline-none rounded-md hover:bg-black/5 hover:dark:bg-white/5 text-neutral-800 dark:text-neutral-100"
          >
            <Icon name="mdi:github" class="h-7 w-7" />
          </NuxtLink>
          <button
            @click="toggleColorMode"
            class="flex items-center justify-center p-1 pb-0 transition-colors focus:outline-none rounded-md hover:bg-black/5 hover:dark:bg-white/5"
            aria-label="Toggle color mode"
          >
            <!-- Sun icon for light mode -->
            <span v-if="$colorMode.value === 'light'" class="text-neutral-800">
              <Icon name="mdi:white-balance-sunny" class="h-7 w-7" />
            </span>

            <!-- Moon icon for dark mode -->
            <span v-else class="text-neutral-200">
              <Icon
                name="material-symbols-light:dark-mode-rounded"
                class="h-7 w-7"
              />
            </span>
          </button>
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
const colorMode = useColorMode()

const toggleColorMode = () => {
  if (colorMode.value === 'light') {
    colorMode.preference = 'dark'
  } else {
    colorMode.preference = 'light'
  }
}
</script>
