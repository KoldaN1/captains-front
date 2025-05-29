import { createRouter, createWebHistory } from "vue-router";
import Index from "./views/Index/Index.vue";

export default createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/bench",
      component: () => import("./views/Bench/Index.vue"),
      name: "BENCH",
    },
    {
      path: "/quests",
      component: () => import("./views/Quests/Index.vue"),
      name: "QUESTS",
    },
    {
      path: "/",
      component: Index,
      name: "INDEX",
    },
    {
      path: "/frens",
      component: () => import("./views/Frens/Index.vue"),
      name: "FRENS",
    },
    {
      path: "/web3",
      component: () => import("./views/Web3/Index.vue"),
      name: "WEB3",
    },

    {
      path: "/hiring/frens/:id?",
      component: () => import("./views/Hiring/Frens/Index.vue"),
      name: "HIRING_FRENS",
    },
    {
      path: "/hiring/nfts/:id?",
      component: () => import("./views/Hiring/Nfts/Index.vue"),
      name: "HIRING_NFTS",
    },

    {
      path: "/leadboard",
      component: () => import("./views/Leadboard/Index.vue"),
      name: "LEADBOARD",
    },
    {
      path: "/treasure",
      component: () => import("./views/Treasure/Index.vue"),
      name: "TREASURE",
    },
    {
      path: "/about_us",
      component: () => import("./views/AboutUs/Index.vue"),
      name: "ABOUT_US",
    },

    {
      path: "/event/:id?",
      component: () => import("./views/Event/Index.vue"),
      name: "EVENT",
    },

    {
      path: "/platforms",
      component: () => import("./views/FarmPad/Platforms.vue"),
      name: "PLATFORMS",
    },
    {
      path: "/plarform/:id?",
      component: () => import("./views/FarmPad/Index.vue"),
      name: "PLATFORM",
    },
    {
      path: "/join/farmpad",
      component: () => import("./views/FarmPad/Join.vue"),
      name: "JOIN_TO_FARMPAD",
    },
    {
      path: "/events",
      component: () => import("./views/Event/EventsList.vue"),
      name: "EVENTS",
    },
    {
      path: "/onboarding",
      component: () => import("./views/Onboarding/Index.vue"),
      name: "ONBOARDING",
    },
    {
      path: "/participation-tutorial-events",
      component: () => import("./views/ParticipationTutorialEvents/Index.vue"),
      name: "PARTICIPATION_TUTORIAL_EVENTS",
    },
    {
      path: "/participation-tutorial-airdrop",
      component: () => import("./views/ParticipationTutorialAirdrop/index.vue"),
      name: "PARTICIPATION_TUTORIAL_AIRDROP",
    },

    {
      path: "/:catchAll(.*)",
      redirect: "/",
    },
  ],
});
