import "./style.css";
import "./plugins/firebase"
import App from "./App.vue";
import { createApp } from "vue";
import vuetify from "./plugins/vuetify";
import { router } from "./plugins/router";
import { VueQueryPlugin as tanstackQuery } from "@tanstack/vue-query";

createApp(App).use(vuetify).use(router).use(tanstackQuery).mount("#app");