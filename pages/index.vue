<template>
  <div>
    <ul v-if="$device.isDesktop" class="ouroboros">
      <li v-for="n in 48" :key="n"></li>
    </ul>

    <main class="mx-auto max-w-screen-xl px-4 sm:px-8 pt-32">
      <div class="grid md:grid-cols-2 gap-20 items-center">
        <div class="flex flex-col items-center md:items-start">
          <h1
            class="mb-8 text-center md:text-left text-3xl sm:text-5xl font-bold text-gray-800 dark:text-gray-100 z-50 font-display"
          >
            Build recursive logic puzzles in seconds
          </h1>
          <p
            class="mb-8 text-center md:text-left text-black dark:text-white z-50"
          >
            Create, customize, and solve unique self-referential quizzes. Our
            builder generates guaranteed-solvable quizzes for both human
            enjoyment and AI evaluation.
          </p>
          <NuxtLink
            to="/create"
            aria-label="Start generating"
            class="bg-green-500 hover:bg-green-600 text-black rounded-md font-medium px-4 py-2 z-50"
          >
            Start Creating
          </NuxtLink>
        </div>
        <div>
          <img
            src="/images/iPad-PRO-11-self-referential-quiz-builder.png"
            alt="Quiz builder interface"
            class="w-full h-auto hidden dark:block"
          />
          <img
            src="/images/iPad-PRO-11-self-referential-quiz-builder-light.png"
            alt="Quiz builder interface"
            class="w-full h-auto dark:hidden"
          />
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Self-Referential Quiz Builder',
})
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
  top: 45%;
  left: 30%;
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
