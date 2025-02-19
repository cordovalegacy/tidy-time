<script setup lang="ts">
import { ref } from "vue";
import SubmitTasks from "./SubmitTasks.vue";
import { systemPrompt } from "../../utils/generateTasksSystemPrompt";

type Task = {
  category: string;
  tasks: string[];
};

type TaskResponse = {
  tasks: Task[];
};

const prompt = ref("");
const stream = ref<MediaStream | null>(null);
const isLoading = ref(false);
const tasks = ref<TaskResponse | null>(null);
const selectedTasks = ref<string[]>([]);

const API_KEY = "AIzaSyAPKrAIASBMWDkw3lcB2mOSze4DXikOGv8";
const MODEL_ID = "gemini-pro";

const toggleTask = (toggledTask: string) => {
  if (selectedTasks.value.includes(toggledTask)) {
    selectedTasks.value = selectedTasks.value.filter(
      (task) => task !== toggledTask
    );
  } else {
    selectedTasks.value.push(toggledTask);
  }
};

const generateTasks = async (userPrompt: string) => {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/${MODEL_ID}:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: systemPrompt }, { text: userPrompt }],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            topP: 0.8,
            topK: 40,
            maxOutputTokens: 2048,
          },
        }),
      }
    );

    if (!response.ok) {
      console.error("SOMETHING WENT WRONG", await response.text());
      throw new Error(`API call failed: ${response.statusText}`);
    }

    const data = await response.json();

    const rawJsonText = data.candidates[0].content.parts[0].text;
    const sanitizedJsonText = rawJsonText
      .replace(/```[jJ][sS][oO][nN]/, "")
      .replace(/```/g, "")
      .trim();

    console.log("Cleaned JSON text:", sanitizedJsonText);
    clearPrompt();
    return JSON.parse(sanitizedJsonText) as TaskResponse;
  } catch (error) {
    console.error("Error generating tasks:", error);
    throw error;
  }
};

const unselectTask = (unselectedTask: string) => {
  selectedTasks.value = selectedTasks.value.filter(
    (selectedTasks) => selectedTasks !== unselectedTask
  );
};

const toggleCamera = async () => {
  try {
    if (stream.value) {
      stream.value.getTracks().forEach((track) => track.stop());
      stream.value = null;
      return;
    }

    stream.value = await navigator.mediaDevices.getUserMedia({
      video: true,
    });

    console.log("Camera accessed:", stream.value);
  } catch (error) {
    console.error("Error accessing camera:", error);
  }
};

const toggleMicrophone = async () => {
  try {
    if (stream.value) {
      stream.value.getTracks().forEach((track) => track.stop());
      stream.value = null;
      return;
    }

    stream.value = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });

    console.log("Microphone accessed:", stream.value);
  } catch (error) {
    console.error("Error accessing microphone:", error);
  }
};

const clearPrompt = () => {
  prompt.value = "";
  if (stream.value) {
    stream.value.getTracks().forEach((track) => track.stop());
    stream.value = null;
  }
};

const sendPrompt = async (event: Event) => {
  if (!prompt.value) return;
  event.preventDefault();
  isLoading.value = true;
  try {
    tasks.value = await generateTasks(prompt.value);
    console.log("Generated tasks:", tasks.value);
  } catch (error) {
    console.error("Failed to generate tasks:", error);
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="tasks-container pa-4">
    <template v-if="tasks">
      <div
        v-for="category in tasks.tasks"
        :key="category.category"
        class="mb-6"
      >
        <v-card>
          <v-card-title class="text-capitalize">{{
            category.category
          }}</v-card-title>
          <v-card-text>
            <v-chip-group>
              <v-chip
                v-for="task in category.tasks"
                :key="task"
                :color="selectedTasks.includes(task) ? 'secondary' : undefined"
                :variant="selectedTasks.includes(task) ? 'flat' : 'tonal'"
                class="ma-1"
                :class="{
                  'text-white': selectedTasks.includes(task),
                  'text-high-emphasis': !selectedTasks.includes(task),
                }"
                @click="toggleTask(task)"
              >
                {{ task }}
              </v-chip>
            </v-chip-group>
          </v-card-text>
        </v-card>
      </div>
      <v-sheet
        class="pa-4 text-center mx-auto"
        elevation="12"
        rounded="lg"
        width="100%"
        v-show="selectedTasks.length > 0"
      >
        <h2 class="text-h5 mb-6">These tasks will be added to your list</h2>
        <v-chip-group>
          <v-chip
            v-for="selectedTask in selectedTasks"
            :key="selectedTask + 'key'"
            class="ma-1"
            :class="{
              'text-white': selectedTasks.includes(selectedTask),
              'text-high-emphasis': !selectedTasks.includes(selectedTask),
            }"
            @click="unselectTask(selectedTask)"
          >
            {{ selectedTask }}
          </v-chip>
        </v-chip-group>
        <v-divider class="mb-4"></v-divider>
        <div class="text-end">
          <v-btn
            class="text-none"
            color="primary"
            variant="flat"
            width="90"
            rounded
          >
            Save
          </v-btn>
        </div>
      </v-sheet>
    </template>
  </div>
  <!-- If you want to use v-model in a child, you can only do so by using emits -->
  <!-- To avoid using emits, I am doing separate implementations of value and onInput (long hand of v-model) -->
  <submit-tasks
    :value="prompt"
    :is-loading="isLoading"
    :send-prompt="sendPrompt"
    :clear-prompt="clearPrompt"
    :toggle-camera="toggleCamera"
    :toggle-microphone="toggleMicrophone"
    :on-input="(value: string) => prompt = value"
  ></submit-tasks>
</template>

<style scoped>
.tasks-container {
  margin-bottom: 80px;
  overflow-y: auto;
  max-height: calc(100vh - 80px);
}

.input-form {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: var(--v-theme-surface);
  padding: 8px;
  z-index: 100;
}

:deep(.v-main) {
  padding-bottom: 80px !important;
}

/* :deep is a vue specific selector that lets you style at the scoped child element level */
:deep(.v-chip) {
  /* & is a css parent reference selector */
  &.text-high-emphasis {
    color: rgb(var(--v-theme-on-surface)) !important;
    background-color: rgba(var(--v-theme-surface-variant), 0.1);
  }

  &.text-white {
    color: white !important;
    background-color: rgb(var(--v-theme-secondary));
  }
}
</style>
