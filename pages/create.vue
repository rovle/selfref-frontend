<template>
  <div class="sm:px-4 pt-10">
    <!-- Save Quiz Modal -->
    <SaveQuizModal
      :show="showSaveModal"
      :quiz-id="quizId"
      :answers="answers"
      :completed="allCorrect"
      @close="showSaveModal = false"
    />
    <div
      class="relative mx-auto max-w-4xl xl:max-w-6xl 2xl:max-w-7xl border-black/10 sm:border dark:border-white/20 text-black dark:text-white rounded-md"
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
                      difficulty level or customize it yourself.
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
                      id="showcase"
                      value="showcase"
                      name="generationType"
                      title="Showcase Quizzes"
                      description="Play handcrafted puzzles from our collection."
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

            <div v-if="generationType === 'showcase'">
              <h3
                class="mb-5 text-lg font-medium text-neutral-900 dark:text-white"
              >
                Select a Showcase Quiz
              </h3>
              <div v-if="!showcaseQuizzes.length" class="text-center py-8">
                <p class="text-neutral-500 dark:text-neutral-400">Loading showcase quizzes...</p>
              </div>
              <div v-else class="grid gap-4 md:grid-cols-2">
                <div
                  v-for="quiz in showcaseQuizzes"
                  :key="quiz.curated_id"
                  @click="selectedShowcaseId = quiz.curated_id"
                  class="p-4 border rounded-lg cursor-pointer transition-all"
                  :class="selectedShowcaseId === quiz.curated_id
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                    : 'border-neutral-200 dark:border-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-500'"
                >
                  <h4 class="font-semibold text-neutral-900 dark:text-white">{{ quiz.title }}</h4>
                  <p class="text-sm text-neutral-600 dark:text-neutral-400 mt-1">{{ quiz.description }}</p>
                  <div class="mt-2 inline-flex items-center gap-2">
                    <span
                      class="px-2 py-1 text-xs rounded-full"
                      :class="{
                        'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200': quiz.difficulty === 'easy',
                        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200': quiz.difficulty === 'medium',
                        'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200': quiz.difficulty === 'hard'
                      }"
                    >
                      {{ quiz.difficulty }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="generationType === 'custom'" class="space-y-6">
              <h3
                class="mb-5 text-lg font-medium text-neutral-900 dark:text-white"
              >
                Custom Quiz
              </h3>

              <!-- Basic Settings -->
              <div class="grid max-w-screen-md gap-4 sm:grid-cols-2">
                <div>
                  <label
                    for="questionCount"
                    class="mb-2 inline-block text-sm font-semibold text-black dark:text-white sm:text-base"
                    >Number of questions: {{ numberOfQuestions }}</label
                  >
                  <input
                    id="questionCount"
                    type="range"
                    min="2"
                    max="100"
                    v-model.number="numberOfQuestions"
                    class="w-full h-2 bg-neutral-200 dark:bg-neutral-700 rounded-lg appearance-none cursor-pointer"
                  />
                  <div class="flex justify-between text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                    <span>2</span>
                    <span>25</span>
                    <span>50</span>
                    <span>75</span>
                    <span>100</span>
                  </div>
                </div>
                <div>
                  <label
                    for="answerUpToLetter"
                    class="mb-2 inline-block text-sm font-semibold text-black dark:text-white sm:text-base"
                    >Answers can be up to letter: {{ answerUpToLetter }}</label
                  >
                  <input
                    id="answerUpToLetter"
                    type="range"
                    min="1"
                    max="13"
                    v-model.number="answerUpToLetterIndex"
                    class="w-full h-2 bg-neutral-200 dark:bg-neutral-700 rounded-lg appearance-none cursor-pointer"
                  />
                  <div class="flex justify-between text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                    <span>B</span>
                    <span>E</span>
                    <span>H</span>
                    <span>K</span>
                    <span>N</span>
                  </div>
                </div>
              </div>

              <!-- Question Types Section (Expandable) -->
              <div class="border border-neutral-200 dark:border-neutral-700 rounded-md">
                <button
                  @click="questionTypesExpanded = !questionTypesExpanded"
                  class="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                >
                  <div class="flex items-center gap-2">
                    <span class="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                      Question Types Configuration
                    </span>
                    <span v-if="enabledQuestionCount > 0" class="px-2 py-0.5 text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full">
                      {{ enabledQuestionCount }} enabled
                    </span>
                  </div>
                  <Icon
                    :name="questionTypesExpanded ? 'mdi:chevron-up' : 'mdi:chevron-down'"
                    size="20"
                    class="text-neutral-500 dark:text-neutral-400"
                  />
                </button>
                <div v-if="questionTypesExpanded" class="p-4 border-t border-neutral-200 dark:border-neutral-700">
                  <div v-if="!quizConfigLoaded" class="text-center py-8">
                    <p class="text-neutral-500 dark:text-neutral-400">Loading question types...</p>
                  </div>
                  <div v-else class="space-y-4">
                    <!-- Controls -->
                    <div class="flex flex-wrap gap-2 mb-4">
                      <button
                        @click="quizConfig.enableAll()"
                        class="px-3 py-1 text-sm bg-green-500 hover:bg-green-600 text-black rounded-md"
                      >
                        Enable All
                      </button>
                      <button
                        @click="quizConfig.disableAll()"
                        class="px-3 py-1 text-sm bg-red-500 hover:bg-red-600 text-white rounded-md"
                      >
                        Disable All
                      </button>
                      <button
                        @click="randomizeWeights()"
                        class="px-3 py-1 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-md"
                      >
                        Randomize Weights
                      </button>
                    </div>

                    <!-- Question Types Grid -->
                    <div class="grid grid-cols-3 gap-3">
                      <div
                        v-for="qType in quizConfig.availableQuestionTypes.value"
                        :key="qType.name"
                        class="border border-neutral-200 dark:border-neutral-700 rounded-md p-2"
                      >
                        <div class="flex items-start gap-2">
                          <!-- Checkbox -->
                          <input
                            type="checkbox"
                            :id="`qt-${qType.name}`"
                            :checked="quizConfig.config.value.question_types[qType.name]?.enabled"
                            @change="quizConfig.toggleQuestionType(qType.name)"
                            class="mt-1 w-4 h-4 text-green-600 rounded border-neutral-300 focus:ring-green-500 flex-shrink-0"
                          />

                          <!-- Content -->
                          <div class="flex-1 min-w-0">
                            <label
                              :for="`qt-${qType.name}`"
                              class="block text-xs font-medium text-neutral-900 dark:text-neutral-100 cursor-pointer leading-tight"
                            >
                              {{ qType.display_name }}
                            </label>

                            <!-- Example Question -->
                            <p class="text-[10px] text-neutral-500 dark:text-neutral-400 mt-1 line-clamp-2 italic">
                              "{{ questionExamples[qType.name] || qType.display_name }}"
                            </p>

                            <!-- Weight Slider (only show if enabled) -->
                            <div v-if="quizConfig.config.value.question_types[qType.name]?.enabled" class="mt-2">
                              <div class="flex items-center gap-1">
                                <label class="text-[10px] text-neutral-600 dark:text-neutral-400">
                                  Weight:
                                </label>
                                <input
                                  type="range"
                                  min="0.1"
                                  max="10"
                                  step="0.1"
                                  :value="quizConfig.config.value.question_types[qType.name].weight"
                                  @input="quizConfig.updateQuestionWeight(qType.name, parseFloat($event.target.value))"
                                  class="flex-1 h-1 bg-neutral-200 dark:bg-neutral-700 rounded-lg appearance-none cursor-pointer"
                                />
                                <span class="text-[10px] text-neutral-600 dark:text-neutral-400 w-8 text-right">
                                  {{ quizConfig.config.value.question_types[qType.name].weight.toFixed(1) }}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Advanced Settings Section (Expandable) -->
              <div class="border border-neutral-200 dark:border-neutral-700 rounded-md">
                <button
                  @click="advancedExpanded = !advancedExpanded"
                  class="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                >
                  <span class="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                    Advanced Settings
                  </span>
                  <Icon
                    :name="advancedExpanded ? 'mdi:chevron-up' : 'mdi:chevron-down'"
                    size="20"
                    class="text-neutral-500 dark:text-neutral-400"
                  />
                </button>
                <div v-if="advancedExpanded" class="p-4 border-t border-neutral-200 dark:border-neutral-700 space-y-4">
                  <div>
                    <label class="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        v-model="quizConfig.config.value.aesthetic_numbers_mode"
                        class="w-4 h-4 text-green-600 rounded border-neutral-300 focus:ring-green-500"
                      />
                      <span class="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                        Aesthetic Numbers Mode
                      </span>
                    </label>
                    <p class="mt-1 ml-7 text-xs text-neutral-500 dark:text-neutral-400">
                      When enabled, questions with numeric answers will only be generated if the answer options form an ascending or descending sequence (e.g., 1, 2, 3 or 5, 4, 3).
                    </p>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-neutral-900 dark:text-neutral-100 mb-2">
                      Direction Cutoff: {{ (quizConfig.config.value.direction_cutoff * 100).toFixed(0) }}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      v-model.number="quizConfig.config.value.direction_cutoff"
                      class="w-full h-2 bg-neutral-200 dark:bg-neutral-700 rounded-lg appearance-none cursor-pointer"
                    />
                    <p class="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                      Controls when directional questions (preceding/following) can appear in the quiz
                    </p>
                  </div>

                  <!-- Presets Section -->
                  <div class="border-t border-neutral-200 dark:border-neutral-700 pt-4">
                    <h4 class="text-sm font-medium text-neutral-900 dark:text-neutral-100 mb-3">
                      Configuration Presets
                    </h4>
                    <div class="space-y-3">
                      <!-- Save Preset -->
                      <div class="flex gap-2">
                        <input
                          v-model="presetName"
                          placeholder="Enter preset name"
                          class="flex-1 px-3 py-1 text-sm rounded-md bg-white dark:bg-neutral-700 text-black dark:text-white border border-neutral-200 dark:border-neutral-600 focus:border-neutral-800 dark:focus:border-neutral-200 focus:outline-none"
                        />
                        <button
                          @click="savePreset"
                          :disabled="!presetName || !quizConfig.hasEnabledQuestions.value"
                          class="px-3 py-1 text-sm bg-blue-500 hover:bg-blue-600 disabled:bg-neutral-300 disabled:cursor-not-allowed text-white rounded-md"
                        >
                          Save Preset
                        </button>
                      </div>

                      <!-- Load Preset -->
                      <div v-if="savedPresets.length > 0" class="space-y-2">
                        <p class="text-xs text-neutral-600 dark:text-neutral-400">Saved Presets:</p>
                        <div class="flex flex-wrap gap-2">
                          <div
                            v-for="preset in savedPresets"
                            :key="preset"
                            class="flex items-center gap-1 px-2 py-1 bg-neutral-100 dark:bg-neutral-800 rounded"
                          >
                            <button
                              @click="loadPreset(preset)"
                              class="text-xs text-neutral-700 dark:text-neutral-300 hover:text-green-600 dark:hover:text-green-400"
                            >
                              {{ preset }}
                            </button>
                            <button
                              @click="deletePreset(preset)"
                              class="ml-1 text-red-500 hover:text-red-600"
                            >
                              <Icon name="mdi:close" size="14" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
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
                Hide options marked as wrong
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
                          class="flex px-2 py-2 border bg-neutral-100 dark:bg-neutral-900"
                          :class="{
                            'border-red-400 bg-red-500/80 dark:bg-red-600/30 dark:border-red-950 text-neutral-900 dark:text-white':
                              answers[question.id][index] === 'incorrect',
                            'text-neutral-600 dark:text-neutral-500 dark:border-neutral-950':
                              answers[question.id][index] === 'correct',
                            'text-neutral-600 dark:text-neutral-400 dark:border-neutral-950':
                              answers[question.id][index] === 'unanswered',
                            'hover:bg-red-500 hover:text-black dark:hover:bg-red-800/90 dark:hover:text-white': canMarkAsIncorrect(question.id, index),
                            'opacity-50 cursor-not-allowed': !canMarkAsIncorrect(question.id, index),
                          }"
                          :disabled="!canMarkAsIncorrect(question.id, index)"
                          :title="!canMarkAsIncorrect(question.id, index) ? 'Cannot mark all options as incorrect' : ''"
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

      </div>


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
        class="flex justify-between items-center gap-3 mt-3 px-6 pb-6"
      >
        <div class="flex gap-3">
          <button
            @click="goBack"
            class="flex items-center bg-neutral-900 dark:bg-white text-white dark:text-black font-medium text-sm px-4 py-2 hover:bg-black/90 dark:hover:bg-white/90 rounded-md"
          >
            <Icon name="mdi:arrow-left" class="w-4 h-4 mr-2" />
            {{ allCorrect ? 'New Quiz' : 'Go Back' }}
          </button>
          <button
            v-if="!allCorrect"
            @click="resetQuiz"
            class="flex items-center bg-neutral-900 dark:bg-white text-white dark:text-black font-medium text-sm px-4 py-2 hover:bg-black/90 dark:hover:bg-white/90 rounded-md"
          >
            Reset
          </button>
          <button
            v-if="allCorrect"
            @click="retryQuiz"
            class="flex items-center bg-neutral-900 dark:bg-white text-white dark:text-black font-medium text-sm px-4 py-2 hover:bg-black/90 dark:hover:bg-white/90 rounded-md"
          >
            Try Again
          </button>
          <button
            @click="showSaveModal = true"
            class="flex items-center bg-blue-500 hover:bg-blue-600 text-white font-medium text-sm px-4 py-2 rounded-md"
          >
            <Icon name="mdi:content-save" class="w-4 h-4 mr-2" />
            Share / Save Progress
          </button>
        </div>

        <!-- Inline message between buttons -->
        <div class="flex-1 flex justify-center">
          <transition
            enter-active-class="transition-all duration-300 ease-out"
            enter-from-class="opacity-0 scale-95"
            enter-to-class="opacity-100 scale-100"
            leave-active-class="transition-all duration-1000 ease-in-out"
            leave-from-class="opacity-100 scale-100"
            leave-to-class="opacity-0 scale-95"
          >
            <div
              v-if="showMessage"
              :class="{
                'px-4 py-2 rounded-md text-sm font-medium': true,
                'text-green-800 bg-green-100 dark:text-green-400 dark:bg-green-900': messageType === 'success',
                'text-red-800 bg-red-100 dark:text-red-400 dark:bg-red-900': messageType === 'error',
                'text-yellow-800 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900': messageType === 'warning'
              }"
              role="alert"
            >
              {{ message }}
            </div>
          </transition>
        </div>

        <div class="flex">
          <button
            v-if="!allCorrect"
            @click="submitQuiz"
            class="bg-green-500 hover:bg-green-600 text-black font-medium text-sm px-4 py-2 rounded-md"
          >
            Submit
          </button>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import RadioCardCompact from '~/components/RadioCardCompact.vue'
import SaveQuizModal from '~/components/SaveQuizModal.vue'
import { useQuizConfig } from '~/composables/useQuizConfig'

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
type QuizState = 'typeSelection' | 'setup' | 'solving'
type AnswerState = 'unanswered' | 'correct' | 'incorrect'
type GenerationType = 'difficulty' | 'custom' | 'showcase'
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
const answerUpToLetter = ref('C')
const showcaseQuizzes = ref<any[]>([])
const selectedShowcaseId = ref<string | null>(null)

// For the letter slider - B=1, C=2, ..., N=13
const letterOptions = ['B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N']
const answerUpToLetterIndex = computed({
  get: () => letterOptions.indexOf(answerUpToLetter.value) + 1,
  set: (value: number) => {
    answerUpToLetter.value = letterOptions[value - 1] || 'C'
  }
})
const questions = ref<Question[]>([])

// Custom quiz configuration
const quizConfig = useQuizConfig()
const quizConfigLoaded = ref(false)
const presetName = ref('')
const savedPresets = ref<string[]>([])
const questionTypesExpanded = ref(false)
const advancedExpanded = ref(false)

// Example questions for each question type
const questionExamples: Record<string, string> = {
  'First question with answer [X]?': 'The first question with answer B is question',
  'Only question with answer [X]?': 'The only question with answer C is question',
  'Last question with answer [X]?': 'The last question with answer A is question',
  'Answer to question(s) [X_1], ..., [X_n]?': 'The answer to questions 2, 5, and 7 is',
  'Number of questions with answer [X]?': 'The number of questions with answer D is',
  'Answer that appears most often is': 'The answer that appears most often is',
  'Answer that appears least often is': 'The answer that appears least often is',
  'Only [n] consecutive questions with answer [X]?': 'The only 3 consecutive questions with the answer B are',
  'Only [n] consecutive questions with same answer?': 'The only 2 consecutive questions with the same answer',
  'Answer to question [X_1] is same as answer to question?': 'Question 4 has the same answer as exactly one of the listed questions - which one?',
  'No answer appears exactly what number of times?': 'No answer appears exactly what number of times?',
  'Alphabetical distance between this and previous/next answer?': 'Alphabetically, the answer to this question and the answer to the following question are',
  'First next / last previous question with the same answer as this one?': 'The first question after this one with the same answer as this one is',
  'Only answer that appears exactly [n] times?': 'What is the only answer that appears exactly 3 times?',
  'Number with answer is [X] equal to number with answer?': 'Number of questions with the answer A is equal to number of questions with which single answer?',
  'Only letter which answers the same number of [property_1] and [property_2] questions': 'The only letter which answers the same number of even-numbered questions as odd-numbered questions is',
  'Only letter where the number of times it happens is [property]?': 'The only answer which appears an odd number of times is',
  'Subtract amount before of answer [X], add after, result?': 'Number of questions before this one answered by B, minus the number of those after this one answered by C, is equal to',
  'Closest question with same answer as this one is how many away?': 'The closest question with the same answer as this one is',
  'Closest question with answer [X] is how many away?': 'The closest question answered by E, not counting this one if it is, is',
  'All among [X_1], ..., [X_n] are either [A_1] or [A_2], what is odd one?': 'Questions 3, 6, 8, and 9 are all answered by A or B (not necessarily all the same one), except for one - which one?',
  'Sum of all the questions with answer [X]?': 'The sum of the question numbers with answer C is'
}

// Get route for checking shared quiz
const route = useRoute()
const router = useRouter()

// Load configuration on mount
onMounted(async () => {
  await quizConfig.loadQuestionTypes()
  quizConfigLoaded.value = true
  savedPresets.value = quizConfig.getSavedPresets()

  // Load showcase quizzes
  try {
    const response = await fetch(`${apiUrl}/api/curated-quizzes`)
    const data = await response.json()
    showcaseQuizzes.value = data.quizzes || []
  } catch (error) {
    console.error('Failed to load showcase quizzes:', error)
  }

  // Check if we're loading a shared quiz (with null safety)
  if (route && route.query && route.query.load && route.query.share) {
    await loadSharedQuiz(route.query.load as string, route.query.share as string)

    // Check if there's saved state to restore
    if (route.query.state) {
      const savedState = sessionStorage.getItem('loadedState')
      if (savedState) {
        try {
          const stateData = JSON.parse(savedState)
          if (stateData.answers) {
            // Convert string keys to numbers for answer IDs
            const convertedAnswers: Record<number, AnswerState[]> = {}
            for (const [key, value] of Object.entries(stateData.answers)) {
              convertedAnswers[parseInt(key)] = value as AnswerState[]
            }
            answers.value = convertedAnswers
            allCorrect.value = stateData.completed || false
          }
          sessionStorage.removeItem('loadedState')
        } catch (err) {
          console.error('Failed to restore state:', err)
        }
      }
    }
  }
})

const enabledQuestionCount = computed(() => {
  return quizConfig.enabledQuestionTypes.value.length
})

const savePreset = () => {
  if (presetName.value && quizConfig.hasEnabledQuestions.value) {
    quizConfig.savePreset(presetName.value)
    savedPresets.value = quizConfig.getSavedPresets()
    presetName.value = ''
  }
}

const loadPreset = (name: string) => {
  quizConfig.loadPreset(name)
}

const deletePreset = (name: string) => {
  quizConfig.deletePreset(name)
  savedPresets.value = quizConfig.getSavedPresets()
}

const randomizeWeights = () => {
  for (const qType of quizConfig.availableQuestionTypes.value) {
    if (quizConfig.config.value.question_types[qType.name]?.enabled) {
      const randomWeight = Math.random() * 9.9 + 0.1 // 0.1 to 10
      quizConfig.updateQuestionWeight(qType.name, parseFloat(randomWeight.toFixed(1)))
    }
  }
}
const answers = ref<Record<number, AnswerState[]>>({})
const quizId = ref<string | null>(null)
const shareId = ref<string | null>(null)
const allCorrect = ref(false)
const messageType = ref<'success' | 'error' | 'warning'>('error')
const uniqueQuiz = ref(true)
const generationTime = ref<number | null>(null)
const seed = ref(null)
const wrongOptionsHidden = ref(false)
const showSaveModal = ref(false)

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
    let response

    if (generationType.value === 'showcase') {
      // Generate from showcase/curated quiz
      if (!selectedShowcaseId.value) {
        showNotification('Please select a showcase quiz', 'warning', 3000)
        return
      }

      response = await fetch(`${apiUrl}/quizzes/from-curated/${selectedShowcaseId.value}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
    } else {
      // Original generation logic
      let numQuestions = 0
      let answerUpTo = 'C'

      if (generationType.value === 'custom') {
        numQuestions = numberOfQuestions.value
        answerUpTo = answerUpToLetter.value

        // Validate custom config if question types are selected
        if (!quizConfig.hasEnabledQuestions.value) {
          showNotification('Please select at least one question type in the Question Types section below', 'warning', 5000)
          questionTypesExpanded.value = true // Auto-expand to guide user
          return
        }
      } else if (generationType.value === 'difficulty') {
        const level = difficultyModes.find(
          (level) => level.value === difficultyLevel.value
        )
        if (level) {
          numQuestions = level.questionCount
          answerUpTo = level.answerUpToLetter
        }
      }

      response = await fetch(`${apiUrl}/quizzes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          num_questions: numQuestions,
          answer_up_to_letter: answerUpTo,
          custom_config: generationType.value === 'custom' && quizConfig.hasEnabledQuestions.value
            ? quizConfig.config.value
            : null,
        }),
      })
    }

    if (!response.ok) {
      const errorData = await response.json()

      // Handle specific error types
      if (errorData.detail) {
        const detail = errorData.detail

        if (detail.error === 'generation_timeout' || detail.error === 'generation_failed') {
          showNotification(`${detail.message}\n\n${detail.suggestion}`, 'error', 10000) // Show for 10 seconds due to longer message

          // Auto-expand question types section for custom quizzes
          if (generationType.value === 'custom') {
            questionTypesExpanded.value = true
          }
        } else {
          showNotification(detail.message || 'Failed to generate quiz. Please try again.', 'error', 5000)
        }
      } else {
        showNotification('Failed to generate quiz. Please try different parameters.', 'error', 5000)
      }
      return
    }

    const data = await response.json()
    console.log(data)
    quizId.value = data.quiz_id
    shareId.value = data.share_id
    questions.value = data.questions
    generationTime.value = data.generation_time
    seed.value = data.seed
    answers.value = Object.fromEntries(
      data.questions.map((q: Question) => [
        q.id,
        Array(q.options.length).fill('unanswered'),
      ])
    )
    quizState.value = 'solving'

    // Update URL to include the quiz share_id for browser history
    await router.replace({
      path: '/create',
      query: {
        load: data.quiz_id,
        share: data.share_id
      }
    })

    // User state is now only loaded through explicit share links
  } catch (error) {
    console.error('Error generating quiz:', error)
    showNotification('An unexpected error occurred. Please check your connection and try again.', 'error', 5000)
  }
}

const canMarkAsIncorrect = (questionId: number, optionIndex: number): boolean => {
  const currentAnswers = answers.value[questionId]

  // If this option is already marked as incorrect, allow toggling
  if (currentAnswers[optionIndex] === 'incorrect') {
    return true
  }

  // Count how many options are not marked as incorrect
  const nonIncorrectCount = currentAnswers.filter(state => state !== 'incorrect').length

  // Prevent marking as incorrect if this is the last non-incorrect option
  return nonIncorrectCount > 1
}

// User state is now managed through explicit save/load via share links only
// No auto-save functionality - users must click the save button

const handleAnswer = (
  questionId: number,
  optionIndex: number,
  newState: AnswerState
) => {
  if (quizState.value !== 'solving') return

  // Don't allow marking as incorrect if it's the last non-incorrect option
  if (newState === 'incorrect' && !canMarkAsIncorrect(questionId, optionIndex)) {
    return
  }

  // Retrieve the current answers for the given question
  const currentAnswers = answers.value[questionId]
  const updatedAnswers = [...currentAnswers]

  const originalState = updatedAnswers[optionIndex]

  // Only mark all options as 'incorrect' when turning ON the correct state
  if (newState === 'correct' && originalState !== 'correct') {
    updatedAnswers.fill('incorrect')
  }

  // Determine the new state for the selected option
  if (originalState === newState) {
    updatedAnswers[optionIndex] = 'unanswered'
  } else {
    updatedAnswers[optionIndex] = newState
  }

  // Check if marking as incorrect would leave only one non-incorrect option
  if (newState === 'incorrect') {
    const nonIncorrectIndices = updatedAnswers
      .map((state, idx) => state !== 'incorrect' ? idx : -1)
      .filter(idx => idx !== -1)

    // If only one option remains that's not marked as incorrect, mark it as correct
    if (nonIncorrectIndices.length === 1) {
      updatedAnswers[nonIncorrectIndices[0]] = 'correct'
    }
  }

  // Update the answers with the new states
  answers.value[questionId] = updatedAnswers

  // State is now only saved through the explicit save button
}

const showMessage = ref(false)
const message = ref('')
const messageTimerRef = ref<ReturnType<typeof setTimeout> | null>(null)

// Centralized message display function with proper timer management
const showNotification = (text: string, type: 'success' | 'error' | 'warning', duration?: number) => {
  // Clear any existing timer to prevent overlap
  if (messageTimerRef.value) {
    clearTimeout(messageTimerRef.value)
    messageTimerRef.value = null
  }

  // Set message properties
  message.value = text
  messageType.value = type
  showMessage.value = true

  // Only set timer if duration is provided (not for success messages)
  if (duration) {
    messageTimerRef.value = setTimeout(() => {
      showMessage.value = false
      messageTimerRef.value = null
    }, duration)
  }
}

const validateAnswers = async () => {
  if (!quizId.value) {
    throw new Error('No quiz ID available')
  }

  const selectedAnswers = questions.value.map((question) => {
    const selectedIdx = answers.value[question.id].indexOf('correct')
    return question.options[selectedIdx].option
  })

  const apiUrl = useRuntimeConfig().public.apiUrl
  const response = await fetch(`${apiUrl}/quizzes/${quizId.value}/check`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ answers: selectedAnswers }),
  })

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Quiz expired or not found')
    }
    throw new Error('Failed to validate answers')
  }

  return await response.json()
}

const submitQuiz = async () => {
  // Check if all questions have been answered
  const unansweredQuestions = questions.value.filter(
    (question) => !answers.value[question.id].includes('correct')
  )

  if (unansweredQuestions.length > 0) {
    const warningText = `Please answer ${
      unansweredQuestions.length === 1 ? 'question' : 'questions'
    } ${unansweredQuestions.map((q) => q.id).join(', ')} before submitting.`
    showNotification(warningText, 'warning', 5000)
    return
  }

  try {
    const result = await validateAnswers()

    if (result.correct) {
      // All answers are correct!
      showNotification("🎉 Congratulations! All answers are correct!", 'success')
      allCorrect.value = true
      // Completed state is saved through the save button
    } else {
      // Some answers are incorrect
      showNotification("At least one answer is incorrect. Keep trying!", 'error', 7000)
    }
  } catch (error) {
    console.error('Error validating answers:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to validate answers. Please try again.'
    showNotification(errorMessage, 'error', 5000)
  }
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
  allCorrect.value = false

  // Clear any active message timer before hiding message
  if (messageTimerRef.value) {
    clearTimeout(messageTimerRef.value)
    messageTimerRef.value = null
  }
  showMessage.value = false
}

const resetQuiz = () => {
  questions.value.forEach((question) => {
    answers.value[question.id] = Array(question.options.length).fill(
      'unanswered'
    )
  })
  allCorrect.value = false

  // Clear any active message timer before hiding message
  if (messageTimerRef.value) {
    clearTimeout(messageTimerRef.value)
    messageTimerRef.value = null
  }
  showMessage.value = false
  quizState.value = 'solving'
}

const retryQuiz = async () => {
  if (!quizId.value) {
    // If no quiz ID, go back to setup
    goBack()
    return
  }

  try {
    const apiUrl = useRuntimeConfig().public.apiUrl
    const response = await fetch(`${apiUrl}/quizzes/${quizId.value}`)

    if (!response.ok) {
      if (response.status === 404) {
        showNotification('Quiz has expired. Please generate a new one.', 'error', 3000)
        setTimeout(() => goBack(), 3000) // Keep navigation delay
        return
      }
      throw new Error('Failed to retrieve quiz')
    }

    const data = await response.json()
    questions.value = data.questions
    resetQuiz()
  } catch (error) {
    console.error('Error retrieving quiz:', error)
    showNotification('Failed to retrieve quiz. Please generate a new one.', 'error', 3000)
    setTimeout(() => goBack(), 3000) // Keep navigation delay
  }
}

const toggleWrongOptions = () => {
  wrongOptionsHidden.value = !wrongOptionsHidden.value
}

const loadSharedQuiz = async (loadQuizId: string, loadShareId: string) => {
  try {
    const apiUrl = useRuntimeConfig().public.apiUrl
    const response = await fetch(`${apiUrl}/quizzes/${loadQuizId}`)

    if (!response.ok) {
      console.error('Failed to load shared quiz')
      return
    }

    const data = await response.json()

    // Load the quiz data
    quizId.value = loadQuizId
    shareId.value = loadShareId
    questions.value = data.questions
    seed.value = data.seed

    // Initialize answers array
    answers.value = Object.fromEntries(
      data.questions.map((q: Question) => [
        q.id,
        Array(q.options.length).fill('unanswered'),
      ])
    )

    // Jump directly to solving state
    quizState.value = 'solving'
  } catch (error) {
    console.error('Error loading shared quiz:', error)
  }
}

const cardTitle = computed(() => {
  switch (quizState.value) {
    case 'typeSelection':
      return 'Create your quiz'
    case 'setup':
      return 'Create your quiz'
    case 'solving':
      return allCorrect.value ? '🎉 Quiz Completed!' : 'Solve the quiz'
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
      return allCorrect.value
        ? 'You solved it! Try another quiz or retry this one.'
        : 'Select the correct answer for each question'
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
