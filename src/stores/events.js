import { defineStore } from "pinia";
import { ref } from "vue";
import { useRoute } from "vue-router";

export const useEventsStore = defineStore("eventsStore", () => {
  const route = useRoute();

  const eventPage = ref(route.query.page || "events");

  const setEventPage = (page) => {
    eventPage.value = page;
  };

  return {
    eventPage,
    setEventPage,
  };
});
