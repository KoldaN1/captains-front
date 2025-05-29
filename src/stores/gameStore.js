import { defineStore } from "pinia";
import { ref } from "vue";
import axiosInstance from "../utils/axiosInstance";
import i18n from "../i18n";

export const useGameStore = defineStore("gameStore", () => {
  const loading = ref(true);

  const userData = ref(null);
  const attentions = ref(null);
  const events = ref(null);

  const tasks = ref(null);

  const getAttentions = async () => {
    let { data: attentions_data } = await axiosInstance.get("/rest/v1/attentions", {
      params: {
        active: "eq.true",
        locale: `eq.${i18n.global.locale}`,
      },
    });

    if (attentions_data) {
      attentions.value = attentions_data;
    }
  };

  const getUserData = async () => {
    let { data: user, error } = await axiosInstance.post("/rest/v1/rpc/v5_get_user_info");
    if (error) console.log(error);
    else {
      userData.value = user;
      return user;
    }
  };

  const getEvents = async () => {
    let { data: eventsData, error } = await axiosInstance.get("/rest/v1/events", {
      params: {
        select: "id,partner",
        is_active: "eq.true",
        order: "id.desc",
      },
    });

    events.value = eventsData;
  };

  const getTasks = async () => {
    let { data, error } = await axiosInstance.post("/rest/v1/rpc/v2_get_tasks_with_status");
    if (data) {
      tasks.value = data;
      return data;
    }
  };

  const initializeProject = async () => {
    await getAttentions();
    await getEvents();

    loading.value = false;
  };

  return {
    loading,
    initializeProject,
    userData,
    getUserData,
    attentions,
    events,
    getTasks,
    tasks,
  };
});
