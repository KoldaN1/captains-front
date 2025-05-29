<script setup>
import bigReward from "../../assets/big-reward.svg";
import Ship from "../Index/Ship.vue";
import tutorialShip from "../../assets/ship.svg";
import { useEventsStore } from "../../stores/events.js";
import { getCurrentInstance, computed } from "vue";

const eventsStore = useEventsStore();
const { proxy } = getCurrentInstance();

const info = computed(() => {
  return eventsStore.eventPage === "events"
    ? proxy.$t("participationTutorial.info.farmPad")
    : proxy.$t("participationTutorial.info.airDrop");
});
</script>

<template>
  <div class="px-4">
    <p>{{ info }}</p>
    <div class="img-wrapper" v-if="eventsStore.eventPage === 'events'">
      <img :src="bigReward" alt="big-reward" class="mt-8" />
    </div>
    <Ship :ship="tutorialShip" class="justify-self-center mt-8" v-else />
  </div>
</template>

<style scoped>
.img-wrapper {
  display: flex;
  justify-content: center;
}
</style>
