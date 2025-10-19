<template>
  <Transition name="modal">
    <div v-if="show" class="modal-overlay" @click.self="$emit('close')">
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="text-xl font-bold text-neutral-900 dark:text-neutral-100">
            Share / Save Your Progress
          </h2>
          <button
            @click="$emit('close')"
            class="p-1 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded"
          >
            <Icon name="mdi:close" size="24" />
          </button>
        </div>

        <div class="modal-body space-y-6">
          <!-- Loading state -->
          <div v-if="loading" class="text-center py-8">
            <p class="text-neutral-500 dark:text-neutral-400">Saving your quiz...</p>
          </div>

          <!-- Error state -->
          <div v-else-if="error" class="bg-red-100 dark:bg-red-900/30 p-4 rounded">
            <p class="text-red-800 dark:text-red-200">{{ error }}</p>
            <button
              @click="saveQuiz"
              class="mt-2 px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded"
            >
              Try Again
            </button>
          </div>

          <!-- Success state with links -->
          <div v-else-if="quizLink && progressLink" class="space-y-6">
            <!-- Quiz link -->
            <div>
              <label class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Share this quiz (fresh start):
              </label>
              <div class="flex gap-2">
                <input
                  :value="quizLink"
                  readonly
                  class="flex-1 px-3 py-2 bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 rounded border border-neutral-300 dark:border-neutral-600"
                  @click="selectText"
                />
                <button
                  @click="copyLink(quizLink, 'quiz')"
                  class="px-4 py-2 bg-green-500 hover:bg-green-600 text-black rounded flex items-center gap-2"
                >
                  <Icon name="mdi:content-copy" size="20" />
                  {{ copiedQuiz ? 'Copied!' : 'Copy' }}
                </button>
              </div>
            </div>

            <!-- Progress link -->
            <div>
              <label class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Resume with your progress:
              </label>
              <div class="flex gap-2">
                <input
                  :value="progressLink"
                  readonly
                  class="flex-1 px-3 py-2 bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 rounded border border-neutral-300 dark:border-neutral-600"
                  @click="selectText"
                />
                <button
                  @click="copyLink(progressLink, 'progress')"
                  class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded flex items-center gap-2"
                >
                  <Icon name="mdi:content-copy" size="20" />
                  {{ copiedProgress ? 'Copied!' : 'Copy' }}
                </button>
              </div>
            </div>

            <div class="p-3 bg-amber-100 dark:bg-amber-900/30 border border-amber-300 dark:border-amber-700 rounded">
              <p class="text-sm font-medium text-amber-900 dark:text-amber-100">
                📝 Note: Save the progress link to continue where you left off. This link captures your <strong>current</strong> progress - save again after marking more options for a link to the new state.
              </p>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button
            @click="$emit('close')"
            class="px-4 py-2 bg-neutral-900 dark:bg-white text-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90 rounded"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  show: boolean
  quizId: string | null
  answers: Record<number, string[]>
  completed: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

const loading = ref(false)
const error = ref('')
const quizLink = ref('')
const progressLink = ref('')
const copiedQuiz = ref(false)
const copiedProgress = ref(false)

// Save quiz when modal opens
watch(() => props.show, (newVal) => {
  if (newVal && props.quizId) {
    saveQuiz()
  }
})

const saveQuiz = async () => {
  if (!props.quizId) return

  loading.value = true
  error.value = ''
  quizLink.value = ''
  progressLink.value = ''

  try {
    const response = await fetch(`/api/quizzes/${props.quizId}/save`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        answers: props.answers,
        completed: props.completed
      })
    })

    if (!response.ok) {
      throw new Error('Failed to save quiz')
    }

    const data = await response.json()
    quizLink.value = data.quiz_link
    progressLink.value = data.progress_link
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'An error occurred'
  } finally {
    loading.value = false
  }
}

const selectText = (event: Event) => {
  const input = event.target as HTMLInputElement
  input.select()
}

const copyLink = async (link: string, type: 'quiz' | 'progress') => {
  try {
    await navigator.clipboard.writeText(link)

    if (type === 'quiz') {
      copiedQuiz.value = true
      setTimeout(() => {
        copiedQuiz.value = false
      }, 2000)
    } else {
      copiedProgress.value = true
      setTimeout(() => {
        copiedProgress.value = false
      }, 2000)
    }
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
}

.modal-content {
  @apply bg-white dark:bg-neutral-900 rounded-lg shadow-xl;
  max-width: 600px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  @apply flex justify-between items-center p-6 border-b dark:border-neutral-700;
}

.modal-body {
  @apply p-6;
}

.modal-footer {
  @apply flex justify-end p-6 border-t dark:border-neutral-700;
}

/* Transition */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal-content,
.modal-leave-active .modal-content {
  transition: transform 0.3s ease;
}

.modal-enter-from .modal-content,
.modal-leave-to .modal-content {
  transform: scale(0.9);
}
</style>