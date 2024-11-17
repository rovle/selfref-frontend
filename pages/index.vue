<template>
    <div class="min-h-screen bg-gradient-to-b from-blue-100 to-purple-100 py-8 px-4 sm:px-6 lg:px-8">
        <div class="max-w-5xl mx-auto">
            <header class="mb-8">
                <h1 class="md:text-3xl text-2xl font-bold text-gray-900 mb-4 text-center">Self-Referential Quiz Builder
                </h1>
                <p class="md:text-xl text-center text-gray-700 mb-9">
                    Create, customize, and solve unique self-referential quizzes. Generate hundreds
                    of questions in seconds.
                </p>
                <p class="md:text-lg text-gray-700 mb-6">In self-referential quizzes, each question refers to the quiz
                    itself, challenging you to think
                    recursively and consider the quiz as a whole.</p>
                <p class="md:text-lg text-gray-700 mb-6">
                    This project was created as a benchmark for evaluating advanced reasoning capabilities in large
                    language models, and this website provides a user-friendly interface to interact with the quiz
                    generator and solver.
                </p>

                <div class="flex justify-center space-x-4">
                    <a href="https://github.com" target="_blank" rel="noopener noreferrer"
                        class="p-2 rounded-md hover:bg-gray-100" aria-label="GitHub">
                        <Github class="w-6 h-6 text-gray-700" />
                    </a>
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"
                        class="p-2 rounded-md hover:bg-gray-100" aria-label="Twitter">
                        <Twitter class="w-6 h-6 text-gray-700" />
                    </a>
                    <a href="https://www.lesswrong.com" target="_blank" rel="noopener noreferrer"
                        class="p-2 rounded-md hover:bg-gray-100" aria-label="LessWrong">
                        <!-- <LessWrong class="w-6 h-6 text-gray-700" /> -->
                    </a>
                </div>
            </header>

            <div class="bg-white shadow-md rounded-lg p-6">
                <div class="border-b pb-4 mb-4">
                    <h2 class="md:text-2xl text-xl font-bold">{{ cardTitle }}</h2>
                    <p class="text-gray-600">{{ cardDescription }}</p>
                </div>

                <div class="space-y-6">
                    <!-- Setup -->
                    <div v-if="quizState === 'setup'" class="space-y-4">
                        <div class="flex gap-4">
                            <div class="flex items-center space-x-2">
                                <input type="radio" id="difficulty" value="difficulty" v-model="generationType"
                                    class="text-blue-600 focus:ring-blue-500" />
                                <label for="difficulty" class="text-gray-700">Difficulty Level</label>
                            </div>
                            <div class="flex items-center space-x-2">
                                <input type="radio" id="number" value="number" v-model="generationType"
                                    class="text-blue-600 focus:ring-blue-500" />
                                <label for="number" class="text-gray-700">Custom quiz</label>
                            </div>
                        </div>

                        <div v-if="generationType === 'number'" class="flex items-center space-x-4">
                            <label for="questionCount" class="text-gray-700">Number of questions:</label>
                            <input id="questionCount" type="number" min="1" max="15" v-model.number="numberOfQuestions"
                                class="w-20 border rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>

                        <div v-else>
                            <div class="flex flex-wrap rounded-md">
                                <button v-for="level in difficultyLevels" :key="level.value"
                                    @click="difficultyLevel = level.value" :class="[
                                        'px-3 py-2 focus:outline-none',
                                        difficultyLevel === level.value
                                            ? 'bg-blue-700 text-white'
                                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    ]">
                                    {{ level.label }}
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Solving -->
                    <div v-else-if="quizState === 'solving'" class="grid lg:grid-cols-2 grid-cols-1 gap-8">
                        <div v-for="question in questions" :key="question.id" class="space-y-4">
                            <h3 class="font-medium">{{ question.id }}. {{ question.text }}</h3>
                            <div class="grid grid-cols-1 gap-2">
                                <div v-for="(option, index) in question.options" :key="index" class="relative group">
                                    <button
                                        class="w-full border pr-4 text-left flex justify-between items-center focus:outline-none"
                                        :class="{
                                            'bg-green-100 border-green-300': answers[question.id][index] === 'correct',
                                            'bg-red-100 border-red-300': answers[question.id][index] === 'incorrect',
                                            'hover:bg-gray-50': answers[question.id][index] === 'unanswered',
                                        }">
                                        <span class="text-sm flex">
                                            <div class="font-bold pl-3 pr-3 py-2 bg-gray-100">
                                                {{ String.fromCharCode(97 + index).toUpperCase() }}
                                            </div>
                                            <div class="pl-3 py-2">
                                                {{ option }}
                                            </div>
                                        </span>
                                        <!-- Selected Icon -->
                                        <span v-if="answers[question.id][index] === 'correct'" class="text-green-600">
                                            <CheckCircle class="w-4 h-4" />
                                        </span>
                                        <span v-if="answers[question.id][index] === 'incorrect'" class="text-red-600">
                                            <XCircle class="w-4 h-4" />
                                        </span>
                                    </button>
                                    <!-- Hover Action Buttons -->
                                    <div
                                        class="absolute inset-y-0 right-0 flex items-center pr-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button class="mr-2 p-1 rounded-sm bg-green-500 hover:bg-green-600 text-white"
                                            @click.stop="handleAnswer(question.id, index, 'correct')"
                                            aria-label="Mark as Correct">
                                            <Check class="w-4 h-4" />
                                        </button>
                                        <button class="p-1 rounded-sm bg-red-500 hover:bg-red-600 text-white"
                                            @click.stop="handleAnswer(question.id, index, 'incorrect')"
                                            aria-label="Mark as Incorrect">
                                            <X class="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Results -->
                    <div v-else-if="quizState === 'results'" class="text-center">
                        <h3 class="text-2xl font-bold mb-4">Score: {{ score }} / {{ questions.length }}</h3>
                        <p class="text-gray-700 mb-4">Well done! You've tackled the unique reasoning challenge of the
                            self-referential quiz.</p>
                    </div>
                </div>

                <div class="mt-6">
                    <button v-if="quizState === 'setup'" @click="generateQuiz"
                        class="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800">
                        Generate Quiz
                    </button>
                    <div v-else-if="quizState === 'solving'" class="flex justify-between">
                        <button @click="resetQuiz"
                            class="flex items-center bg-white text-black px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100">
                            <ArrowLeft class="w-4 h-4 mr-2" />
                            Go Back
                        </button>
                        <button @click="submitQuiz" class="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800">
                            Submit Quiz
                        </button>
                    </div>
                    <button v-else-if="quizState === 'results'" @click="resetQuiz"
                        class="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800">
                        Try Another Quiz
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import {
    ArrowLeft,
    CheckCircle,
    XCircle,
    Check,
    X,
    Github,
    Twitter,
} from 'lucide-vue-next';

type Question = {
    id: number;
    text: string;
    options: string[];
    correctAnswer: number;
};
type QuizState = 'setup' | 'solving' | 'results';
type AnswerState = 'unanswered' | 'correct' | 'incorrect';

const quizState = ref<QuizState>('setup');
const generationType = ref<'number' | 'difficulty'>('difficulty');
const numberOfQuestions = ref(5);
const difficultyLevel = ref('easy');
const questions = ref<Question[]>([]);
const answers = ref<Record<number, AnswerState[]>>({});
const score = ref(0);

const difficultyToQuestionCount = {
    'very-easy': 3,
    easy: 5,
    medium: 7,
    hard: 10,
    'very-hard': 12,
    insane: 15,
};

const difficultyLevels = [
    { value: 'very-easy', label: 'Very Easy' },
    { value: 'easy', label: 'Easy' },
    { value: 'medium', label: 'Medium' },
    { value: 'hard', label: 'Hard' },
    { value: 'very-hard', label: 'Very Hard' },
    { value: 'insane', label: 'Insane' },
];

const generateQuiz = () => {
    const questionCount =
        generationType.value === 'number'
            ? numberOfQuestions.value
            : difficultyToQuestionCount[difficultyLevel.value as keyof typeof difficultyToQuestionCount];

    const generatedQuestions = Array.from({ length: questionCount }, (_, i) => ({
        id: i + 1,
        text: `This is question ${i + 1}. What's the correct answer?`,
        options: ['A', 'B', 'C', 'D'],
        correctAnswer: Math.floor(Math.random() * 4),
    }));

    questions.value = generatedQuestions;
    answers.value = Object.fromEntries(
        generatedQuestions.map((q) => [q.id, Array(4).fill('unanswered')])
    );
    quizState.value = 'solving';
};

const handleAnswer = (questionId: number, optionIndex: number, newState: AnswerState) => {
    const currentAnswers = answers.value[questionId];
    const newAnswers = [...currentAnswers];
    if (newState === 'correct') {
        // Mark other options as incorrect when choosing a new answer
        newAnswers.fill('incorrect');
    }
    newAnswers[optionIndex] = newAnswers[optionIndex] === newState ? 'unanswered' : newState;
    answers.value[questionId] = newAnswers;
};

const submitQuiz = () => {
    let correctAnswers = 0;
    questions.value.forEach((question) => {
        if (answers.value[question.id][question.correctAnswer] === 'correct') {
            correctAnswers++;
        }
    });
    score.value = correctAnswers;
    quizState.value = 'results';
};

const resetQuiz = () => {
    quizState.value = 'setup';
    answers.value = {};
    score.value = 0;
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
            ? 'Select the correct answers and mark incorrect options'
            : 'See how well you did!'
);
</script>

<style></style>