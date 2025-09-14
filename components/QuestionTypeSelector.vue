<template>
  <div class="space-y-4">
    <!-- Controls -->
    <div class="flex flex-wrap gap-2 mb-4">
      <button
        @click="enableAll"
        class="px-3 py-1 text-sm bg-green-500 hover:bg-green-600 text-black rounded-md"
      >
        Enable All
      </button>
      <button
        @click="disableAll"
        class="px-3 py-1 text-sm bg-red-500 hover:bg-red-600 text-white rounded-md"
      >
        Disable All
      </button>
      <button
        @click="randomizeWeights"
        class="px-3 py-1 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-md"
      >
        Randomize Weights
      </button>
    </div>

    <!-- Question Types List -->
    <div class="space-y-3 max-h-96 overflow-y-auto">
      <div
        v-for="qType in questionTypes"
        :key="qType.name"
        class="border border-neutral-200 dark:border-neutral-700 rounded-md p-3"
      >
        <div class="flex items-start gap-3">
          <!-- Checkbox -->
          <input
            type="checkbox"
            :id="`qt-${qType.name}`"
            :checked="config.question_types[qType.name]?.enabled"
            @change="$emit('toggle', qType.name)"
            class="mt-1 w-4 h-4 text-green-600 rounded border-neutral-300 focus:ring-green-500"
          />

          <!-- Content -->
          <div class="flex-1 space-y-2">
            <label
              :for="`qt-${qType.name}`"
              class="block text-sm font-medium text-neutral-900 dark:text-neutral-100 cursor-pointer"
            >
              {{ qType.display_name }}
            </label>

            <!-- Weight Slider (only show if enabled) -->
            <div v-if="config.question_types[qType.name]?.enabled" class="space-y-2">
              <div class="flex items-center gap-2">
                <label class="text-xs text-neutral-600 dark:text-neutral-400">
                  Weight:
                </label>
                <input
                  type="range"
                  min="0.1"
                  max="10"
                  step="0.1"
                  :value="config.question_types[qType.name].weight"
                  @input="$emit('updateWeight', qType.name, parseFloat($event.target.value))"
                  class="flex-1 h-2 bg-neutral-200 dark:bg-neutral-700 rounded-lg appearance-none cursor-pointer"
                />
                <span class="text-xs text-neutral-600 dark:text-neutral-400 w-10 text-right">
                  {{ config.question_types[qType.name].weight.toFixed(1) }}
                </span>
              </div>

              <!-- Direction Weights (if applicable) -->
              <div
                v-if="qType.has_direction && config.question_types[qType.name].direction_weights"
                class="ml-4 space-y-1 p-2 bg-neutral-50 dark:bg-neutral-800 rounded"
              >
                <div class="text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Direction Weights:
                </div>
                <div
                  v-for="direction in ['none', 'preceding', 'following']"
                  :key="direction"
                  class="flex items-center gap-2"
                >
                  <label class="text-xs text-neutral-600 dark:text-neutral-400 w-20 capitalize">
                    {{ direction }}:
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    :value="config.question_types[qType.name].direction_weights[direction]"
                    @input="updateDirectionWeight(qType.name, direction, parseFloat($event.target.value))"
                    class="flex-1 h-1 bg-neutral-200 dark:bg-neutral-700 rounded-lg appearance-none cursor-pointer"
                  />
                  <span class="text-xs text-neutral-600 dark:text-neutral-400 w-10 text-right">
                    {{ config.question_types[qType.name].direction_weights[direction].toFixed(2) }}
                  </span>
                </div>
              </div>

              <!-- Properties Info -->
              <div v-if="qType.properties.length > 0" class="ml-4">
                <div class="text-xs text-neutral-500 dark:text-neutral-500">
                  Properties: {{ qType.properties.join(', ') }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Summary -->
    <div
      v-if="enabledCount > 0"
      class="mt-4 p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-md"
    >
      <p class="text-sm text-green-800 dark:text-green-200">
        {{ enabledCount }} question type{{ enabledCount !== 1 ? 's' : '' }} enabled
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CustomQuizConfig, QuestionTypeInfo } from '~/composables/useQuizConfig'

const props = defineProps<{
  config: CustomQuizConfig
  questionTypes: QuestionTypeInfo[]
}>()

const emit = defineEmits<{
  toggle: [questionType: string]
  updateWeight: [questionType: string, weight: number]
  updateDirection: [questionType: string, weights: any]
  enableAll: []
  disableAll: []
}>()

const enabledCount = computed(() => {
  return Object.values(props.config.question_types).filter(cfg => cfg.enabled).length
})

const enableAll = () => emit('enableAll')
const disableAll = () => emit('disableAll')

const randomizeWeights = () => {
  for (const qType of props.questionTypes) {
    if (props.config.question_types[qType.name]?.enabled) {
      const randomWeight = Math.random() * 9.9 + 0.1 // 0.1 to 10
      emit('updateWeight', qType.name, parseFloat(randomWeight.toFixed(1)))
    }
  }
}

const updateDirectionWeight = (qType: string, direction: string, value: number) => {
  const currentWeights = { ...props.config.question_types[qType].direction_weights }
  currentWeights[direction] = value

  // Normalize to sum to 1
  const sum = Object.values(currentWeights).reduce((a, b) => a + b, 0)
  if (sum > 0) {
    for (const key in currentWeights) {
      currentWeights[key] = currentWeights[key] / sum
    }
  }

  emit('updateDirection', qType, currentWeights)
}
</script>