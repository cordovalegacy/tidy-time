<script setup lang="ts"></script>
<template>
  <v-navigation-drawer class="text-keyword-color bg-background" temporary>
    <v-list>
      <v-list-item title="Welcome, Tori"></v-list-item>
      <v-divider></v-divider>
      <v-list-item
        link
        to="/"
        title="Dashboard"
        class="text-primary"
        prepend-icon="mdi-view-dashboard"
      ></v-list-item>
      <v-list-item
        link
        to="/add-tasks"
        title="Add Tasks"
        class="text-primary"
        prepend-icon="mdi-plus-box-multiple-outline"
      ></v-list-item>
      <v-list-item
        link
        to="/schedule"
        title="Schedule"
        class="text-primary"
        prepend-icon="mdi-calendar"
      ></v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>
<style scoped></style>
