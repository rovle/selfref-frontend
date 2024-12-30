<template>
  <div class="min-h-screen py-8 bg-white dark:bg-black">
    <AppNavbar />
    <div class="sm:px-4 pt-6 sm:pt-10 md:pt-12">
      <div
        class="mx-auto max-w-4xl xl:max-w-6xl 2xl:max-w-7xl border-black/10 sm:border dark:border-white/20 text-black dark:text-white"
      >
        <div class="p-6 border-b dark:border-white/20">
          <h2 class="mb-2 md:text-2xl text-xl font-bold">{{ cardTitle }}</h2>
          <p class="text-sm text-neutral-600 dark:text-neutral-400">
            {{ cardDescription }}
          </p>
        </div>

        <div class="space-y-4 p-6">
          <!-- Setup -->
          <div v-if="quizState === 'setup'" class="space-y-4">
            <div class="flex gap-4 pb-2">
              <div class="flex items-center space-x-2">
                <input
                  type="radio"
                  id="difficulty"
                  value="difficulty"
                  v-model="generationType"
                />
                <label for="difficulty" class="text-black dark:text-white"
                  >Difficulty Level</label
                >
              </div>
              <div class="flex items-center space-x-2">
                <input
                  type="radio"
                  id="custom"
                  value="custom"
                  v-model="generationType"
                />
                <label for="custom" class="text-black dark:text-white"
                  >Custom quiz</label
                >
              </div>
              <div class="flex items-center space-x-2">
                <input
                  type="radio"
                  id="answerList"
                  value="answerList"
                  v-model="generationType"
                />
                <label for="answerList" class="text-black dark:text-white"
                  >Answer List</label
                >
              </div>
            </div>

            <div v-if="generationType === 'difficulty'">
              <div
                class="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-6 rounded-md text-sm"
              >
                <button
                  v-for="mode in difficultyModes"
                  :key="mode.value"
                  @click="difficultyLevel = mode.value"
                  :class="[
                    'px-2 py-2 rounded-sm focus:outline-none',
                    difficultyLevel === mode.value
                      ? 'bg-neutral-900 text-white dark:bg-white dark:text-black'
                      : 'bg-neutral-200 text-black hover:bg-neutral-400/50 dark:bg-neutral-900 dark:text-white hover:bg-neutral-800',
                  ]"
                >
                  {{ mode.label }}
                </button>
              </div>
            </div>

            <div v-if="generationType === 'custom'" class="flex items-center">
              <div class="mx-auto grid max-w-screen-md gap-4 sm:grid-cols-2">
                <div>
                  <label
                    for="questionCount"
                    class="mb-2 inline-block text-sm text-neutral-700 dark:text-neutral-300 sm:text-base"
                    >Number of questions*</label
                  >
                  <input
                    id="questionCount"
                    type="number"
                    min="1"
                    max="500"
                    v-model.number="numberOfQuestions"
                    class="w-full px-2 py-1 text-neutral-700 bg-white border border-neutral-200 dark:bg-neutral-900 dark:text-neutral-300 dark:border-neutral-600 focus:border-green-400 dark:focus:border-green-300 focus:outline-none"
                  />
                </div>
                <div>
                  <label
                    for="answerUpToLetter"
                    class="mb-2 inline-block text-sm text-neutral-700 dark:text-neutral-300 sm:text-base"
                    >Answers can be up to letter*</label
                  >
                  <input
                    id="answerUpToLetter"
                    v-model="answerUpToLetter"
                    class="w-full px-2 py-1 text-neutral-700 bg-white border border-neutral-200 dark:bg-neutral-900 dark:text-neutral-300 dark:border-neutral-600 focus:border-green-400 dark:focus:border-green-300 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div
              v-if="generationType === 'answerList'"
              class="flex items-center space-x-4"
            >
              <div class="mx-auto grid max-w-screen-md gap-4 sm:grid-cols-2">
                <div>
                  <label
                    for="answerList"
                    class="mb-2 inline-block text-sm text-neutral-700 dark:text-neutral-300 sm:text-base"
                    >Answer list*</label
                  >
                  <input
                    id="answerList"
                    v-model="answerList"
                    class="w-full px-2 py-1 text-neutral-700 bg-white border border-neutral-200 dark:bg-neutral-900 dark:text-neutral-300 dark:border-neutral-600 focus:border-green-400 dark:focus:border-green-300 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Solving -->
          <div v-else-if="quizState === 'solving' || quizState === 'results'">
            <p class="mb-6 text-neutral-600 dark:text-neutral-400 text-sm">
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
                    class="appearance-none w-4 h-4 text-red-600 rounded border-neutral-300 checked:bg-red-500 hover:checked:bg-red-600 dark:checked:bg-red-600 dark:hover:checked:bg-red-700 bg-neutral-200 dark:bg-neutral-800 dark:border-neutral-600 cursor-pointer"
                  />
                  <Icon
                    v-if="wrongOptionsHidden"
                    name="mdi:check"
                    class="absolute inset-0 w-4 h-4 text-white pointer-events-none flex items-center justify-center"
                  />
                </div>
                <span
                  class="ml-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 flex items-center"
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
                              'text-neutral-600 bg-neutral-100 dark:bg-neutral-950 dark:text-neutral-500 dark:border-neutral-950':
                                answers[question.id][index] === 'incorrect',
                              'text-neutral-600 bg-neutral-100 dark:bg-neutral-950 dark:text-neutral-400 dark:border-neutral-950':
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
                            class="flex px-2 py-2 border bg-neutral-100 hover:bg-red-500 hover:text-black dark:bg-neutral-950 dark:hover:bg-red-800/90 dark:hover:text-white"
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
                          class="font-semibold text-gray-900 pl-3 pr-2 py-1.5 dark:text-neutral-200 border"
                          :class="{
                            'border-green-400 bg-green-500/80 dark:bg-green-700 dark:border-green-800':
                              answers[question.id][index] === 'correct',
                            'border-red-400 bg-red-500/80 dark:bg-red-600/30 dark:border-red-950':
                              answers[question.id][index] === 'incorrect',
                            'bg-neutral-100 border-neutral-200 dark:bg-neutral-950 dark:border-neutral-950 dark:text-neutral-200':
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
                  score === questions.length
                    ? 'Congratulations!'
                    : 'Good effort!'
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

        <div class="mt-3 px-6 pb-6">
          <button
            v-if="quizState === 'setup'"
            @click="generateQuiz"
            class="w-full bg-green-500 hover:bg-green-600 text-black font-medium uppercase px-4 py-2"
          >
            Generate Quiz
          </button>
          <div v-else-if="quizState === 'solving'" class="flex justify-between">
            <div class="flex gap-3">
              <button
                @click="goBack"
                class="flex items-center bg-neutral-900 dark:bg-white text-white dark:text-black font-medium uppercase text-sm px-4 py-2 hover:bg-black/90 dark:hover:bg-white/90"
              >
                <Icon name="mdi:arrow-left" class="w-4 h-4 mr-2" />
                Go Back
              </button>
              <button
                @click="resetQuiz"
                class="flex items-center bg-neutral-900 dark:bg-white text-white dark:text-black font-medium uppercase text-sm px-4 py-2 hover:bg-black/90 dark:hover:bg-white/90"
              >
                Reset
              </button>
            </div>
            <button
              @click="submitQuiz"
              class="bg-green-500 hover:bg-green-600 text-black font-medium uppercase text-sm px-4 py-2"
            >
              Submit
            </button>
          </div>
          <div v-else-if="quizState === 'results'" class="flex gap-4">
            <button
              @click="goBack"
              class="bg-neutral-900 dark:bg-white text-white dark:text-black font-medium uppercase text-sm px-4 py-2 hover:bg-black/90 dark:hover:bg-white/90"
            >
              Try Another Quiz
            </button>
            <button
              @click="resetQuiz"
              class="flex items-center bg-neutral-900 dark:bg-white text-white dark:text-black font-medium uppercase text-sm px-4 py-2 hover:bg-black/90 dark:hover:bg-white/90"
            >
              Reset quiz
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import AppNavbar from './layout/AppNavbar.vue';

type Question = {
  id: number;
  text: string;
  options: { option: string; answer: string }[];
  correctAnswer: number;
};
type QuizState = 'setup' | 'solving' | 'results';
type AnswerState = 'unanswered' | 'correct' | 'incorrect';
type GenerationType = 'difficulty' | 'custom' | 'answerList';
type DifficultyLevel =
  | 'very-easy'
  | 'easy'
  | 'medium'
  | 'hard'
  | 'very-hard'
  | 'insane';
type DifficultyMode = {
  value: DifficultyLevel;
  label: string;
  questionCount: number;
  answerUpToLetter: string;
};

const quizState = ref<QuizState>('setup');
const generationType = ref<GenerationType>('difficulty');
const numberOfQuestions = ref(5);
const difficultyLevel = ref<DifficultyLevel>('easy');
const answerList = ref('');
const answerUpToLetter = ref('C');
const questions = ref<Question[]>([]);
const answers = ref<Record<number, AnswerState[]>>({});
const correctAnswers = ref<number[]>([]);
const uniqueQuiz = ref(true);
const generationTime = ref<number | null>(null);
const seed = ref(null);
const score = ref(0);
const wrongOptionsHidden = ref(false);

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
];

const generateQuiz = async () => {
  try {
    let numQuestions = 0;
    let answerUpTo = 'C';

    if (generationType.value === 'custom') {
      numQuestions = numberOfQuestions.value;
      answerUpTo = answerUpToLetter.value;
    } else if (generationType.value === 'difficulty') {
      const level = difficultyModes.find(
        (level) => level.value === difficultyLevel.value
      );
      if (level) {
        numQuestions = level.questionCount;
        answerUpTo = level.answerUpToLetter;
      }
    } else if (generationType.value === 'answerList') {
      numQuestions = answerList.value.length;
    }

    const response = await fetch('http://localhost:8000/quizzes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        num_questions: numQuestions,
        answer_list: answerList.value,
        answer_up_to_letter: answerUpTo,
      }),
    });
    const data = await response.json();
    console.log(data);
    questions.value = data.quiz;
    correctAnswers.value = data.answers;
    uniqueQuiz.value = data.unique_quiz;
    generationTime.value = data.generation_time;
    seed.value = data.seed;
    answers.value = Object.fromEntries(
      data.quiz.map((q: Question) => [
        q.id,
        Array(q.options.length).fill('unanswered'),
      ])
    );
    quizState.value = 'solving';
  } catch (error) {
    console.error('Error generating quiz:', error);
  }
};

const handleAnswer = (
  questionId: number,
  optionIndex: number,
  newState: AnswerState
) => {
  if (quizState.value !== 'solving') return;

  // Retrieve the current answers for the given question
  const currentAnswers = answers.value[questionId];
  const updatedAnswers = [...currentAnswers];

  const originalState = updatedAnswers[optionIndex];

  // If the new state is 'correct', mark all options as 'incorrect'
  if (newState === 'correct') {
    updatedAnswers.fill('incorrect');
  }

  // Determine the new state for the selected option
  if (originalState === newState) {
    updatedAnswers[optionIndex] = 'unanswered';
  } else {
    updatedAnswers[optionIndex] = newState;
  }

  // Update the answers with the new states
  answers.value[questionId] = updatedAnswers;
};

const submitQuiz = () => {
  let numCorrectAnswers = 0;
  questions.value.forEach((question) => {
    const selected_answer_idx = answers.value[question.id].indexOf('correct');
    const selected_option = question.options[selected_answer_idx].option;
    const correct_option = correctAnswers.value[question.id - 1].toString();

    if (selected_option === correct_option) {
      numCorrectAnswers++;
    }
  });

  console.log(questions.value);
  console.log(answers.value);

  score.value = numCorrectAnswers;
  quizState.value = 'results';
};

const goBack = () => {
  quizState.value = 'setup';
  answers.value = {};
  score.value = 0;
};

const resetQuiz = () => {
  questions.value.forEach((question) => {
    answers.value[question.id] = Array(question.options.length).fill(
      'unanswered'
    );
  });
  quizState.value = 'solving';
};

const toggleWrongOptions = () => {
  wrongOptionsHidden.value = !wrongOptionsHidden.value;
};

const cardTitle = computed(() =>
  quizState.value === 'setup'
    ? 'Create your quiz'
    : quizState.value === 'solving'
    ? 'Solve the quiz'
    : 'Quiz results'
);

const cardDescription = computed(() =>
  quizState.value === 'setup'
    ? 'Choose your quiz parameters'
    : quizState.value === 'solving'
    ? 'Select the correct answers and mark wrong options'
    : 'See how well you did!'
);
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
