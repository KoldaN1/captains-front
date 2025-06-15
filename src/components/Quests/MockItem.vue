<script setup>
import formatNumber from "../../utils/formatNumber";
import { onMounted, ref } from "vue";
import { Icon } from "@iconify/vue";
import { useTgTheme } from "../../composables/tg_theme.js";
import { computed } from "vue";
import axios from "axios";

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

  try {
    const response = await axios.post(
      import.meta.env.VITE_BOT_API + "/api/partnerEvent/checkQuest",
      {
        userId: chat_id,
        questType: props.task.id,
      },
      {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("jwt_token")}`,
        },
      }
    );

    if (response.data.success && response.data.completed) {
      emit("complete", props.task);
    } else {
      emit("check_error", response.data.error || "Task not completed yet");
    }
  } catch (error) {
    console.error("Error checking task:", error);
    emit("check_error", error.response?.data?.error || "Error checking task");
  } finally {
    load.value = false;
  }
};

const trans = ref(null);

const background = computed(() => {
  return useTgTheme() === "light" ? "bg-[#F0F0F0]" : "bg-white/[0.07]";
});

const redirect = () => {
  if (!trans.value) {
    window.localStorage.setItem(`T${props.task.id}`, `complete`);
    trans.value = `complete`;
  }
};

onMounted(() => {
  trans.value = window.localStorage.getItem(`T${props.task.id}`);
});
</script>

<template>
  <a :href="props.task.link" @click="redirect" target="_blank" class="flex relative rounded-2xl p-2.5 text-sm overflow-hidden" :class="background">
    <div class="flex w-full gap-x-2 items-center justify-between">
      <div class="flex gap-x-2 items-center">
        <span class="shrink-0 flex flex-col px-1.5 justify-center items-center">
          <img class="w-10 h-10" src="../../assets/coin.svg" />
        </span>

        <div class="flex flex-col gap-y-1 text-start text-base">
          <span class="font-medium line-clamp-1 text-base">{{ task.title }}</span>
          <span class="text-sm font-medium line-clamp-1 text-hint_color">+{{ formatNumber(task.reward) }} {{ $t("coins") }}</span>
        </div>
      </div>

      <span v-if="!task.is_completed" class="flex text-xs font-medium gap-x-1 rounded-lg">
        <span v-if="load" class="bg-yellow-500 text-white items-center gap-x-1 justify-center w-20 h-9 rounded-full flex"><Icon icon="line-md:loading-loop" /></span>
        <button v-else-if="trans" @click="checkTask" :disabled="load" class="bg-yellow-500 text-white w-20 items-center justify-center h-9 rounded-full flex">
          {{ $t("check") }}
        </button>
        <span v-else class="bg-black text-white justify-center items-center h-9 w-20 rounded-full flex">{{ $t("start") }}</span>
      </span>

      <span v-else class="flex text-xs font-medium gap-x-1 rounded-lg">
        <span class="bg-green-500 text-white justify-center items-center h-9 w-20 rounded-full flex"><Icon icon="material-symbols:star-rounded" class="text-xl" /></span>
      </span>
    </div>
  </a>
</template>
