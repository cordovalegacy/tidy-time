<script setup lang="ts">
import { useDisplay } from "vuetify/lib/framework.mjs";

defineProps<{
  value: string;
  isLoading: boolean;
  clearPrompt: () => void;
  toggleCamera: () => void;
  toggleMicrophone: () => void;
  onInput: (value: string) => void;
  sendPrompt: (event: Event) => void;
}>();

const { mobile } = useDisplay();
</script>

<template>
  <v-form class="input-form" @submit.prevent>
    <v-container class="px-2">
      <v-row>
        <v-col cols="12" class="pa-2">
          <v-text-field
            :value="value"
            @input="(event:Event) => onInput((event.target as HTMLInputElement).value)"
            :append-icon="value ? 'mdi-send' : 'mdi-microphone'"
            :append-inner-icon="mobile ? 'mdi-camera' : undefined"
            clear-icon="mdi-close-circle"
            label="Tell us about your living space"
            type="text"
            variant="filled"
            clearable
            :loading="isLoading"
            :disabled="isLoading"
            @click:append="(event: Event) => (value ? sendPrompt(event) : toggleMicrophone())"
            @click:append-inner="toggleCamera"
            @click:clear="clearPrompt"
            @keyup.enter="(event: Event) => value && sendPrompt(event)"
          ></v-text-field>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>
