<script setup lang="ts">
import { ref } from "vue";
import { db } from "../../../plugins/firebase";
import { addDoc, collection } from "firebase/firestore";
import SubmitTasks from "../components/SubmitTasksForm.vue";
import { useGenerateTaskQuery } from "../api/useGenerateTaskQuery";

type Task = {
  category: string;
  tasks: string[];
};

type TaskResponse = {
  tasks: Task[];
};

const prompt = ref("");
const isLoading = ref(false);
const selectedTasks = ref<string[]>([]);
const stream = ref<MediaStream | null>(null);
const tasks = ref<TaskResponse | null>(null);
const { generateTasks } = useGenerateTaskQuery();

const findCategoryForTask = (taskText: string): string => {
  if (!tasks.value) return "uncategorized";

  for (const category of tasks.value.tasks) {
    if (category.tasks.includes(taskText)) {
      return category.category;
    }
  }
  return "uncategorized";
};

const saveTasks = async () => {
  try {
    const tasksCollection = collection(db, "tasks");

    // Save each selected task
    const savePromises = selectedTasks.value.map((taskText) => {
      return addDoc(tasksCollection, {
        task: taskText,
        completed: false,
        createdAt: new Date(),
        category: findCategoryForTask(taskText),
      });
    });

    await Promise.all(savePromises);

    // Clear selection after saving
    selectedTasks.value = [];
    console.log("Tasks saved successfully!");
  } catch (error) {
    console.error("Error saving tasks:", error);
  }
};

const toggleTask = (toggledTask: string) => {
  if (selectedTasks.value.includes(toggledTask)) {
    selectedTasks.value = selectedTasks.value.filter(
      (task) => task !== toggledTask
    );
  } else {
    selectedTasks.value.push(toggledTask);
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
            @click="saveTasks"
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
