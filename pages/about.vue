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
          Self-referential quizzes are a fascinating type of logic puzzle, where
          each question refers to the properties of the entire quiz, demanding
          recursive thinking and a meta-logical approach to solve. They
          challenge your ability to reason about a system while being part of
          it.
        </p>

        <p>
          These captivating puzzles date back to the early 1990s, with some
          containing as many as 20 questions. Check out the
          <NuxtLink
            to="https://faculty.uml.edu/jpropp/srat-Q.txt"
            class="underline underline-offset-4 hover:opacity-70"
            target="_blank"
            rel="noopener noreferrer"
          >
            Self-Referential Aptitude Test (S.R.A.T.)
          </NuxtLink>
          by James Propp and
          <NuxtLink
            to="https://www.mathpuzzle.com/20questions.htm"
            class="underline underline-offset-4 hover:opacity-70"
            target="_blank"
            rel="noopener noreferrer"
          >
            Twenty Questions
          </NuxtLink>
          by Don Woods for well-known examples.
        </p>

        <p>
          Our builder brings this concept into a powerful, modern tool. This
          project was specifically created to serve as a benchmark for
          evaluating advanced reasoning capabilities of large language models
          (LLMs). The inherent recursion, meta-logic and scalability (e.g.
          hundreds of questions) of self-referential quizzes make them ideal for
          such a purpose.
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
