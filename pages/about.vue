<template>
  <div class="min-h-screen bg-white dark:bg-black">
    <AppNavbar />
    <main class="mx-auto max-w-screen-xl px-4 pt-24">
      <div class="mx-auto max-w-2xl space-y-8">
        <h1
          class="md:text-3xl text-2xl font-bold text-gray-900 dark:text-white"
        >
          About Self-Referential Quizzes
        </h1>

        <div class="space-y-4 text-gray-600 dark:text-gray-400">
          <p>
            Self-referential quizzes are a fascinating type of logic puzzle that
            challenge your ability to reason logically, think recursively, and
            consider the quiz as a whole. Each question refers to the quiz
            itself, making the puzzle a meta-logical challenge. These quizzes
            can be found online, dating back to the early 1990s, with some
            containing as many as 20 questions.
          </p>

          <p>
            Check out the
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
            by Don Woods for examples.
          </p>

          <p>
            This project was created to serve as a benchmark for evaluating
            advanced reasoning capabilities in large language models. This
            website provides a user-friendly interface to interact with the quiz
            generator and solver. It is optimized to create quizzes with
            hundreds of questions in just seconds!
          </p>
        </div>

        <div class="flex justify-center pt-8">
          <NuxtLink
            to="/create"
            class="bg-neutral-900 dark:bg-black dark:bg-white text-gray-100 dark:text-black font-medium uppercase text-sm px-4 py-2 hover:bg-black/90 dark:hover:bg-white/90"
          >
            Try it out
          </NuxtLink>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import AppNavbar from './layout/AppNavbar.vue';
</script>
