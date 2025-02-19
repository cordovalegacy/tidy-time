import Home from "../domains/home/views/HomeView.vue";
import Calendar from "../domains/schedule/components/Calendar.vue";
import GenerateTasks from "../domains/add-tasks/views/AddTasksView.vue";
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
