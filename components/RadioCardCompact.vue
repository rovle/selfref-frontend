<template>
  <div>
    <input
      type="radio"
      :id="id"
      :value="value"
      class="hidden peer"
      :name="name"
      :checked="modelValue === value"
      @change="(e) => {
        const value = (e.target as HTMLInputElement).value
        if (isDifficultyLevel(value)) {
          $emit('update:modelValue', value)
        }
      }"
    />
    <label
      :for="id"
      class="inline-flex items-center justify-between w-full p-3 text-neutral-600 bg-white border border-neutral-200 rounded-lg cursor-pointer dark:hover:text-neutral-300 dark:border-neutral-700 dark:peer-checked:text-green-500 peer-checked:border-green-600 dark:peer-checked:border-green-600 peer-checked:text-green-600 hover:text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:bg-neutral-800 dark:hover:bg-neutral-700"
    >
      <div class="block">
        <div class="w-full text-lg font-semibold">
          {{ label }}
        </div>
      </div>
    </label>
  </div>
</template>

<script setup lang="ts">
type DifficultyLevel =
  | 'very-easy'
  | 'easy'
  | 'medium'
  | 'hard'
  | 'very-hard'
  | 'insane'

const isDifficultyLevel = (value: string): value is DifficultyLevel =>
  ['very-easy', 'easy', 'medium', 'hard', 'very-hard', 'insane'].includes(value)

defineProps<{
  id: string
  value: DifficultyLevel
  name: string
  label: string
  modelValue: DifficultyLevel
}>()

defineEmits<{
  'update:modelValue': [value: DifficultyLevel]
}>()
</script>
