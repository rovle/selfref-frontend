<template>
  <main
    class="mx-auto max-w-screen-xl px-4 sm:px-8 pt-20 md:min-h-[calc(100vh-4rem)] md:flex md:items-center md:-mt-20"
  >
    <div class="grid md:grid-cols-2 gap-14 items-center">
      <div class="flex flex-col items-center md:items-start relative">
        <ul class="ouroboros absolute">
          <li v-for="n in $device.isDesktop ? 24 : 12" :key="n"></li>
        </ul>
        <h1
          class="mb-8 text-center md:text-left text-3xl sm:text-5xl font-bold text-neutral-800 dark:text-neutral-100 z-50 font-display"
        >
          Build recursive logic puzzles in seconds
        </h1>
        <p
          class="mb-8 text-center md:text-left text-black dark:text-white z-50"
        >
          Create, customize, and solve unique self-referential quizzes. Our
          builder generates guaranteed-solvable quizzes for both human enjoyment
          and AI evaluation.
        </p>
        <div class="flex gap-4 z-50">
          <NuxtLink
            to="/create"
            aria-label="Start generating"
            class="bg-green-500 hover:bg-green-600 text-black rounded-md font-medium px-4 py-2"
          >
            Start Creating
          </NuxtLink>
          <NuxtLink
            to="/about"
            aria-label="Learn more"
            class="bg-neutral-100 dark:bg-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-800 dark:text-neutral-200 border-2 border-neutral-700 dark:border-neutral-400 rounded-md font-medium px-4 py-2"
          >
            Learn more
          </NuxtLink>
        </div>
      </div>

      <div class="shadow-md shadow-neutral-400/70 dark:shadow-neutral-950/80">
        <NuxtImg
          src="/images/self-referential-quiz-builder-dark.png"
          alt="Quiz builder interface"
          class="w-full h-auto hidden dark:block"
        />
        <NuxtImg
          src="/images/self-referential-quiz-builder-light.png"
          alt="Quiz builder interface"
          class="w-full h-auto dark:hidden"
        />
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
useHead({
  title: 'Self-Referential Quiz Builder',
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
  height: $dim;
  width: $dim;
  position: absolute;
  top: 60%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 0;
  opacity: 0.3;
  will-change: transform;

  @media (min-width: 768px) {
    left: 40%;
    top: 50%;
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
