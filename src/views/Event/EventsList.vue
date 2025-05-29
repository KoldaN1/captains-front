<script setup>
import EventsPageSwitch from "../../components/Event/EventsPageSwitch.vue";
import EventsLists from "../../components/Event/EventsList/EventsLists.vue";
import { useRouter } from "vue-router";
import { ref } from "vue";
import Navigator from "../../components/Navigator/Navigator.vue";
import { useGameStore } from "../../stores/gameStore.js";
import { useEventsStore } from "../../stores/events.js";
import ButtonTutorial from "../../components/ButtonTutorial/ButtonTutorial.vue";
import addCircle from "../../assets/add-circle.svg";

const router = useRouter();

const eventsStore = useEventsStore();

const activePage = ref(eventsStore.eventPage);

function switchPage(page) {
  router.push({ name: "EVENTS", query: { page } });
  activePage.value = page;
}

const { gameData } = useGameStore();

const goToInstructionPage = () => {
  if (activePage.value === "events") {
    router.push({ name: "PARTICIPATION_TUTORIAL_EVENTS" });

    return;
  }

  router.push({ name: "PARTICIPATION_TUTORIAL_AIRDROP" });
};
</script>

<template>
  <div class="events-list">
    <div class="events-list__intro">
      <h1>Captains Bay FarmPAD</h1>
      <p>Discover FarmPAD – Token farming reinvented. Don’t buy — Farm!</p>
    </div>
    <EventsPageSwitch class="events-list__switch" :value="activePage" @pageSwitched="switchPage" />
    <div class="w-full px-4">
      <ButtonTutorial
        :text="$t('event_instruction_title')"
        background="#000000"
        :img-url="addCircle"
        class="mt-4"
        @click="goToInstructionPage"
      />
    </div>
    <EventsLists v-if="activePage === 'events'" class="mt-6" />
    <Navigator
      :uncompleted_tasks="gameData?.uncompleted_tasks > 0"
      page="FARMPAD"
      :mining_status="gameData?.mining_status"
    />
  </div>
</template>

<style scoped>
.events-list {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: "Open Sans", sans-serif;
  padding-bottom: 85px;
}

.events-list__intro {
  max-width: 90%;
  text-align: center;
  margin-bottom: 40px;
  padding: 15px;

  h1 {
    font-size: 28px;
    font-weight: 700;
  }
}
</style>
