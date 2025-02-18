<script setup lang="ts">
import { ref } from "vue";
import NavigationBar from "./components/NavigationBar.vue";
import NavigationDrawer from "./components/NavigationDrawer.vue";

const shouldShowNavDrawer = ref(false);

const toggleNavDrawer = () => {
  shouldShowNavDrawer.value = !shouldShowNavDrawer.value;
};
</script>

<template>
  <v-layout class="rounded rounded-md h-screen bg-surface w-100">
    <navigation-drawer v-model="shouldShowNavDrawer"></navigation-drawer>
    <v-main>
      <navigation-bar :toggle-nav-drawer="toggleNavDrawer"></navigation-bar>
      <router-view></router-view>
    </v-main>
  </v-layout>
</template>

<style>
* {
  padding: 0;
  margin: 0;
}

#app {
  padding: 0;
  width: 100%;
  max-width: none;
}

.header-font {
  font-family: "Space Grotesk", sans-serif !important;
  font-weight: 500;
  letter-spacing: 0.5px;
}

.main {
  position: fixed;
  top: 0 !important;
}
</style>
