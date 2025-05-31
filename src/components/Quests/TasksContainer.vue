<script setup>
import { ref, onMounted, watch, computed } from "vue";
import QuestsItem from "./QuestsItem.vue";
import MockItem from "./MockItem.vue";
import { Icon } from "@iconify/vue";
import axiosInstance from "../../utils/axiosInstance";
import { useGameStore } from "../../stores/gameStore";
import { useTgTheme } from "../../composables/tg_theme.js";

const gameStore = useGameStore();

const emit = defineEmits(["complete", "check_error", "close-modal"]);

const loading = ref(true);
const tasks = ref([]);

const displayedPartnerProjects = ref([]);
const displayedInfluencerProjects = ref([]);

const getTasksData = async () => {
  if (!gameStore.additionalTasks) {
    await gameStore.getAdditionalTasks();
  }

  tasks.value = gameStore.additionalTasks || []

  if (tasks.value.length > 0) {
    tasks.value.sort((a, b) => a.id - b.id);
  }

  loading.value = false;
};

const completeTask = async (task, category) => {
if (category === "OurProjects") {
    const taskIndex = tasks.value.findIndex(
      (el) => el.id === task.id
    );
    if (taskIndex !== -1 && taskIndex !== undefined) {
      tasks.value[taskIndex].is_completed = true;
    }
  }
};

const claimReward = async () => {
  emit("complete", '', "Quests");
  emit("close-modal");
};

const updateDisplayedTasks = (category, displayedTasks) => {
  const categoryTasks = tasks.value[category] || [];
  const nextIndex = displayedTasks.length;
  if (categoryTasks.length > nextIndex) {
    const nextTask = categoryTasks[nextIndex];
    if (!displayedTasks.find((task) => task.id === nextTask.id)) {
      displayedTasks.push(nextTask);
    }
  }
};

const totalTaskCount = computed(() => {
  return tasks.value.length;
});

const completedTaskCount = computed(() => {
  return tasks.value.filter((task) => task.is_completed).length;
});

const taskProgressPercent = computed(() => {
  if (totalTaskCount.value === 0) return 0;
  return Math.round((completedTaskCount.value / totalTaskCount.value) * 100);
});

const background = computed(() => {
  return useTgTheme() === "light" ? "bg-white" : "bg-white/[0.16]";
});

const progressBarBg = computed(() => {
  return useTgTheme() === "light" ? "bg-[#F0F0F0]" : "bg-white/[0.1]";
});

const textColor = computed(() => {
  return useTgTheme() === "light" ? "text-black" : "text-white";
});

onMounted(() => {
  getTasksData();
});

</script>

<template>
  <transition name="fade" mode="out-in">
    <div v-if="!loading" class="flex flex-col gap-y-4 p-4 rounded-2xl" :class="background">
      <div class="flex gap-x-4">
        <img src="../../assets/duckygram.svg" alt="Ducky" />
        <div
          class="flex flex-col justify-start text-start gap-y-2"
          :class="textColor"
        >
          <h1 class="font-medium">{{ $t("ducky_gram.title") }}</h1>
          <p class="text-xs opacity-60">{{ $t("ducky_gram.description") }}</p>
          <div class="flex items-center gap-x-2">
            <span class="shrink-0 flex flex-col justify-center items-center">
              <img class="w-5 h-5" src="../../assets/coin.svg" />
            </span>
            <p>
              {{ $t("ducky_gram.reward") }}:
              <span class="font-bold">190.00k</span>
            </p>
          </div>
        </div>
      </div>
      <div
        class="relative w-full rounded-full overflow-hidden my-4"
        :class="progressBarBg"
      >
        <div
          class="absolute left-0 top-0 h-full bg-black transition-all duration-300"
          :style="{ width: taskProgressPercent + '%' }"
        ></div>
        <div
          class="relative z-10 text-center text-xs font-bold"
          :class="taskProgressPercent >= 50 ? 'text-white' : textColor"
        >
          {{ completedTaskCount }} / {{ totalTaskCount }}
        </div>
      </div>
      <button
        v-if="completedTaskCount === totalTaskCount"
        class="w-full rounded-[15px] bg-bg_yellow py-2.5 shadow-[0px_4px_0px_0px_black] bg-complete-task-bg"
        :class="useTgTheme() === 'light' ? 'text-white' : 'text-black'"
        @click="claimReward"
      >
        {{ $t("ducky_gram.complete-btn") }}
      </button>
      <div v-if="tasks?.length > 0" class="flex flex-col gap-y-2.5">
        <MockItem
          v-for="task in tasks"
          :key="task.id"
          :task="task"
          @complete="completeTask(task, 'OurProjects')"
          @check_error="emit('check_error')"
        />
      </div>

      
    </div>

    <div v-else class="flex flex-col gap-y-2.5 animate-pulse">
      <span class="w-40 h-10 rounded-2xl bg-secondary_bg_color flex" />
      <span
        v-for="i in 4"
        :key="i"
        class="flex w-full h-16 rounded-2xl bg-secondary_bg_color"
      />

      <span class="w-40 h-10 rounded-2xl bg-secondary_bg_color flex" />
      <span
        v-for="i in 4"
        :key="i"
        class="flex w-full h-16 rounded-2xl bg-secondary_bg_color"
      />
    </div>
  </transition>
</template>
