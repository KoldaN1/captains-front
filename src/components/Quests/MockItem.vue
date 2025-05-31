<script setup>
import formatNumber from "../../utils/formatNumber";
import { onMounted, ref } from "vue";
import checkSubscription from "../../utils/checkExists";
import checkApi from "../../utils/checkApi";
import { Icon } from "@iconify/vue";
import { useTgTheme } from "../../composables/tg_theme.js";
import { computed } from "vue";

const emit = defineEmits("complete", "check_error");

const props = defineProps({
  task: Object,
});

const webapp = window.Telegram.WebApp;
const chat_id = webapp.initDataUnsafe.user?.id;

const load = ref(false);

const checkTask = async (e) => {
  e.preventDefault();

  load.value = true;

  // TODO: Do all checks from the backend 
  setTimeout(() => {
    emit("complete", props.task);

    load.value = false;
  }, 1000);

};

const trans = ref(null);

const background = computed(() => {
  return useTgTheme() === "light" ? "bg-[#F0F0F0]" : "bg-white/[0.1]";
});

const textColor = computed(() => {
  return useTgTheme() === "light" ? "text-black" : "text-white";
});

const redirect = () => {    
  if (!trans.value) {
    // webapp.HapticFeedback.impactOccurred("light");
    window.localStorage.setItem(`T${props.task.id}`, `complete`);
    trans.value = `complete`;
  }
};

onMounted(() => {
  trans.value = window.localStorage.getItem(`T${props.task.id}`);
});
</script>

<template>
  <a
    :href="props.task.link"
    @click="redirect"
    target="_blank"
    class="flex relative rounded-2xl p-2.5 text-sm overflow-hidden"
    :class="background"
  >
    <div class="flex w-full gap-x-2 items-center justify-between">
      <div class="flex gap-x-2 items-center">
        <span class="shrink-0 flex flex-col px-1.5 justify-center items-center">
          <img class="w-10 h-10" src="../../assets/coin.svg" />
        </span>

        <div class="flex flex-col gap-y-1 text-start" :class="textColor">
          <span class="font-medium line-clamp-1 text-base">{{
            task.title
          }}</span>
          <span class="text-sm font-medium line-clamp-1 text-hint_color"
            >+{{ formatNumber(task.reward) }} {{ $t("coins") }}</span
          >
        </div>
      </div>

      <span
        v-if="!task.is_completed"
        class="flex text-xs font-medium gap-x-1 rounded-lg"
      >
        <span
          v-if="load"
          class="bg-yellow-500 text-white items-center gap-x-1 justify-center w-20 h-9 rounded-full flex"
          ><Icon icon="line-md:loading-loop"
        /></span>
        <button
          v-else-if="trans"
          @click="checkTask"
          :disabled="load"
          class="bg-yellow-500 text-white w-20 items-center justify-center h-9 rounded-full flex"
        >
          {{ $t("check") }}
        </button>
        <span
          v-else
          class="bg-black text-white justify-center items-center h-9 w-20 rounded-full flex"
          >{{ $t("start") }}</span
        >
      </span>

      <span v-else class="flex text-xs font-medium gap-x-1 rounded-lg">
        <span
          class="bg-green-500 text-white justify-center items-center h-9 w-20 rounded-full flex"
          ><Icon icon="material-symbols:star-rounded" class="text-xl"
        /></span>
      </span>
    </div>
  </a>
</template>
