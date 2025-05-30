<script setup>
import { ref, getCurrentInstance } from "vue";

import Heading from "../../components/Other/Heading.vue";

import TasksContainer from "../../components/Quests/Container.vue";

import Alert from "../../components/Alert/Alert.vue";

import formatNumber from "../../utils/formatNumber";

import generateId from "../../utils/generateId";
import axiosInstance from "../../utils/axiosInstance";
import Navigator from "../../components/Navigator/Navigator.vue";

import EventMenu from "../../components/Modals/EventMenu.vue";

const { proxy } = getCurrentInstance();

const webapp = window.Telegram.WebApp;

const completeTask = async (task) => {
  let { data, error } = await axiosInstance.post(
    "/rest/v1/rpc/v2_complete_task",
    {
      p_task_id: task.id,
    }
  );
  if (error) {
    webapp.HapticFeedback.notificationOccurred("error");
    addAlert(proxy.$t("error"), "error");
  } else {
    webapp.HapticFeedback.notificationOccurred("success");
    addAlert(
      proxy.$t("claimed_coins", { coins: formatNumber(task.reward) }),
      `success`
    );
  }
};

const alerts = ref([]);

const addAlert = (title, type) => {
  const id = generateId();
  alerts.value.push({ id, title, type });

  setTimeout(() => {
    removeAlert(id);
  }, 5000);
};

const removeAlert = (id) => {
  alerts.value = alerts.value.filter((alert) => alert.id !== id);
};
</script>

<template>
  <div class="flex flex-col h-full">
    <EventMenu
      :isOpen="true"
      @close="() => proxy.$router.push({ name: 'INDEX' })"
      class="overflow-hidden h-full"
    >
      <main class="flex flex-col gap-y-6 overflow-y-auto h-full">
        <transition name="fade">
          <div
            v-if="alerts.length > 0"
            v-auto-animate
            class="fixed z-20 top-4 left-4 right-4 flex flex-col gap-y-1.5"
          >
            <Alert
              v-for="alert in alerts"
              :key="alert.id"
              :title="alert.title"
              :type="alert.type"
            />
          </div>
        </transition>

        <img
          src="../../assets/ducky&gram.png"
          alt="Ducky & Gram"
          class="w-full h-full"
        />

        <TasksContainer
          @complete="completeTask"
          @check_error="() => addAlert(proxy.$t('not_completed'), 'error')"
        />
      </main>
    </EventMenu>
    <Navigator :page="'TASKS'" />
  </div>
</template>
