<script setup>

import { ref, getCurrentInstance, computed } from 'vue'

import Heading from '../../components/Other/Heading.vue'

import TasksContainer from '../../components/Quests/Container.vue'

import Alert from '../../components/Alert/Alert.vue'

import formatNumber from '../../utils/formatNumber'

import generateId from '../../utils/generateId'
import axiosInstance from '../../utils/axiosInstance'
import Navigator from '../../components/Navigator/Navigator.vue'
import { useTgTheme } from "../../composables/tg_theme.js";

const { proxy } = getCurrentInstance()

const webapp = window.Telegram.WebApp

const completeTask = async (task) => {
  let { data, error } = await axiosInstance.post('/rest/v1/rpc/v2_complete_task', {
    p_task_id: task.id
  })
  if (error) {
    webapp.HapticFeedback.notificationOccurred('error')
    addAlert(proxy.$t('error'), 'error')
  }
  else {
    webapp.HapticFeedback.notificationOccurred('success')
    addAlert(proxy.$t('claimed_coins', { coins: formatNumber(task.reward) }), `success`)
  }
}

const alerts = ref([])

const addAlert = (title, type) => {
  const id = generateId()
  alerts.value.push({ id, title, type })

  setTimeout(() => {
    removeAlert(id)
  }, 5000)
}

const removeAlert = (id) => {
  alerts.value = alerts.value.filter(alert => alert.id !== id)
}

const background = computed(() => {
  return useTgTheme() === "light" ? "bg-white" : "bg-black";
});

const textColor = computed(() => {
  return useTgTheme() === "light" ? "text-black" : "text-white";
});
</script>

<template>
  <transition name="fade">
    <main class="flex flex-col gap-y-6 px-4 pt-6 pb-[102px]" :class="background, textColor">

      <transition name="fade">
        <div v-if="alerts.length > 0" v-auto-animate class="fixed z-20 top-4 left-4 right-4 flex flex-col gap-y-1.5">
          <Alert v-for="alert in alerts" :key="alert.id" :title="alert.title" :type="alert.type" />
        </div>
      </transition>

      <Heading :title="$t('earn_more')" :description="$t('earn_more_description')" />

      <TasksContainer @complete="completeTask" @check_error="() => addAlert(proxy.$t('not_completed'), 'error')" />

    </main>
  </transition>

  <Navigator :page="'TASKS'" />
</template>