<script setup>
import EventsList from "./EventsList.vue";
import axiosInstance from "../../../utils/axiosInstance.js";
import { computed, ref, watch } from "vue";
import { useGameStore } from "../../../stores/gameStore.js";
import { useTgTheme } from "../../../composables/tg_theme.js";
import krakenBackgroundDark from "../../../assets/farm-pad/kraken-background-dark.png";
import krakenBackgroundLight from "../../../assets/farm-pad/kraken-background-light.png";
import helikaLogoDark from "../../../assets/helika-logo-dark.svg";
import helikaLogoLight from "../../../assets/helika-logo-light.svg";
import bomb from "../../../assets/bomb.svg";

const gameStore = useGameStore();

const activeEvents = ref([]);
axiosInstance
  .get("/rest/v1/events", {
    params: {
      is_active: "eq.true",
    },
  })
  .then((response) => {
    activeEvents.value = response.data;
  });

const myEvents = ref([]);

const helikaBackground = computed(() => {
  return useTgTheme() === "dark" ? `bg-[url(${krakenBackgroundDark})]` : `bg-[url(${krakenBackgroundLight})]`;
});

const helikaLogo = computed(() => {
  return useTgTheme() === "dark" ? helikaLogoLight : helikaLogoDark;
});

watch(activeEvents, async () => {
  const chatId = (await gameStore.getUserData()).chat_id;

  axiosInstance
    .get("/rest/v1/event_players", {
      params: {
        user: `eq.${chatId}`,
      },
    })
    .then((response) => {
      myEvents.value = activeEvents.value.filter((event) => response.data.some((player) => player.event === event.id));
    });
});

const eventsInProgress = computed(() =>
  activeEvents.value.filter((event) => {
    return new Date(event.start_date) < new Date() && new Date(event.end_date) > new Date();
  }),
);

const upcomingEvents = computed(() =>
  activeEvents.value.filter((event) => {
    return new Date(event.start_date) > new Date();
  }),
);

const finishedEvents = computed(() =>
  activeEvents.value.filter((event) => {
    return new Date(event.end_date) < new Date();
  }),
);
</script>

<template>
  <ul class="events-lists">
    <li class="events-lists__event-list">
      <EventsList :events="activeEvents" :caption="$t('ev_list_1_caption')" :background="helikaBackground">
        <template #heading>
          <div class="flex items-center">
            {{ $t("ev_list_1_heading") }}: {{ activeEvents.length }}
            <!-- <img :src="helikaLogo" class="w-103" /> -->
          </div>
        </template>
      </EventsList>
    </li>
    <li class="events-lists__event-list" v-if="myEvents.length">
      <EventsList :events="myEvents" :caption="$t('ev_list_2_caption')" button-color="rgba(248, 124, 86, 1)">
        <template #heading>{{ $t("ev_list_2_heading") }} {{ myEvents.length }}</template>
      </EventsList>
    </li>
    <li class="events-lists__event-list">
      <EventsList :events="eventsInProgress" :caption="$t('ev_list_3_caption')" button-color="rgba(248, 124, 86, 1)">
        <template #heading>{{ $t("ev_list_2_heading") }} {{ eventsInProgress.length }}</template>
      </EventsList>
    </li>
    <li class="events-lists__event-list">
      <EventsList
        :events="upcomingEvents"
        :caption="$t('ev_list_4_caption')"
        button-color="rgba(84, 155, 248, 1)"
        :icon-path="bomb"
      >
        <template #heading>{{ $t("ev_list_2_heading") }} {{ upcomingEvents.length }}</template>
      </EventsList>
    </li>
    <li class="events-lists__event-list">
      <EventsList :events="finishedEvents" :caption="$t('ev_list_5_caption')" button-color="rgba(0, 0, 0, 1)">
        <template #heading>{{ $t("ev_list_2_heading") }} {{ finishedEvents.length }}</template>
      </EventsList>
    </li>
  </ul>
</template>

<style scoped>
.events-lists {
  width: 100%;
}

.events-lists__event-list {
  margin-bottom: 20px;
}
</style>
