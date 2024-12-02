import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router";
import HomeView from "../views/HomeView.vue";
import GameView from "../views/GameView.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Home",
    component: HomeView
  },
  {
    path: "/game",
    name: "Game",
    component: GameView
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});
export default router;
