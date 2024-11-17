<template>
    <div class="min-h-screen bg-gradient-to-b from-blue-100 to-purple-100 py-8 px-4 sm:px-6 lg:px-8">
        <div class="max-w-5xl mx-auto">
            <header class="mb-8">
                <h1 class="md:text-3xl text-2xl font-bold text-gray-900 mb-4 text-center">Self-Referential Quiz Builder
                </h1>
                <p class="md:text-xl text-center text-gray-700 mb-4">
                    Create, customize, and solve unique self-referential quizzes
                </p>

                <div class="flex justify-center space-x-4 mb-6">
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

                <p class="text-gray-700 mb-6">
                    Self-referential quizzes are a fascinating type of logic puzzle that challenge your ability to
                    reason logically, think recursively and consider the quiz as a whole. Each question refers
                    to the quiz itself, making the
                    puzzle a meta-logical challenge. These quizzes can be found online, dating back to the early 1990s,
                    with some containing as many as
                    20 questions. Check out the <a href="https://faculty.uml.edu/jpropp/srat-Q.txt"
                        class="text-blue-800 underline hover:text-blue-900">Self-Referential Aptitude Test (S.R.A.T.) by
                        James Propp</a> and <a href="https://www.mathpuzzle.com/20questions.htm"
                        class="text-blue-800 underline hover:text-blue-900">Twenty Questions by Don Woods</a> for
                    examples.
                </p>

                <div class="bg-blue-100 border-l-4 border-blue-500 text-blue-800 p-4 mb-6" role="alert">
                    <p>
                        <Bot class="w-5 h-5 inline-block" />
                        This project was created to serve as a benchmark for evaluating advanced reasoning capabilities
                        in large
                        language models. This website provides a user-friendly interface to interact with the quiz
                        generator and solver. It is optimized to create quizzes with hundreds of questions in just
                        seconds!
                    </p>
                </div>
                <h2 class="md:text-lg text-lg font-bold mb-2">How it works</h2>
                <ul class="list-disc list-inside text-gray-700 mb-6">
                    <li>Start by choosing a difficulty level or creating a custom quiz.</li>
                    <li>You can mark options as correct or wrong by clicking on the green and red buttons that appear
                        over them.</li>
                    <li>Each question has only one correct answer. Solve the quiz by selecting the correct answer for
                        each question.</li>
                </ul>
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
                                <input type="radio" id="difficulty" value="difficulty" v-model="generationType" />
                                <label for="difficulty" class="text-gray-700">Difficulty Level</label>
                            </div>
                            <div class="flex items-center space-x-2">
                                <input type="radio" id="custom" value="custom" v-model="generationType" />
                                <label for="custom" class="text-gray-700">Custom quiz</label>
                            </div>
                            <div class="flex items-center space-x-2">
                                <input type="radio" id="answerList" value="answerList" v-model="generationType" />
                                <label for="answerList" class="text-gray-700">Answer List</label>
                            </div>
                        </div>

                        <div v-if="generationType === 'difficulty'">
                            <div class="flex flex-wrap rounded-md">
                                <button v-for="level in difficultyLevels" :key="level.value"
                                    @click="difficultyLevel = level.value" :class="[
                                        'px-3 py-2 focus:outline-none',
                                        difficultyLevel === level.value
                                            ? 'bg-blue-800 text-white'
                                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    ]">
                                    {{ level.label }}
                                </button>
                            </div>
                        </div>

                        <div v-if="generationType === 'custom'" class="flex items-center space-x-4">
                            <label for="questionCount" class="text-gray-700">Number of questions:</label>
                            <input id="questionCount" type="number" min="1" max="15" v-model.number="numberOfQuestions"
                                class="w-20 border rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500" />

                            <label for="answerUpToLetter" class="text-gray-700">Answers can be up to letter:</label>
                            <input id="answerUpToLetter" v-model="answerUpToLetter"
                                class="w-10 border rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>

                        <div v-if="generationType === 'answerList'" class="flex items-center space-x-4">
                            <label for="answerList" class="text-gray-700">Answer list:</label>
                            <input id="answerList" v-model="answerList"
                                class="w-72 border rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                    </div>

                    <!-- Solving -->
                    <div v-else-if="quizState === 'solving' || quizState === 'results'">
                        <p class="mb-6 text-gray-600">This quiz has {{ uniqueQuiz ? 'a unique' : 'more than one' }}
                            solution and was
                            generated in
                            {{ generationTime.toFixed(4) }} seconds.</p>
                        <div class="grid lg:grid-cols-2 grid-cols-1 gap-8">
                            <div v-for="question in questions" :key="question.id" class="space-y-4">
                                <h3 class="font-medium">{{ question.id }}. {{ question.text }}</h3>
                                <div class="grid grid-cols-1 gap-2">
                                    <div v-for="(option, index) in question.options" :key="index"
                                        class="relative group">
                                        <button
                                            class="w-full border pr-4 text-left flex justify-between items-center focus:outline-none"
                                            :class="{
                                                'bg-green-100 border-green-300': answers[question.id][index] === 'correct',
                                                'bg-red-100 border-red-300': answers[question.id][index] === 'incorrect',
                                                'hover:bg-gray-50': answers[question.id][index] === 'unanswered',
                                            }">
                                            <span class="text-sm flex">
                                                <div class="font-bold pl-3 pr-3 py-2 bg-gray-100">
                                                    {{ option.option }}
                                                </div>
                                                <div class="pl-3 py-2">
                                                    {{ option.answer }}
                                                </div>
                                            </span>
                                            <!-- Selected Icon -->
                                            <span v-if="answers[question.id][index] === 'correct'"
                                                class="text-green-600">
                                                <CheckCircle class="w-4 h-4" />
                                            </span>
                                            <span v-if="answers[question.id][index] === 'incorrect'"
                                                class="text-red-600">
                                                <XCircle class="w-4 h-4" />
                                            </span>
                                        </button>
                                        <!-- Hover Action Buttons -->
                                        <div
                                            class="absolute inset-y-0 right-0 flex items-center pr-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                class="mr-2 p-1 rounded-sm bg-green-500 hover:bg-green-600 text-white"
                                                @click.stop="handleAnswer(question.id, index, 'correct')"
                                                aria-label="Mark as Correct">
                                                <Check class="w-4 h-4" />
                                            </button>
                                            <button class="p-1 rounded-sm bg-red-500 hover:bg-red-600 text-white"
                                                @click.stop="handleAnswer(question.id, index, 'incorrect')"
                                                aria-label="Mark as Wrong">
                                                <X class="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Results -->
                    <div v-if="quizState === 'results'" class="text-center pt-6">
                        <h3 class="text-xl font-bold mb-4">Number of correct answers: {{ score }} / {{ questions.length
                            }}</h3>
                        <p>
                            <span class="font-bold">
                                {{ score === questions.length ? "Congratulations!" : 'Good effort!' }}
                            </span>
                            Here are the correct answers for each question, in order:
                        </p>
                        <div class="my-5 text-xl font-bold">
                            <span v-for="(question, idx) in questions" :key="question.id" class="mr-1"
                                :class="question.options[answers[question.id].indexOf('correct')].option === correctAnswers[question.id - 1] ? 'text-green-600' : 'text-red-600'">
                                {{ correctAnswers[question.id - 1] }}
                            </span>
                        </div>
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
    Info,
    Bot
} from 'lucide-vue-next';

type Question = {
    id: number;
    text: string;
    options: { option: string; answer: string }[]; // Changed from Map<string, string>
    correctAnswer: number;
};
type QuizState = 'setup' | 'solving' | 'results';
type AnswerState = 'unanswered' | 'correct' | 'incorrect';

const quizState = ref<QuizState>('setup');
const generationType = ref<'difficulty', 'custom', 'answerList'>('difficulty');
const numberOfQuestions = ref(5);
const difficultyLevel = ref('easy');
const answerList = ref('')
const answerUpToLetter = ref('C')
const questions = ref<Question[]>([]);
const answers = ref<Record<number, AnswerState[]>>({});
const correctAnswers = ref<number[]>([]);
const uniqueQuiz = ref(true);
const generationTime = ref(null)
const seed = ref(null)
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
    { value: 'very-easy', label: 'Very Easy', questionCount: 3, answerUpToLetter: 'C' },
    { value: 'easy', label: 'Easy', questionCount: 5, answerUpToLetter: 'D' },
    { value: 'medium', label: 'Medium', questionCount: 7, answerUpToLetter: 'D' },
    { value: 'hard', label: 'Hard', questionCount: 10, answerUpToLetter: 'E' },
    { value: 'very-hard', label: 'Very Hard', questionCount: 20, answerUpToLetter: 'E' },
    { value: 'insane', label: 'Insane', questionCount: 25, answerUpToLetter: 'F' },
];

const generateQuiz = async () => {
    try {
        let numQuestions = 0
        let answerUpToLetter = 'C'

        if (generationType.value === 'custom') {
            numQuestions = numberOfQuestions.value
            answerUpToLetter = answerUpToLetter.value
        } else if (generationType.value === 'difficulty') {
            numQuestions = difficultyLevels.find((level) => level.value === difficultyLevel.value).questionCount
            answerUpToLetter = difficultyLevels.find((level) => level.value === difficultyLevel.value).answerUpToLetter
        } else if (generationType.value === 'answerList') {
            numQuestions = answerList.value.length
        }

        const response = await fetch('http://127.0.0.1:8000/quizzes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ num_questions: numQuestions, answer_list: answerList.value, answer_up_to_letter: answerUpToLetter }),
        });
        const data = await response.json();
        console.log(data);
        questions.value = data.quiz;
        correctAnswers.value = data.answers;
        uniqueQuiz.value = data.unique_quiz;
        generationTime.value = data.generation_time;
        seed.value = data.seed;
        answers.value = Object.fromEntries(
            data.quiz.map((q: Question) => [q.id, Array(4).fill('unanswered')])
        );
        quizState.value = 'solving';
    } catch (error) {
        console.error('Error generating quiz:', error);
    }
};

const handleAnswer = (questionId: number, optionIndex: number, newState: AnswerState) => {
    if (quizState.value !== 'solving') return;

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
    let numCorrectAnswers = 0;
    questions.value.forEach(question => {
        const selected_answer_idx = answers.value[question.id].indexOf('correct');
        const selected_option = question.options[selected_answer_idx].option;
        const correct_option = correctAnswers.value[question.id - 1];

        if (selected_option === correct_option) {
            numCorrectAnswers++;
        }
    });

    console.log(questions.value);
    console.log(answers.value);

    score.value = numCorrectAnswers;
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
            ? 'Select the correct answers and mark wrong options'
            : 'See how well you did!'
);
</script>

<style></style>