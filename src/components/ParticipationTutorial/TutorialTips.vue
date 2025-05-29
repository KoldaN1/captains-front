<script setup>
import { computed, getCurrentInstance, onMounted, ref } from "vue";
import backCoin from "../../assets/back-coin.svg";
import evil from "../../assets/evil.svg";
import backPack from "../../assets/backpack.svg";
import raft from "../../assets/raft.svg";
import skeletonRich from "../../assets/skeleton-rich.svg";
import { useEventsStore } from "../../stores/events.js";

const { proxy } = getCurrentInstance();

const eventsStore = useEventsStore();

const tips = ref([]);

const eventPage = computed(() => {
  return eventsStore.eventPage === "events" ? "FarmPAD" : "AirDrop";
});

onMounted(() => {
  const farmPadItems = ref([
    {
      id: 1,
      icon: backCoin,
      alt: "back-coin",
      title: proxy.$t("participationTutorial.tips.farmPad.tip1.title"),
      text: proxy.$t("participationTutorial.tips.farmPad.tip1.text"),
    },
    {
      id: 2,
      icon: evil,
      alt: "evil",
      title: proxy.$t("participationTutorial.tips.farmPad.tip2.title"),
      text: proxy.$t("participationTutorial.tips.farmPad.tip2.text"),
    },
    {
      id: 3,
      icon: backPack,
      alt: "backpack",
      title: proxy.$t("participationTutorial.tips.farmPad.tip3.title"),
      text: proxy.$t("participationTutorial.tips.farmPad.tip3.text"),
    },
  ]);
  const airDropItems = ref([
    {
      id: 1,
      icon: evil,
      alt: "back-coin",
      title: proxy.$t("participationTutorial.tips.airDrop.tip1.title"),
      text: proxy.$t("participationTutorial.tips.airDrop.tip1.text"),
    },
    {
      id: 2,
      icon: raft,
      alt: "evil",
      title: proxy.$t("participationTutorial.tips.airDrop.tip2.title"),
      text: proxy.$t("participationTutorial.tips.airDrop.tip2.text"),
    },
    {
      id: 3,
      icon: skeletonRich,
      alt: "backpack",
      title: proxy.$t("participationTutorial.tips.airDrop.tip3.title"),
      text: proxy.$t("participationTutorial.tips.airDrop.tip3.text"),
    },
  ]);

  tips.value = eventPage.value === "FarmPAD" ? farmPadItems.value : airDropItems.value;
});
</script>

<template>
  <div class="px-4">
    <h2 class="text-[28px] text-center font-[700]">{{ $t("participationTutorial.tips.title") }}</h2>

    <div v-for="tip in tips" class="bg-secondary_bg_color p-4 rounded-[20px] mt-[10px]" :key="tip.id">
      <div class="grid grid-cols-[max-content_1fr] gap-4 items-center">
        <img :src="tip.icon" :alt="tip.alt" class="w-[73px] h-[73px]" />
        <div>
          <h4 class="font-semibold uppercase">{{ tip.title }}</h4>
          <p class="text-xs mt-2">{{ tip.text }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
