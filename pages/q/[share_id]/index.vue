<template>
  <div>
    <div v-if="loading" class="flex items-center justify-center min-h-screen">
      <p class="text-neutral-500 dark:text-neutral-400">Loading quiz...</p>
    </div>
    <div v-else-if="error" class="flex items-center justify-center min-h-screen">
      <div class="text-center">
        <p class="text-red-600 dark:text-red-400 mb-4">{{ error }}</p>
        <NuxtLink
          to="/create"
          class="px-4 py-2 bg-green-500 hover:bg-green-600 text-black rounded"
        >
          Create New Quiz
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const loading = ref(true)
const error = ref('')

onMounted(async () => {
  const shareId = route.params.share_id as string

  if (!shareId) {
    error.value = 'Invalid share link'
    loading.value = false
    return
  }

  try {
    const response = await fetch(`/api/q/${shareId}`)

    if (!response.ok) {
      if (response.status === 404) {
        error.value = 'Quiz not found or expired'
      } else {
        error.value = 'Failed to load quiz'
      }
      return
    }

    const data = await response.json()

    // Redirect to create page with the quiz data loaded
    await router.push({
      path: '/create',
      query: {
        load: data.quiz_id,
        share: shareId
      }
    })
  } catch (err) {
    console.error('Error loading quiz:', err)
    error.value = 'Failed to load quiz'
  } finally {
    loading.value = false
  }
})
</script>