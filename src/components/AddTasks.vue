<script setup lang="ts">
import { ref } from "vue";
import { useDisplay } from "vuetify/lib/framework.mjs";

interface Task {
  category: string;
  tasks: string[];
}

interface TaskResponse {
  tasks: Task[];
}

defineProps();
const prompt = ref("");
const stream = ref<MediaStream | null>(null);
const loading = ref(false);
const tasks = ref<TaskResponse | null>(null);
const selectedTasks = ref<string[]>([]);

const { mobile } = useDisplay();

const API_KEY = "AIzaSyAPKrAIASBMWDkw3lcB2mOSze4DXikOGv8";
const MODEL_ID = "gemini-pro";

const toggleTask = (task: string) => {
  if (selectedTasks.value.includes(task)) {
    selectedTasks.value = selectedTasks.value.filter((t) => t !== task);
  } else {
    selectedTasks.value.push(task);
  }
};

const generateTasks = async (userPrompt: string) => {
  const systemPrompt = `You are a home organization assistant. Generate tasks in JSON format with the following structure:
  {
    "tasks": [
      {
        "category": "monthly chores",
        "tasks": ["task1", "task2"]
      },
      {
        "category": "weekly chores",
        "tasks": ["task1", "task2"]
      },
      {
        "category": "daily chores",
        "tasks": ["task1", "task2"]
      },
      {
        "category": "occasional chores",
        "tasks": ["task1", "task2"]
      }
    ]
  }
  Tasks should be practical, specific, and appropriate for the described living space.`;

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
    console.log("DATA: ", data);

    let jsonText = data.candidates[0].content.parts[0].text;
    jsonText = jsonText
      .replace(/```[jJ][sS][oO][nN]/, "")
      .replace(/```/g, "")
      .trim();

    console.log("Cleaned JSON text:", jsonText);
    clearPrompt();
    return JSON.parse(jsonText) as TaskResponse;
  } catch (error) {
    console.error("Error generating tasks:", error);
    throw error;
  }
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

const sendPrompt = async () => {
  if (!prompt.value) return;

  loading.value = true;
  try {
    tasks.value = await generateTasks(prompt.value);
    console.log("Generated tasks:", tasks.value);
  } catch (error) {
    console.error("Failed to generate tasks:", error);
  } finally {
    loading.value = false;
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
                :color="selectedTasks.includes(task) ? 'primary' : undefined"
                :variant="selectedTasks.includes(task) ? 'elevated' : 'tonal'"
                class="ma-1"
                @click="toggleTask(task)"
              >
                {{ task }}
              </v-chip>
            </v-chip-group>
          </v-card-text>
        </v-card>
      </div>
    </template>
  </div>

  <v-form class="input-form">
    <v-container class="px-2">
      <v-row>
        <v-col cols="12" class="pa-2">
          <v-text-field
            v-model="prompt"
            :append-icon="prompt ? 'mdi-send' : 'mdi-microphone'"
            :append-inner-icon="mobile ? 'mdi-camera' : undefined"
            clear-icon="mdi-close-circle"
            label="Tell us about your living space"
            type="text"
            variant="filled"
            clearable
            :loading="loading"
            :disabled="loading"
            @click:append="() => (prompt ? sendPrompt() : toggleMicrophone())"
            @click:append-inner="toggleCamera"
            @click:clear="clearPrompt"
          ></v-text-field>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
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

:deep(.v-chip) {
  margin: 4px;
}
</style>
