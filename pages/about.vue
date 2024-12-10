<template>
    <!-- Add a background div that extends to the header's bottom -->
    <div class="relative bg-gray-100">
        <!-- Background layer -->
        <div class="absolute inset-x-0 top-0 bg-gray-900 z-0" style="height: calc(16px + 32px + 8px + 28rem)"></div>

        <!-- Content layer -->
        <div class="relative min-h-screen pt-10 pb-8 px-4 sm:px-6 lg:px-8">
            <div class="max-w-5xl mx-auto">
                <header class="mb-16 text-white">
                    <AppNavbar />

                    <h1 class="md:text-3xl text-2xl font-bold mb-4 text-center">Self-Referential Quiz Builder
                    </h1>
                </header>
                <section class="text-white">
                    <p class="md:text-lg mb-4">
                        Self-referential quizzes are a fascinating type of logic puzzle that challenge your ability to
                        reason logically, think recursively, and consider the quiz as a whole. Each question refers to
                        the
                        quiz itself, making the puzzle a meta-logical challenge. These quizzes can be found online,
                        dating
                        back to the early 1990s, with some containing as many as 20 questions.
                    </p>
                    <p class="mb-6">
                        Check out the <a href="https://faculty.uml.edu/jpropp/srat-Q.txt"
                            class="text-blue-600 underline hover:text-blue-800">Self-Referential Aptitude Test
                            (S.R.A.T.) by
                            James Propp</a> and <a href="https://www.mathpuzzle.com/20questions.htm"
                            class="text-blue-600 underline hover:text-blue-800">Twenty Questions by Don Woods</a> for
                        examples.
                    </p>
                    <div class="bg-blue-200 border-l-4 border-blue-500 text-blue-800 p-4 mb-6" role="alert">
                        <p>
                            <Bot class="w-5 h-5 inline-block" />
                            This project was created to serve as a benchmark for evaluating advanced reasoning
                            capabilities
                            in large language models. This website provides a user-friendly interface to interact with
                            the
                            quiz generator and solver. It is optimized to create quizzes with hundreds of questions in
                            just
                            seconds!
                        </p>
                    </div>
                </section>
            </div>
        </div>
    </div>
</template>

<script setup>
import AppNavbar from './layout/AppNavbar.vue';
import { Bot } from 'lucide-vue-next';
</script>
