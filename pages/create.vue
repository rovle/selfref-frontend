<template>
  <div class="sm:px-4 pt-10">
    <div
      class="mx-auto max-w-4xl xl:max-w-6xl 2xl:max-w-7xl border-black/10 sm:border dark:border-white/20 text-black dark:text-white rounded-md"
    >
      <div class="p-6 border-b dark:border-white/20">
        <h2 class="mb-2 md:text-2xl text-xl font-display font-bold">
          {{ cardTitle }}
        </h2>
        <p class="text-sm text-black dark:text-white">
          {{ cardDescription }}
        </p>
      </div>

      <div class="space-y-4 p-6">
        <!-- Setup -->
        <div
          v-if="quizState === 'typeSelection' || quizState === 'setup'"
          class="space-y-4"
        >
          <div v-if="quizState === 'typeSelection'">
            <div class="grid md:grid-cols-2 gap-12">
              <section>
                <div class="max-w-lg space-y-6">
                  <h2
                    class="text-xl font-bold text-neutral-900 dark:text-neutral-100"
                  >
                    Quick Guide
                  </h2>
                  <ul
                    class="list-inside list-disc space-y-2 text-neutral-900 dark:text-neutral-100 text-sm"
                  >
                    <li>
                      Start by choosing how you want to create your quiz: pick a
                      difficulty level, customize it yourself, or provide an
                      answer list.
                    </li>
                    <li>
                      Remember, in self-referential quizzes, each question
                      relates to the quiz itself, including its structure,
                      content, and answers. Think recursively!
                    </li>
                    <li>
                      Use the
                      <span
                        class="inline-flex border border-green-400 bg-green-500/80 dark:bg-green-700 dark:border-green-800 dark:text-white p-0.5"
                      >
                        <Icon name="mdi:check" size="14" />
                      </span>
                      or
                      <span
                        class="inline-flex border border-red-400 bg-red-500/80 dark:bg-red-600/50 dark:border-red-950 text-neutral-900 dark:text-white p-0.5"
                      >
                        <Icon name="mdi:close" size="14" />
                      </span>
                      buttons next to each option to mark them as correct or
                      incorrect. This helps you keep track of your answers and
                      narrow down the possible solutions as you work through the
                      quiz.
                    </li>
                    <li>
                      Each question has exactly one correct answer. To solve the
                      quiz, select the correct option for every question.
                    </li>
                  </ul>
                </div>
              </section>

              <div>
                <h3
                  class="mb-5 text-lg font-medium text-neutral-900 dark:text-white"
                >
                  Choose a generation type
                </h3>
                <ul class="grid w-full gap-4 md:grid-cols-2">
                  <li>
                    <RadioCard
                      id="difficulty"
                      value="difficulty"
                      name="generationType"
                      title="Difficulty Level"
                      description="Quickly generate a quiz from a predefined difficulty."
                      :model-value="generationType"
                      @update:modelValue="(val: GenerationType) => (generationType = val)"
                    />
                  </li>
                  <li>
                    <RadioCard
                      id="custom"
                      value="custom"
                      name="generationType"
                      title="Custom quiz"
                      description="Generate a quiz by providing custom parameters."
                      :model-value="generationType"
                      @update:modelValue="(val: GenerationType) => (generationType = val)"
                    />
                  </li>
                  <li>
                    <RadioCard
                      id="answerList"
                      value="answerList"
                      name="generationType"
                      title="Answer List"
                      description="Generate a quiz by providing its answer as a list."
                      :model-value="generationType"
                      @update:modelValue="(val: GenerationType) => (generationType = val)"
                    />
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div v-if="quizState === 'setup'">
            <div v-if="generationType === 'difficulty'">
              <h3
                class="mb-5 text-lg font-medium text-neutral-900 dark:text-white"
              >
                Difficulty Level
              </h3>
              <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
                <RadioCardCompact
                  v-for="mode in difficultyModes"
                  :key="mode.value"
                  :id="`difficulty-${mode.value}`"
                  :value="mode.value"
                  name="difficultyLevel"
                  :label="mode.label"
                  :model-value="difficultyLevel"
                  @update:modelValue="(val) => (difficultyLevel = val)"
                />
              </div>
            </div>

            <div v-if="generationType === 'custom'">
              <h3
                class="mb-5 text-lg font-medium text-neutral-900 dark:text-white"
              >
                Custom Quiz
              </h3>
              <div class="grid max-w-screen-md gap-4 sm:grid-cols-2">
                <div>
                  <label
                    for="questionCount"
                    class="mb-2 inline-block text-sm font-semibold text-black dark:text-white sm:text-base"
                    >Number of questions*</label
                  >
                  <input
                    id="questionCount"
                    type="number"
                    min="1"
                    max="500"
                    v-model.number="numberOfQuestions"
                    class="w-full rounded-md p-2 bg-white dark:bg-neutral-700 text-black dark:text-white border-2 border-neutral-200 dark:border-neutral-700 focus:border-neutral-800 dark:focus:border-neutral-200 focus:outline-none"
                  />
                </div>
                <div>
                  <label
                    for="answerUpToLetter"
                    class="mb-2 inline-block text-sm font-semibold text-black dark:text-white sm:text-base"
                    >Answers can be up to letter*</label
                  >
                  <input
                    id="answerUpToLetter"
                    v-model="answerUpToLetter"
                    class="w-full rounded-md p-2 bg-white dark:bg-neutral-700 text-black dark:text-white border-2 border-neutral-200 dark:border-neutral-700 focus:border-neutral-800 dark:focus:border-neutral-200 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div v-if="generationType === 'answerList'">
              <h3
                class="mb-5 text-lg font-medium text-neutral-900 dark:text-white"
              >
                Answer List
              </h3>
              <div class="grid max-w-screen-md gap-4 sm:grid-cols-2">
                <div>
                  <label
                    for="answerList"
                    class="mb-2 inline-block text-sm font-semibold text-black dark:text-white sm:text-base"
                    >Quiz answer*</label
                  >
                  <input
                    id="answerList"
                    v-model="answerList"
                    placeholder="e.g. ACBB"
                    class="w-full rounded-md p-2 bg-white dark:bg-neutral-700 text-black dark:text-white border-2 border-neutral-200 dark:border-neutral-700 focus:border-neutral-800 dark:focus:border-neutral-200 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Solving -->
        <div v-else-if="quizState === 'solving' || quizState === 'results'">
          <p class="mb-6 text-neutral-800 dark:text-neutral-200 text-sm">
            This quiz has {{ uniqueQuiz ? 'a unique' : 'more than one' }}
            solution and was generated in
            {{ generationTime?.toFixed(4) }} seconds.
          </p>

          <!-- Toggle wrong options -->
          <div class="flex items-center gap-2 mb-6">
            <label class="inline-flex items-center cursor-pointer">
              <div class="relative flex items-center">
                <input
                  type="checkbox"
                  :checked="wrongOptionsHidden"
                  @change="toggleWrongOptions()"
                  class="appearance-none w-4 h-4 text-red-600 rounded border-neutral-300 checked:bg-red-500 hover:checked:bg-red-600 dark:checked:bg-red-600 dark:hover:checked:bg-red-700 bg-neutral-200 dark:bg-neutral-700 dark:border-neutral-600 cursor-pointer"
                />
                <Icon
                  v-if="wrongOptionsHidden"
                  name="mdi:check"
                  class="absolute inset-0 w-4 h-4 text-white pointer-events-none flex items-center justify-center"
                />
              </div>
              <span
                class="ml-2 text-sm font-medium text-neutral-800 dark:text-neutral-200 flex items-center"
              >
                Hide wrong options
              </span>
            </label>
          </div>

          <div class="quiz-grid gap-10">
            <div
              v-for="question in questions"
              :key="question.id"
              :class="{ 'hide-incorrect': wrongOptionsHidden }"
              class="space-y-4 flex flex-col"
            >
              <!-- Question text -->
              <h3 class="text-sm font-medium">
                {{ question.id }}. {{ question.text }}
              </h3>

              <!-- Question options -->
              <div class="flex flex-col gap-2">
                <div
                  v-for="(option, index) in question.options"
                  :key="index"
                  class="relative group"
                  :class="{
                    'incorrect-option-container':
                      answers[question.id][index] === 'incorrect',
                  }"
                >
                  <div
                    class="w-full pr-3 text-left flex items-center focus:outline-none"
                    :class="{
                      'border-green-400':
                        answers[question.id][index] === 'correct',
                      'border-red-400':
                        answers[question.id][index] === 'incorrect',
                      'border-neutral-800':
                        answers[question.id][index] === 'unanswered',
                    }"
                  >
                    <span class="w-full text-sm flex items-center">
                      <!-- Action Buttons -->
                      <div class="flex items-center text-black">
                        <!-- Check button -->
                        <button
                          class="flex px-2 py-2 border hover:bg-green-500 hover:text-black dark:hover:bg-green-600 dark:hover:text-white"
                          :class="{
                            'border-green-400 bg-green-500/80 dark:bg-green-700 dark:border-green-800 dark:text-white':
                              answers[question.id][index] === 'correct',
                            'text-neutral-600 bg-neutral-100 dark:bg-neutral-900 dark:text-neutral-500 dark:border-neutral-950':
                              answers[question.id][index] === 'incorrect',
                            'text-neutral-600 bg-neutral-100 dark:bg-neutral-900 dark:text-neutral-400 dark:border-neutral-950':
                              answers[question.id][index] === 'unanswered',
                          }"
                          @click.stop="
                            handleAnswer(question.id, index, 'correct')
                          "
                          aria-label="Mark as Correct"
                        >
                          <Icon name="mdi:check" size="16" />
                        </button>

                        <!-- Wrong button -->
                        <button
                          class="flex px-2 py-2 border bg-neutral-100 hover:bg-red-500 hover:text-black dark:bg-neutral-900 dark:hover:bg-red-800/90 dark:hover:text-white"
                          :class="{
                            'border-red-400 bg-red-500/80 dark:bg-red-600/30 dark:border-red-950 text-neutral-900 dark:text-white':
                              answers[question.id][index] === 'incorrect',
                            'text-neutral-600 dark:text-neutral-500 dark:border-neutral-950':
                              answers[question.id][index] === 'correct',
                            'text-neutral-600 dark:text-neutral-400 dark:border-neutral-950':
                              answers[question.id][index] === 'unanswered',
                          }"
                          @click.stop="
                            handleAnswer(question.id, index, 'incorrect')
                          "
                          aria-label="Mark as Wrong"
                        >
                          <Icon name="mdi:close" size="16" />
                        </button>
                      </div>
                      <!-- End Action Buttons -->

                      <!-- Option letter -->
                      <div
                        class="font-semibold text-neutral-900 pl-3 pr-2 py-1.5 dark:text-neutral-200 border"
                        :class="{
                          'border-green-400 bg-green-500/80 dark:bg-green-700 dark:border-green-800':
                            answers[question.id][index] === 'correct',
                          'border-red-400 bg-red-500/80 dark:bg-red-600/30 dark:border-red-950':
                            answers[question.id][index] === 'incorrect',
                          'bg-neutral-100 border-neutral-200 dark:bg-neutral-900 dark:border-neutral-950 dark:text-neutral-200':
                            answers[question.id][index] === 'unanswered',
                        }"
                      >
                        {{ option.option }}.
                      </div>

                      <!-- Option text -->
                      <div
                        class="w-full pl-3 pr-3 py-1.5 border"
                        :class="{
                          'border-green-200 bg-green-100 dark:border-green-500/10 dark:bg-green-400/10':
                            answers[question.id][index] === 'correct',
                          'border-red-200 bg-red-100 dark:border-red-500/10 dark:bg-red-400/10':
                            answers[question.id][index] === 'incorrect',
                          'border-neutral-100 dark:border-neutral-950':
                            answers[question.id][index] === 'unanswered',
                        }"
                      >
                        {{ option.answer }}
                      </div>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Results -->
        <div v-if="quizState === 'results'" class="text-center pt-6">
          <h3 class="font-bold mb-4">
            Number of correct answers: {{ score }} / {{ questions.length }}
          </h3>
          <p>
            <span class="font-bold">
              {{
                score === questions.length ? 'Congratulations!' : 'Good effort!'
              }}
            </span>
            Here are the correct answers for each question, in order:
          </p>
          <div class="mt-4 text-xl font-bold">
            <span
              v-for="(question, idx) in questions"
              :key="question.id"
              class="mr-1"
              :class="
                question.options[answers[question.id].indexOf('correct')]
                  .option === correctAnswers[question.id - 1].toString()
                  ? 'text-green-500'
                  : 'text-red-500'
              "
            >
              {{ correctAnswers[question.id - 1] }}
            </span>
          </div>
        </div>
      </div>

      <!-- Message for unanswered questions -->
      <transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="transform opacity-0"
        enter-to-class="transform opacity-100"
        leave-active-class="transition duration-300 ease-in"
        leave-from-class="transform opacity-100"
        leave-to-class="transform opacity-0"
      >
        <div v-if="showMessage" class="px-6 pb-3">
          <div
            class="p-4 text-red-800 bg-red-50 border border-red-200 rounded-lg dark:text-red-400 dark:bg-red-950/50 dark:border-red-800"
            role="alert"
          >
            {{ message }}
          </div>
        </div>
      </transition>

      <div class="flex justify-between gap-3 mt-3 px-6 pb-6">
        <div>
          <button
            @click="goBack"
            v-if="quizState === 'setup'"
            class="flex items-center bg-neutral-900 dark:bg-white text-white dark:text-black font-medium text-sm px-4 py-2 hover:bg-black/90 dark:hover:bg-white/90 rounded-md"
          >
            <Icon name="mdi:arrow-left" class="w-4 h-4 mr-2" />
            Go Back
          </button>
        </div>

        <div>
          <button
            v-if="quizState === 'typeSelection'"
            @click="setupQuiz"
            class="flex items-center bg-green-500 hover:bg-green-600 text-black font-medium px-4 py-2 rounded-md"
          >
            Next
            <Icon name="mdi:arrow-right" class="w-4 h-4 ml-2" />
          </button>
          <button
            v-if="quizState === 'setup'"
            @click="generateQuiz"
            class="bg-green-500 hover:bg-green-600 text-black font-medium px-4 py-2 rounded-md"
          >
            Generate Quiz
          </button>
        </div>
      </div>

      <div
        v-if="quizState === 'solving'"
        class="flex justify-between gap-3 mt-3 px-6 pb-6"
      >
        <div class="flex gap-3">
          <button
            @click="goBack"
            class="flex items-center bg-neutral-900 dark:bg-white text-white dark:text-black font-medium text-sm px-4 py-2 hover:bg-black/90 dark:hover:bg-white/90 rounded-md"
          >
            <Icon name="mdi:arrow-left" class="w-4 h-4 mr-2" />
            Go Back
          </button>
          <button
            @click="resetQuiz"
            class="flex items-center bg-neutral-900 dark:bg-white text-white dark:text-black font-medium text-sm px-4 py-2 hover:bg-black/90 dark:hover:bg-white/90 rounded-md"
          >
            Reset
          </button>
        </div>
        <div class="flex">
          <button
            @click="submitQuiz"
            class="bg-green-500 hover:bg-green-600 text-black font-medium text-sm px-4 py-2 rounded-md"
          >
            Submit
          </button>
        </div>
      </div>

      <div
        v-if="quizState === 'results'"
        class="flex justify-end gap-3 mt-3 px-6 pb-6"
      >
        <button
          @click="goBack"
          class="bg-neutral-900 dark:bg-white text-white dark:text-black font-medium text-sm px-4 py-2 hover:bg-black/90 dark:hover:bg-white/90 rounded-md"
        >
          Try Another Quiz
        </button>
        <button
          @click="resetQuiz"
          class="flex items-center bg-neutral-900 dark:bg-white text-white dark:text-black font-medium text-sm px-4 py-2 hover:bg-black/90 dark:hover:bg-white/90 rounded-md"
        >
          Reset quiz
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import RadioCardCompact from '~/components/RadioCardCompact.vue'

useSeoMeta({
  title: 'Create Your Self-Referential Quiz - Quiz Builder'
})

const config = useRuntimeConfig()
const apiUrl = config.public.apiUrl

type Question = {
  id: number
  text: string
  options: { option: string; answer: string }[]
  correctAnswer: number
}
type QuizState = 'typeSelection' | 'setup' | 'solving' | 'results'
type AnswerState = 'unanswered' | 'correct' | 'incorrect'
type GenerationType = 'difficulty' | 'custom' | 'answerList'
type DifficultyLevel =
  | 'very-easy'
  | 'easy'
  | 'medium'
  | 'hard'
  | 'very-hard'
  | 'insane'
type DifficultyMode = {
  value: DifficultyLevel
  label: string
  questionCount: number
  answerUpToLetter: string
}

const quizState = ref<QuizState>('typeSelection')
const generationType = ref<GenerationType>('difficulty')
const numberOfQuestions = ref(5)
const difficultyLevel = ref<DifficultyLevel>('easy')
const answerList = ref('')
const answerUpToLetter = ref('C')
const questions = ref<Question[]>([])
const answers = ref<Record<number, AnswerState[]>>({})
const correctAnswers = ref<number[]>([])
const uniqueQuiz = ref(true)
const generationTime = ref<number | null>(null)
const seed = ref(null)
const score = ref(0)
const wrongOptionsHidden = ref(false)

const difficultyModes: DifficultyMode[] = [
  {
    value: 'very-easy',
    label: 'Very Easy',
    questionCount: 3,
    answerUpToLetter: 'C',
  },
  { value: 'easy', label: 'Easy', questionCount: 5, answerUpToLetter: 'D' },
  { value: 'medium', label: 'Medium', questionCount: 7, answerUpToLetter: 'D' },
  { value: 'hard', label: 'Hard', questionCount: 10, answerUpToLetter: 'E' },
  {
    value: 'very-hard',
    label: 'Very Hard',
    questionCount: 20,
    answerUpToLetter: 'E',
  },
  {
    value: 'insane',
    label: 'Insane',
    questionCount: 25,
    answerUpToLetter: 'F',
  },
]

const generateQuiz = async () => {
  try {
    let numQuestions = 0
    let answerUpTo = 'C'

    if (generationType.value === 'custom') {
      numQuestions = numberOfQuestions.value
      answerUpTo = answerUpToLetter.value
    } else if (generationType.value === 'difficulty') {
      const level = difficultyModes.find(
        (level) => level.value === difficultyLevel.value
      )
      if (level) {
        numQuestions = level.questionCount
        answerUpTo = level.answerUpToLetter
      }
    } else if (generationType.value === 'answerList') {
      numQuestions = answerList.value.length
    }

    const response = await fetch(`${apiUrl}/quizzes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        num_questions: numQuestions,
        answer_list: answerList.value,
        answer_up_to_letter: answerUpTo,
      }),
    })
    const data = await response.json()
    console.log(data)
    questions.value = data.quiz
    correctAnswers.value = data.answers
    uniqueQuiz.value = data.unique_quiz
    generationTime.value = data.generation_time
    seed.value = data.seed
    answers.value = Object.fromEntries(
      data.quiz.map((q: Question) => [
        q.id,
        Array(q.options.length).fill('unanswered'),
      ])
    )
    quizState.value = 'solving'
  } catch (error) {
    console.error('Error generating quiz:', error)
  }
}

const handleAnswer = (
  questionId: number,
  optionIndex: number,
  newState: AnswerState
) => {
  if (quizState.value !== 'solving') return

  // Retrieve the current answers for the given question
  const currentAnswers = answers.value[questionId]
  const updatedAnswers = [...currentAnswers]

  const originalState = updatedAnswers[optionIndex]

  // If the new state is 'correct', mark all options as 'incorrect'
  if (newState === 'correct') {
    updatedAnswers.fill('incorrect')
  }

  // Determine the new state for the selected option
  if (originalState === newState) {
    updatedAnswers[optionIndex] = 'unanswered'
  } else {
    updatedAnswers[optionIndex] = newState
  }

  // Update the answers with the new states
  answers.value[questionId] = updatedAnswers
}

const showMessage = ref(false)
const message = ref('')

const submitQuiz = () => {
  // Check if all questions have been answered
  const unansweredQuestions = questions.value.filter(
    (question) => !answers.value[question.id].includes('correct')
  )

  if (unansweredQuestions.length > 0) {
    message.value = `Please answer ${
      unansweredQuestions.length === 1 ? 'question' : 'questions'
    } ${unansweredQuestions.map((q) => q.id).join(', ')} before submitting.`
    showMessage.value = true
    setTimeout(() => {
      showMessage.value = false
    }, 5000)
    return
  }

  let numCorrectAnswers = 0
  questions.value.forEach((question) => {
    const selected_answer_idx = answers.value[question.id].indexOf('correct')
    const selected_option = question.options[selected_answer_idx].option
    const correct_option = correctAnswers.value[question.id - 1].toString()

    if (selected_option === correct_option) {
      numCorrectAnswers++
    }
  })

  score.value = numCorrectAnswers
  quizState.value = 'results'
}

const setupQuiz = () => {
  quizState.value = 'setup'
}

const goBack = () => {
  if (quizState.value === 'setup') {
    quizState.value = 'typeSelection'
  } else {
    quizState.value = 'setup'
  }

  answers.value = {}
  score.value = 0
}

const resetQuiz = () => {
  questions.value.forEach((question) => {
    answers.value[question.id] = Array(question.options.length).fill(
      'unanswered'
    )
  })
  quizState.value = 'solving'
}

const toggleWrongOptions = () => {
  wrongOptionsHidden.value = !wrongOptionsHidden.value
}

const cardTitle = computed(() => {
  switch (quizState.value) {
    case 'typeSelection':
      return 'Create your quiz'
    case 'setup':
      return 'Create your quiz'
    case 'solving':
      return 'Solve the quiz'
    case 'results':
      return 'Quiz results'
    default:
      return ''
  }
})

const cardDescription = computed(() => {
  switch (quizState.value) {
    case 'typeSelection':
      return 'Select how you want to generate your quiz'
    case 'setup':
      return 'Choose your quiz parameters'
    case 'solving':
      return 'Select the correct answer for each question'
    case 'results':
      return 'See how well you did!'
    default:
      return ''
  }
})
</script>

<style>
.hide-incorrect .incorrect-option-container {
  display: none;
}

.quiz-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
}
</style>
