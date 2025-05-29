<script setup>
import close from "../../assets/close.svg";
import { computed } from "vue";
import { useEventsStore } from "../../stores/events.js";
import TutorialInfo from "../../components/ParticipationTutorial/TutorialInfo.vue";
import { useRouter } from "vue-router";
import TutorialSteps from "../../components/ParticipationTutorial/TutorialSteps.vue";
import TutorialTips from "../../components/ParticipationTutorial/TutorialTips.vue";
import TutorialButtons from "../../components/ParticipationTutorial/TutorialButtons.vue";

const eventsStore = useEventsStore();
const router = useRouter();

const eventName = computed(() => {
  return eventsStore.eventPage === "events" ? "FarmPAD" : "AirDrop";
});
</script>

<template>
  <div>
    <div class="flex justify-center pl-4 pr-4">
      <h1 class="text-[28px] text-center font-[700]">{{ $t("participationTutorial.title") }}</h1>
      <button
        :class="`bg-[#f87c56] w-[40px] h-[40px] rounded-[8px] flex items-center justify-center ml-2`"
        @click="router.push({ name: 'EVENTS' })"
      >
        <img :src="close" alt="close" />
      </button>
    </div>

    <p class="mt-3 text-center">{{ $t("participationTutorial.learnMore") }} {{ eventName }}</p>

    <TutorialInfo class="mt-8" />

    <TutorialSteps class="mt-8" />

    <TutorialTips class="mt-8" />

    <TutorialButtons class="mt-8" />
  </div>
</template>

<style scoped></style>
