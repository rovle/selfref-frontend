<template>
  <div class="min-h-screen bg-white dark:bg-black relative">
    <AppNavbar />

    <ul class="ouroboros">
      <li v-for="n in 48" :key="n"></li>
    </ul>

    <main
      class="mx-auto flex max-w-screen-xl flex-col items-center justify-center px-4 pt-32"
    >
      <h1
        class="mb-4 text-center text-4xl font-bold tracking-tight text-gray-800 dark:text-gray-100 z-50"
      >
        Self-Referential Quiz Builder
      </h1>
      <p
        class="mb-8 max-w-2xl text-center text-gray-600 dark:text-gray-400 z-50"
      >
        Create, customize, and solve unique self-referential quizzes that
        challenge your logical reasoning abilities.
      </p>
      <NuxtLink
        to="/create"
        aria-label="Start generating"
        class="bg-green-500 hover:bg-green-600 text-black font-medium uppercase px-4 py-2 z-50"
      >
        Start creating
      </NuxtLink>
      <section class="mt-28 grid gap-12 p-6 border dark:border-white/20">
        <div class="max-w-2xl space-y-6">
          <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-100">
            How it works
          </h2>
          <ul
            class="list-inside list-disc space-y-2 text-gray-600 dark:text-gray-400"
          >
            <li>
              Start by choosing a difficulty level or creating a custom quiz.
            </li>
            <li>
              Each question refers to the quiz itself, making it a meta-logical
              challenge.
            </li>
            <li>
              Click on the buttons to the left of each option to mark them as
              correct or incorrect.
            </li>
            <li>
              Each question has only one correct answer. Solve the quiz by
              selecting the correct answer for each question.
            </li>
          </ul>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import AppNavbar from './layout/AppNavbar.vue';
</script>

<style scoped lang="scss">
@use 'sass:math';

$dim: 240px;

ul.ouroboros {
  margin: 0;
  padding: 0;
  list-style: none;
  display: block;
  height: $dim;
  width: $dim;
  position: absolute;
  top: 26%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 0;
  opacity: 0.3;
}

.ouroboros li {
  position: absolute;
  height: $dim;
  width: $dim;
  border-right: 1px solid #808080;
  border-radius: math.div($dim, 4);
  opacity: 0.5;
}

@for $i from 1 through 48 {
  .ouroboros li:nth-child(#{$i}) {
    transform: rotate(#{$i * 7.5}deg);
    animation: fade 2s math.div($i, 24) * 1s infinite linear;
  }
}

@keyframes fade {
  0% {
    opacity: 0;
    border-color: #696969;
  }
  25% {
    opacity: 0.2;
    border-color: #777777;
  }
  50% {
    opacity: 1;
    border-color: #00dd5c;
  }
  75% {
    opacity: 0.2;
    border-color: #777;
  }
  100% {
    opacity: 0;
    border-color: #696969;
  }
}
</style>
