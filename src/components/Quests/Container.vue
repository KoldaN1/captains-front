<script setup>
<<<<<<< Updated upstream
import { ref, onMounted, watch } from 'vue'
import Item from './Item.vue'
import { Icon } from '@iconify/vue'
import axiosInstance from '../../utils/axiosInstance'
import { useGameStore } from '../../stores/gameStore'
=======
import { ref, onMounted, watch } from "vue";
import Item from "./Item.vue";
import QuestsItem from "./QuestsItem.vue";
import EventMenu from "../Modals/EventMenu.vue";
import TasksContainer from "./TasksContainer.vue";
import { Icon } from "@iconify/vue";
import axiosInstance from "../../utils/axiosInstance";
import { useGameStore } from "../../stores/gameStore";
>>>>>>> Stashed changes

const gameStore = useGameStore();

const emit = defineEmits(["complete", "check_error"]);

<<<<<<< Updated upstream
const loading = ref(true)
const tasks = ref({ OurProjects: [], PartnerProjects: [], InfluencerProjects: [] })

const displayedPartnerProjects = ref([])
const displayedInfluencerProjects = ref([])
=======
const loading = ref(true);
const tasks = ref({ OurProjects: [], PartnerProjects: [], InfluencerProjects: [], Quests: [] });
const openQuests = ref(false);
const displayedPartnerProjects = ref([]);
const displayedInfluencerProjects = ref([]);
>>>>>>> Stashed changes

onMounted(() => {
  getTasksData();
});

const getTasksData = async () => {
  if (!gameStore.tasks) {
    await gameStore.getTasks();
  }

<<<<<<< Updated upstream
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
=======
  tasks.value = gameStore.tasks || { OurProjects: [], PartnerProjects: [], InfluencerProjects: [], Quests: [] };

  if (tasks.value.OurProjects?.length > 0) {
    tasks.value.OurProjects.sort((a, b) => a.id - b.id);
  }
  if (tasks.value.PartnerProjects?.length > 0) {
    tasks.value.PartnerProjects.sort((a, b) => b.id - a.id);
  }
  if (tasks.value.InfluencerProjects?.length > 0) {
    tasks.value.InfluencerProjects.sort((a, b) => b.id - a.id);
  }
  if (!tasks.value.Quests?.length) {
    tasks.value.Quests = [
      {
        id: 1,
        title: "Duck Task",
        description: "This is a sample duck task.",
        is_completed: false,
        reward: 190000,
      },
    ];
  }
>>>>>>> Stashed changes

  displayedPartnerProjects.value = tasks.value.PartnerProjects?.slice(0, 5) || [];
  displayedInfluencerProjects.value = tasks.value.InfluencerProjects?.slice(0, 5) || [];

  loading.value = false;
};

const completeTask = async (task, category) => {
<<<<<<< Updated upstream
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
=======
  if (category === "PartnerProjects") {
    displayedPartnerProjects.value = displayedPartnerProjects.value.filter((el) => el.id !== task.id);
    if (tasks.value.PartnerProjects) {
      tasks.value.PartnerProjects = tasks.value.PartnerProjects.filter((el) => el.id !== task.id);
>>>>>>> Stashed changes
    }
  } else if (category === "InfluencerProjects") {
    displayedInfluencerProjects.value = displayedInfluencerProjects.value.filter((el) => el.id !== task.id);
    if (tasks.value.InfluencerProjects) {
      tasks.value.InfluencerProjects = tasks.value.InfluencerProjects.filter((el) => el.id !== task.id);
    }
  } else if (category === "OurProjects") {
    const taskIndex = tasks.value.OurProjects?.findIndex((el) => el.id === task.id);
    if (taskIndex !== -1 && taskIndex !== undefined) {
      tasks.value.OurProjects[taskIndex].is_completed = true;
    }
  } else if (category === "Quests") {
    tasks.value.Quests[0].is_completed = true;
  }
  emit("complete", task);
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

watch(displayedPartnerProjects, (newVal) => {
  if (newVal.length < 5) {
    updateDisplayedTasks("PartnerProjects", displayedPartnerProjects.value);
  }
});

watch(displayedInfluencerProjects, (newVal) => {
  if (newVal.length < 5) {
    updateDisplayedTasks("InfluencerProjects", displayedInfluencerProjects.value);
  }
});
</script>

<template>
<<<<<<< Updated upstream
    <transition name="fade" mode="out-in">
        <div v-if="!loading" class="flex flex-col gap-y-4">
            <div v-if="tasks.OurProjects?.length > 0" class="flex flex-col gap-y-2">
                <div class="font-semibold flex items-center gap-x-1">
                    <Icon icon="mdi:success-bold" />
                    <span>{{ $t('cb_tasks') }}</span>
                </div>
                <Item v-for="task in tasks.OurProjects" :key="task.id" :task="task"
                    @complete="completeTask(task, 'OurProjects')" @check_error="emit('check_error')" />
            </div>

            <div v-if="displayedPartnerProjects?.length > 0" class="flex flex-col gap-y-2">
                <div class="font-semibold flex items-center gap-x-1">
                    <Icon icon="mdi:success-bold" />
                    <span>{{ $t('partners') }}</span>
                </div>
                <Item v-for="task in displayedPartnerProjects" :key="task.id" :task="task"
                    @complete="completeTask(task, 'PartnerProjects')" @check_error="emit('check_error')" />
            </div>

            <div v-if="displayedInfluencerProjects?.length > 0" class="flex flex-col gap-y-2">
                <div class="font-semibold flex items-center gap-x-1">
                    <Icon icon="mdi:success-bold" />
                    <span>{{ $t('ambassadors') }}</span>
                </div>
                <Item v-for="task in displayedInfluencerProjects" :key="task.id" :task="task"
                    @complete="completeTask(task, 'InfluencerProjects')" @check_error="emit('check_error')" />
            </div>
=======
  <transition name="fade" mode="out-in">
    <div v-if="!loading" class="flex flex-col gap-y-4">
      <div v-if="tasks.Quests?.length > 0" class="flex flex-col gap-y-2">
        <QuestsItem v-if="Math.floor(Date.now() / 1000) >= 1749038400" @click="openQuests = true" :task="tasks.Quests[0]" />
      </div>
      <div v-if="tasks.OurProjects?.length > 0" class="flex flex-col gap-y-2">
        <div class="font-semibold flex items-center gap-x-1">
          <Icon icon="mdi:success-bold" />
          <span>{{ $t("cb_tasks") }}</span>
>>>>>>> Stashed changes
        </div>
        <Item v-for="task in tasks.OurProjects" :key="task.id" :task="task" @complete="completeTask(task, 'OurProjects')" @check_error="emit('check_error')" />
      </div>

      <div v-if="displayedPartnerProjects?.length > 0" class="flex flex-col gap-y-2">
        <div class="font-semibold flex items-center gap-x-1">
          <Icon icon="mdi:success-bold" />
          <span>{{ $t("partners") }}</span>
        </div>
        <Item v-for="task in displayedPartnerProjects" :key="task.id" :task="task" @complete="completeTask(task, 'PartnerProjects')" @check_error="emit('check_error')" />
      </div>

      <div v-if="displayedInfluencerProjects?.length > 0" class="flex flex-col gap-y-2">
        <div class="font-semibold flex items-center gap-x-1">
          <Icon icon="mdi:success-bold" />
          <span>{{ $t("ambassadors") }}</span>
        </div>
        <Item v-for="task in displayedInfluencerProjects" :key="task.id" :task="task" @complete="completeTask(task, 'InfluencerProjects')" @check_error="emit('check_error')" />
      </div>
      <EventMenu :isOpen="openQuests" @close="openQuests = false">
        <main class="flex flex-col gap-y-6 overflow-y-auto h-full rounded-b-2xl">
          <img src="../../assets/ducky&gram.png" alt="Ducky & Gram" class="w-full" />

          <TasksContainer @complete="completeTask" @close-modal="openQuests = false" @check_error="() => emit('check_error')" />
        </main>
      </EventMenu>
    </div>

    <div v-else class="flex flex-col gap-y-2 animate-pulse">
      <span class="w-40 h-10 rounded-2xl bg-secondary_bg_color flex" />
      <span v-for="i in 4" :key="i" class="flex w-full h-16 rounded-2xl bg-secondary_bg_color" />

      <span class="w-40 h-10 rounded-2xl bg-secondary_bg_color flex" />
      <span v-for="i in 4" :key="i" class="flex w-full h-16 rounded-2xl bg-secondary_bg_color" />
    </div>
  </transition>
</template>
