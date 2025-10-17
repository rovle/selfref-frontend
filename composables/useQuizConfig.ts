import { ref, computed, watch } from 'vue'

export interface DirectionWeight {
  none: number
  preceding: number
  following: number
}

export interface PropertyWeights {
  even: number
  odd: number
  prime: number
  composite: number
  square: number
}

export interface QuestionTypeConfig {
  enabled: boolean
  weight: number
  direction_weights?: DirectionWeight
  property_weights?: PropertyWeights
  custom_properties?: Record<string, any>
}

export interface CustomQuizConfig {
  question_types: Record<string, QuestionTypeConfig>
  aesthetic_numbers_mode: boolean
  direction_cutoff: number
}

export interface QuestionTypeInfo {
  name: string
  display_name: string
  description: string
  has_direction: boolean
  has_number_property: boolean
  has_letter_about: boolean
  properties: string[]
}

export const useQuizConfig = () => {
  const config = ref<CustomQuizConfig>({
    question_types: {},
    aesthetic_numbers_mode: true,
    direction_cutoff: 0.25
  })

  const availableQuestionTypes = ref<QuestionTypeInfo[]>([])
  const availableProperties = ref<Record<string, string[]>>({})
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Load available question types from API
  const loadQuestionTypes = async () => {
    isLoading.value = true
    error.value = null

    try {
      const runtimeConfig = useRuntimeConfig()
      const apiUrl = runtimeConfig.public.apiUrl || 'http://127.0.0.1:8000'
      const response = await $fetch(`${apiUrl}/api/quiz-config`)
      availableQuestionTypes.value = response.question_types
      availableProperties.value = response.available_properties

      // Initialize config with all question types disabled
      const questionTypes: Record<string, QuestionTypeConfig> = {}
      for (const qType of response.question_types) {
        questionTypes[qType.name] = {
          enabled: false,
          weight: 1.0,
          direction_weights: qType.has_direction ? {
            none: 0.8,
            preceding: 0.1,
            following: 0.1
          } : undefined
        }
      }
      config.value.question_types = questionTypes
    } catch (err) {
      error.value = 'Failed to load question types'
      console.error('Error loading question types:', err)
    } finally {
      isLoading.value = false
    }
  }

  // Toggle question type enabled/disabled
  const toggleQuestionType = (questionType: string) => {
    if (config.value.question_types[questionType]) {
      config.value.question_types[questionType].enabled = !config.value.question_types[questionType].enabled
    }
  }

  // Update question type weight
  const updateQuestionWeight = (questionType: string, weight: number) => {
    if (config.value.question_types[questionType]) {
      config.value.question_types[questionType].weight = weight
    }
  }

  // Update direction weights for a question type
  const updateDirectionWeights = (questionType: string, weights: DirectionWeight) => {
    if (config.value.question_types[questionType]) {
      config.value.question_types[questionType].direction_weights = weights
    }
  }

  // Get enabled question types
  const enabledQuestionTypes = computed(() => {
    return Object.entries(config.value.question_types)
      .filter(([_, cfg]) => cfg.enabled)
      .map(([name, _]) => name)
  })

  // Check if at least one question type is enabled
  const hasEnabledQuestions = computed(() => {
    return Object.values(config.value.question_types).some(cfg => cfg.enabled)
  })

  // Reset to default configuration
  const resetConfig = () => {
    for (const qType in config.value.question_types) {
      config.value.question_types[qType].enabled = false
      config.value.question_types[qType].weight = 1.0
    }
    config.value.aesthetic_numbers_mode = true
    config.value.direction_cutoff = 0.25
  }

  // Enable all question types
  const enableAll = () => {
    for (const qType in config.value.question_types) {
      config.value.question_types[qType].enabled = true
    }
  }

  // Disable all question types
  const disableAll = () => {
    for (const qType in config.value.question_types) {
      config.value.question_types[qType].enabled = false
    }
  }

  return {
    config,
    availableQuestionTypes,
    availableProperties,
    isLoading,
    error,
    loadQuestionTypes,
    toggleQuestionType,
    updateQuestionWeight,
    updateDirectionWeights,
    enabledQuestionTypes,
    hasEnabledQuestions,
    resetConfig,
    enableAll,
    disableAll
  }
}