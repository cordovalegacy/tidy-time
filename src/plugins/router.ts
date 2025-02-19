import Home from "../components/Home.vue";
import Calendar from "../components/Calendar.vue";
import GenerateTasks from "../domains/add-tasks/AddTasks.vue";
import { createWebHistory, createRouter } from "vue-router";

const routes = [
  { path: "/", component: Home },
  { path: "/add-tasks", component: GenerateTasks },
  { path: "/schedule", component: Calendar },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
