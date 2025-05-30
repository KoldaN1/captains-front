<script setup>
import { ref, onMounted, watch, computed } from "vue";
import Item from "./Item.vue";
import { Icon } from "@iconify/vue";
import axiosInstance from "../../utils/axiosInstance";
import { useGameStore } from "../../stores/gameStore";
import { useTgTheme } from "../../composables/tg_theme.js";

const gameStore = useGameStore()

const emit = defineEmits(['complete', 'check_error'])

const loading = ref(true)
const tasks = ref({ OurProjects: [], PartnerProjects: [], InfluencerProjects: [] })

const displayedPartnerProjects = ref([])
const displayedInfluencerProjects = ref([])

onMounted(() => {
    getTasksData()
})

const getTasksData = async () => {
    if (!gameStore.tasks) {
        await gameStore.getTasks()
    }

    tasks.value = gameStore.tasks || { OurProjects: [], PartnerProjects: [], InfluencerProjects: [] }

    if (tasks.value.OurProjects?.length > 0) {
        tasks.value.OurProjects.sort((a, b) => a.id - b.id)
    }
    if (tasks.value.PartnerProjects?.length > 0) {
        tasks.value.PartnerProjects.sort((a, b) => b.id - a.id)
    }
    if (tasks.value.InfluencerProjects?.length > 0) {
        tasks.value.InfluencerProjects.sort((a, b) => b.id - a.id)
    }

    displayedPartnerProjects.value = tasks.value.PartnerProjects?.slice(0, 5) || []
    displayedInfluencerProjects.value = tasks.value.InfluencerProjects?.slice(0, 5) || []

    loading.value = false
}

const completeTask = async (task, category) => {
    if (category === 'PartnerProjects') {
        displayedPartnerProjects.value = displayedPartnerProjects.value.filter((el) => el.id !== task.id)
        if (tasks.value.PartnerProjects) {
            tasks.value.PartnerProjects = tasks.value.PartnerProjects.filter((el) => el.id !== task.id)
        }
    } else if (category === 'InfluencerProjects') {
        displayedInfluencerProjects.value = displayedInfluencerProjects.value.filter((el) => el.id !== task.id)
        if (tasks.value.InfluencerProjects) {
            tasks.value.InfluencerProjects = tasks.value.InfluencerProjects.filter((el) => el.id !== task.id)
        }
    } else if (category === 'OurProjects') {
        const taskIndex = tasks.value.OurProjects?.findIndex(el => el.id === task.id)
        if (taskIndex !== -1 && taskIndex !== undefined) {
            tasks.value.OurProjects[taskIndex].is_completed = true
        }
    }
    emit('complete', task)
}

const updateDisplayedTasks = (category, displayedTasks) => {
    const categoryTasks = tasks.value[category] || []
    const nextIndex = displayedTasks.length
    if (categoryTasks.length > nextIndex) {
        const nextTask = categoryTasks[nextIndex]
        if (!displayedTasks.find(task => task.id === nextTask.id)) {
            displayedTasks.push(nextTask)
        }
    }
}

const totalTaskCount = computed(() => {
  const allTasks = [
    ...tasks.value.OurProjects,
    ...tasks.value.PartnerProjects,
    ...tasks.value.InfluencerProjects,
  ];
  return allTasks.length;
});

const completedTaskCount = computed(() => {
  const allTasks = [
    ...tasks.value.OurProjects,
    ...tasks.value.PartnerProjects,
    ...tasks.value.InfluencerProjects,
  ];
  return allTasks.filter((task) => task.is_completed).length;
});

const taskProgressPercent = computed(() => {
  if (totalTaskCount.value === 0) return 0;
  return Math.round((completedTaskCount.value / totalTaskCount.value) * 100);
});

const progressBarBg = computed(() => {
  return useTgTheme() === "light" ? "bg-[#F0F0F0]" : "bg-white/[0.1]";
});

const textColor = computed(() => {
  return useTgTheme() === "light" ? "text-black" : "text-white";
});

watch(displayedPartnerProjects, (newVal) => {
    if (newVal.length < 5) {
        updateDisplayedTasks('PartnerProjects', displayedPartnerProjects.value)
    }
})

watch(displayedInfluencerProjects, (newVal) => {
    if (newVal.length < 5) {
        updateDisplayedTasks('InfluencerProjects', displayedInfluencerProjects.value)
    }
})
</script>

<template>
  <transition name="fade" mode="out-in">
    <div v-if="!loading" class="flex flex-col gap-y-4 p-4">
      <div class="flex gap-x-4">
        <img src="../../assets/duckygram.svg" alt="Ducky" />
        <div
          class="flex flex-col justify-start text-start gap-y-2"
          :class="textColor"
        >
          <h1 class="font-medium">{{ $t("tasks-tab.title") }}</h1>
          <p class="text-xs opacity-60">{{ $t("tasks-tab.description") }}</p>
          <div class="flex items-center gap-x-2">
            <span class="shrink-0 flex flex-col justify-center items-center">
              <img class="w-5 h-5" src="../../assets/coin.svg" />
            </span>
            <p>
              {{ $t("tasks-tab.reward") }}:
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
      >
        {{ $t("tasks-tab.complete-btn") }}
      </button>
      <div v-if="tasks.OurProjects?.length > 0" class="flex flex-col gap-y-2.5">
        <Item
          v-for="task in tasks.OurProjects"
          :key="task.id"
          :task="task"
          @complete="completeTask(task, 'OurProjects')"
          @check_error="emit('check_error')"
        />
      </div>

      <div
        v-if="displayedPartnerProjects?.length > 0"
        class="flex flex-col gap-y-2.5"
      >
        <div class="font-semibold flex items-center gap-x-1">
          <Icon icon="mdi:success-bold" />
          <span>{{ $t("partners") }}</span>
        </div>
        <Item
          v-for="task in displayedPartnerProjects"
          :key="task.id"
          :task="task"
          @complete="completeTask(task, 'PartnerProjects')"
          @check_error="emit('check_error')"
        />
      </div>

            <div v-if="displayedInfluencerProjects?.length > 0" class="flex flex-col gap-y-2">
                <div class="font-semibold flex items-center gap-x-1">
                    <Icon icon="mdi:success-bold" />
                    <span>{{ $t('ambassadors') }}</span>
                </div>
                <Item v-for="task in displayedInfluencerProjects" :key="task.id" :task="task"
                    @complete="completeTask(task, 'InfluencerProjects')" @check_error="emit('check_error')" />
            </div>
        </div>

        <div v-else class="flex flex-col gap-y-2 animate-pulse">
            <span class="w-40 h-10 rounded-2xl bg-secondary_bg_color flex" />
            <span v-for="i in 4" :key="i" class="flex w-full h-16 rounded-2xl bg-secondary_bg_color" />

            <span class="w-40 h-10 rounded-2xl bg-secondary_bg_color flex" />
            <span v-for="i in 4" :key="i" class="flex w-full h-16 rounded-2xl bg-secondary_bg_color" />
        </div>
    </transition>
</template>