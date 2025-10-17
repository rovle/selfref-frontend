<template>
  <main class="mx-auto max-w-screen-xl px-4 pt-20 sm:pt-24">
    <div class="mx-auto max-w-2xl space-y-8">
      <h1
        class="md:text-4xl text-3xl font-display font-bold text-black dark:text-white"
      >
        About
      </h1>

      <div class="space-y-4 text-black dark:text-white">
        <p>
	  Inspired by Jim Propp's
	  <NuxtLink
            to="https://faculty.uml.edu/jpropp/srat-Q.txt"
            class="underline underline-offset-4 hover:opacity-70"
            target="_blank"
            rel="noopener noreferrer"
          >
            Self-Referential Aptitude Test (S.R.A.T.)</NuxtLink>,
	  this websites hosts a generator of self-referential quizzes,
	as well as an interface for (trying to) solve them.
        </p>
      </div>

      <div class="flex justify-center pt-8">
        <NuxtLink
          to="/create"
          class="bg-black dark:bg-white rounded-md text-white dark:text-black font-medium text-sm px-4 py-2 hover:bg-black/90 dark:hover:bg-white/90"
        >
          Try it out
        </NuxtLink>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
useSeoMeta({
  title: 'About Self-Referential Quizzes Builder - History and Motivation'
})
</script>
