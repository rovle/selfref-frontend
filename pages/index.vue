<template>
  <main
    class="mx-auto max-w-screen-2xl px-4 sm:px-8 pt-20 pb-8 lg:min-h-screen lg:flex lg:items-center lg:-mt-20 overflow-x-hidden">
    <div
      class="grid grid-cols-1 lg:grid-cols-7 gap-8 lg:gap-12 items-center justify-items-center lg:justify-items-start">
      <div
        class="flex flex-col items-center lg:items-start relative w-full md:w-auto md:max-w-2xl lg:max-w-lg lg:col-span-3">
        <ul class="ouroboros absolute">
          <li v-for="n in $device.isDesktop ? 24 : 12" :key="n"></li>
        </ul>
        <h1
          class="mb-8 text-center lg:text-left text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral-800 dark:text-neutral-100 z-50 font-display">
          <span class="block">Build and Solve Self-Refential Quizzes</span>
        </h1>
        <p class="mb-8 text-center lg:text-left text-black dark:text-white z-50">
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
        <div class="flex gap-4 z-50">
          <NuxtLink to="/create" aria-label="Start generating"
            class="bg-green-500 hover:bg-green-600 text-black rounded-md font-medium px-4 py-2">
            Start Creating
          </NuxtLink>
        </div>
      </div>

      <div class="shadow-md shadow-neutral-400/70 dark:shadow-neutral-950/80 lg:col-span-4 w-full">
        <NuxtImg src="/images/self-referential-quiz-builder-dark.png" alt="Quiz builder interface"
          class="w-full h-auto hidden dark:block" loading="eager" width="1280" height="847" />
        <NuxtImg src="/images/self-referential-quiz-builder-light.png" alt="Quiz builder interface"
          class="w-full h-auto dark:hidden" loading="eager" width="1280" height="847" />
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
useSeoMeta({
  title: 'Self-Referential Quiz Builder',
  description: 'Create, customize, and solve self-referential quizzes.',
  ogTitle: 'Self-Referential Quiz Builder',
  ogDescription: 'Create, customize, and solve self-referential quizzes.',
  ogImage: '/images/self-referential-quiz-builder-dark.png',
  twitterTitle: 'Self-Referential Quiz Builder',
  twitterDescription: 'Create, customize, and solve self-referential quizzes.',
  twitterImage: '/images/self-referential-quiz-builder-dark.png',
  twitterCard: 'summary'
})
</script>

<style scoped lang="scss">
@use 'sass:math';

$dim: 300px;

ul.ouroboros {
  margin: 0;
  padding: 0;
  list-style: none;
  display: block;
  --dim: min(300px, 80vw);
  height: var(--dim);
  width: var(--dim);
  position: absolute;
  top: 60%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 0;
  opacity: 0.3;
  will-change: transform;
  pointer-events: none;

  @media (min-width: 768px) {
    --dim: 300px;
    left: 50%;
    top: 30%;
  }

  @media (min-width: 640px) {
    --dim: 300px;
    left: 50%;
    top: 35%;
  }
}

.ouroboros li {
  position: absolute;
  height: $dim;
  width: $dim;
  border-right: 1px solid #808080;
  border-radius: math.div($dim, 4);
  opacity: 0.5;
  transform: translateZ(0);
  backface-visibility: hidden;
  perspective: 1000px;
}

@for $i from 1 through 24 {
  .ouroboros li:nth-child(#{$i}) {
    transform: rotate(#{$i * 15}deg) translateZ(0);
    animation: fade 3s math.div($i, 12) * 1s infinite ease-in-out;
  }
}

@keyframes fade {

  0%,
  100% {
    opacity: 0;
    border-color: #525252; // neutral-600
  }

  25%,
  75% {
    opacity: 0.2;
    border-color: #6b7280; // neutral-500
  }

  50% {
    opacity: 1;
    border-color: #22c55e; // green-500
  }
}
</style>
