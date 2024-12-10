<template>
    <nav class="flex justify-end space-x-4 mb-8">
        <NuxtLink to="/" class="p-2 text-gray-200 hover:bg-gray-600" aria-label="Home"
            active-class="border-b-2 border-white">
            Home
        </NuxtLink>
        <NuxtLink to="/about" class="p-2 text-gray-200 hover:bg-gray-600" aria-label="About"
            active-class="border-b-2 border-white">
            About
        </NuxtLink>
        <NuxtLink to="https://github.com" target="_blank" rel="noopener noreferrer"
            class="p-2 rounded-md hover:bg-gray-600" aria-label="GitHub">
            <Github class="w-6 h-6 text-gray-200" />
        </NuxtLink>
        <NuxtLink to="https://twitter.com" target="_blank" rel="noopener noreferrer"
            class="p-2 rounded-md hover:bg-gray-600" aria-label="Twitter">
            <Twitter class="w-6 h-6 text-gray-200" />
        </NuxtLink>
    </nav>
</template>

<script setup lang="ts">
import {
    Github,
    Twitter,
} from 'lucide-vue-next';
</script>