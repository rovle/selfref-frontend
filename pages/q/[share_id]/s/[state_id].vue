<template>
  <div>
    <div v-if="loading" class="flex items-center justify-center min-h-screen">
      <p class="text-neutral-500 dark:text-neutral-400">Loading quiz with your progress...</p>
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
  const stateId = route.params.state_id as string

  try {
    const response = await fetch(`/api/q/${shareId}/s/${stateId}`)

    if (!response.ok) {
      if (response.status === 404) {
        error.value = 'Quiz or saved progress not found'
      } else {
        error.value = 'Failed to load quiz'
      }
      return
    }

    const data = await response.json()

    // Store the state data in sessionStorage to be picked up by create page
    sessionStorage.setItem('loadedState', JSON.stringify(data.user_state))

    // Redirect to create page with the quiz data loaded
    await router.push({
      path: '/create',
      query: {
        load: data.quiz_id,
        share: shareId,
        state: stateId
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