<script setup lang="ts">
defineProps<{ toggleNavDrawer: () => void }>();
</script>
<template>
  <v-app-bar class="text-keyword-color bg-background pr-16">
    <v-spacer class="hidden-xs"></v-spacer>
    <template v-slot:prepend>
      <v-app-bar-nav-icon @click="toggleNavDrawer"></v-app-bar-nav-icon>
    </template>
    <v-app-bar-title
      class="text-white font-weight-medium header-font text-no-wrap"
    >
      Tidy Time
      <v-icon
        icon="mdi-creation"
        class="ml-2 text-keyword-color hidden-xs"
      ></v-icon>
    </v-app-bar-title>
    <v-spacer class="hidden-xs"></v-spacer>
  </v-app-bar>
</template>
<style scoped>
.v-app-bar {
  flex-grow: 1;
}
</style>
