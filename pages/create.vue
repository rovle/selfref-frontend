<template>
  <div class="min-h-screen py-8 bg-white dark:bg-black">
    <AppNavbar />
    <div class="px-4 pt-20">
      <div
        class="mx-auto max-w-3xl border-black/10 border dark:border-white/20 text-black dark:text-white"
      >
        <div class="p-6 border-b dark:border-white/20">
          <h2 class="mb-2 md:text-2xl text-xl font-bold">{{ cardTitle }}</h2>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            {{ cardDescription }}
          </p>
        </div>

        <div class="space-y-6 p-6">
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
                    'px-2 py-2 rounded-sm focus:outline-none ',
                    difficultyLevel === mode.value
                      ? 'bg-neutral-900 text-white dark:bg-white dark:text-black'
                      : 'bg-gray-200 text-black hover:bg-gray-300 dark:bg-neutral-900 dark:text-white hover:bg-neutral-800',
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
            <p class="mb-6 text-gray-600 dark:text-gray-400">
              This quiz has {{ uniqueQuiz ? 'a unique' : 'more than one' }}
              solution and was generated in
              {{ generationTime?.toFixed(4) }} seconds.
            </p>
            <div class="flex items-center justify-end">
              <button
                @click="toggleWrongOptions()"
                class="flex items-center text-rose-600 dark:text-rose-500 font-medium uppercase text-sm px-4 py-2 hover:text-rose-700 dark:hover:text-rose-600 mb-3"
              >
                {{ wrongOptionsHidden ? 'Show' : 'Hide' }} wrong options
              </button>
            </div>
            <div class="grid lg:grid-cols-2 grid-cols-1 gap-8">
              <div
                v-for="question in questions"
                :key="question.id"
                :class="{ 'hide-incorrect': wrongOptionsHidden }"
                class="space-y-4"
              >
                <h3 class="font-medium">
                  {{ question.id }}. {{ question.text }}
                </h3>
                <div class="grid grid-cols-1 gap-2">
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
                      class="w-full pr-3 text-left flex justify-between items-center focus:outline-none"
                      :class="{
                        'border-green-400':
                          answers[question.id][index] === 'correct',
                        'border-rose-400':
                          answers[question.id][index] === 'incorrect',
                        'border-neutral-800':
                          answers[question.id][index] === 'unanswered',
                      }"
                    >
                      <span class="w-full text-sm flex items-center">
                        <!-- Action Buttons -->
                        <div class="flex items-center text-black">
                          <button
                            class="flex px-2 py-2 border border-green-600 bg-green-400 hover:bg-green-500 hover:opacity-100 dark:bg-green-700/50 dark:border-green-900 dark:hover:bg-green-700/80 dark:text-white"
                            :class="{
                              'opacity-100':
                                answers[question.id][index] === 'correct',
                              'opacity-10':
                                answers[question.id][index] === 'incorrect',
                              'opacity-15':
                                answers[question.id][index] === 'unanswered',
                            }"
                            @click.stop="
                              handleAnswer(question.id, index, 'correct')
                            "
                            aria-label="Mark as Correct"
                          >
                            <Icon name="mdi:check" size="16" />
                          </button>
                          <button
                            class="flex px-2 py-2 border border-rose-600 bg-rose-400 hover:bg-rose-500 hover:opacity-100 dark:bg-rose-700/50 dark:border-rose-900 dark:hover:bg-rose-700/80 dark:text-white"
                            :class="{
                              'opacity-100':
                                answers[question.id][index] === 'incorrect',
                              'opacity-10':
                                answers[question.id][index] === 'correct',
                              'opacity-15':
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

                        <div
                          class="font-semibold text-gray-900 pl-3 pr-2 py-1.5 bg-gray-100 dark:text-neutral-200 dark:bg-neutral-950 border"
                          :class="{
                            'bg-green-400 border-green-600 dark:bg-green-700/50 dark:border-green-800':
                              answers[question.id][index] === 'correct',
                            'bg-rose-400 border-rose-600 dark:bg-rose-700/50 dark:border-rose-800':
                              answers[question.id][index] === 'incorrect',
                            'border-neutral-200 dark:border-neutral-900 dark:text-neutral-200':
                              answers[question.id][index] === 'unanswered',
                          }"
                        >
                          {{ option.option }}.
                        </div>
                        <div
                          class="w-full pl-3 pr-3 py-1.5 border"
                          :class="{
                            'border-green-200 bg-green-100 dark:border-green-500/10 dark:bg-green-400/10':
                              answers[question.id][index] === 'correct',
                            'border-rose-200 bg-rose-100 dark:border-rose-500/10 dark:bg-rose-400/10':
                              answers[question.id][index] === 'incorrect',
                            'border-neutral-100 dark:border-neutral-900':
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
            <h3 class="text-xl font-bold mb-4">
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
            <div class="mt-5 text-xl font-bold">
              <span
                v-for="(question, idx) in questions"
                :key="question.id"
                class="mr-1"
                :class="
                  question.options[answers[question.id].indexOf('correct')]
                    .option === correctAnswers[question.id - 1].toString()
                    ? 'text-green-500'
                    : 'text-rose-500'
                "
              >
                {{ correctAnswers[question.id - 1] }}
              </span>
            </div>
          </div>
        </div>

        <div class="mt-6 px-6 pb-6">
          <button
            v-if="quizState === 'setup'"
            @click="generateQuiz"
            class="w-full bg-green-500 hover:bg-green-600 text-black font-medium uppercase px-4 py-2"
          >
            Generate Quiz
          </button>
          <div v-else-if="quizState === 'solving'" class="flex justify-between">
            <div class="flex gap-4">
              <button
                @click="goBack"
                class="flex items-center bg-neutral-900 dark:bg-white text-white dark:text-black font-medium uppercase text-sm px-4 py-2 hover:bg-black/90 dark:hover:bg-white/90"
              >
                <ArrowLeft class="w-4 h-4 mr-2" />
                Go Back
              </button>
              <button
                @click="resetQuiz"
                class="flex items-center bg-neutral-900 dark:bg-white text-white dark:text-black font-medium uppercase text-sm px-4 py-2 hover:bg-black/90 dark:hover:bg-white/90"
              >
                Reset quiz
              </button>
            </div>
            <button
              @click="submitQuiz"
              class="bg-green-500 hover:bg-green-600 text-black font-medium uppercase text-sm px-4 py-2"
            >
              Submit Quiz
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
import { ArrowLeft } from 'lucide-vue-next';
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

    const response = await fetch('http://127.0.0.1:8000/quizzes', {
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

  const currentAnswers = answers.value[questionId];
  const newAnswers = [...currentAnswers];
  if (newState === 'correct') {
    // Mark other options as incorrect when choosing a new answer
    newAnswers.fill('incorrect');
  }
  newAnswers[optionIndex] =
    newAnswers[optionIndex] === newState ? 'unanswered' : newState;
  answers.value[questionId] = newAnswers;
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
</style>
