<script setup>
import formatNumber from "../../utils/formatNumber";
import { onMounted, ref, computed } from "vue";
import checkSubscription from "../../utils/checkExists";
import checkApi from "../../utils/checkApi";
import { Icon } from "@iconify/vue";
import { useTgTheme } from "../../composables/tg_theme.js";

const emit = defineEmits("complete", "check_error");

const props = defineProps({
  task: Object,
});

const textColor = computed(() => {
  return useTgTheme() === "light" ? "text-black" : "text-white";
});
</script>

<template>
  <div class="flex relative rounded-2xl p-2.5 text-sm overflow-hidden bg-secondary_bg_color" :class="textColor">
    <div class="flex w-full gap-x-2 items-center justify-between">
      <div class="flex gap-x-2 items-center">
        <span class="shrink-0 flex flex-col px-1.5 justify-center items-center">
          <img class="w-10 h-10" src="../../assets/coin.svg" />
        </span>

        <div class="flex flex-col gap-y-1 text-start">
          <span class="font-medium line-clamp-1 text-base">{{ task.title }}</span>
          <span class="text-sm font-medium text-hint_color line-clamp-1">+{{ formatNumber(task.reward) }} {{ $t("coins") }}</span>
        </div>
      </div>

      <span v-if="!task.is_completed" class="flex text-xs font-medium gap-x-1 rounded-lg">
        <span class="bg-bg_color text-black justify-center items-center h-9 w-20 rounded-full flex" :class="textColor">{{ $t("quests") }}</span>
      </span>

      <span v-else class="flex text-xs font-medium gap-x-1 rounded-lg">
        <span class="bg-green-500 text-white justify-center items-center h-9 w-20 rounded-full flex"><Icon icon="material-symbols:star-rounded" class="text-xl" /></span>
      </span>
    </div>
  </div>
</template>
