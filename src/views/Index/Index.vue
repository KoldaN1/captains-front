<script setup>
import { ref, onMounted, reactive, getCurrentInstance, onUnmounted } from "vue";
import axiosInstance from "../../utils/axiosInstance";
import formatNumber from "../../utils/formatNumber";
import { useGameStore } from "../../stores/gameStore";

import Alert from "../../components/Alert/Alert.vue";

import Claim from "../../components/Index/Claim/Claim.vue";
import Daily from "../../components/Index/Daily/Daily.vue";

import Header from "../../components/Index/Header/Header.vue";
import Stats from "../../components/Index/Stats/Stats.vue";

import Navigator from "../../components/Navigator/Navigator.vue";
import generateId from "../../utils/generateId";

import checkSubscription from "../../utils/checkExists";

import Ship from "../../components/Index/Ship.vue";
import MainModal from "../../components/Modals/MainModal.vue";
import axios from "axios";

const { proxy } = getCurrentInstance();
const gameStore = useGameStore();

const loading = ref(true);
const gameData = ref(null);

const alerts = ref([]);

const webapp = window.Telegram.WebApp;

const addAlert = (title, type) => {
  const id = generateId();
  alerts.value.push({ id, title, type });

  setTimeout(() => {
    removeAlert(id);
  }, 5000);
};

const removeAlert = (id) => (alerts.value = alerts.value.filter((alert) => alert.id !== id));

const mainButton = reactive({
  text: "Loading...",
  earnedCoins: null,
});

const claim = async () => {
  let not_claimed = gameData.value.not_claimed;
  gameData.value.not_claimed = 0;

  let { data, error } = await axiosInstance.post("/rest/v1/rpc/v2_update_user_rewards");
  if (error) {
    gameData.value.not_claimed = not_claimed;
    addAlert(proxy.$t("error"), "error");
  } else {
    gameData.value.coins = data[0].new_coins;
    addAlert(proxy.$t("success"), "success");
  }
};

const attentions = ref(null);
const attentions_modal_opened = ref(false);

const attention_close = () => {
  attentions_modal_opened.value = false;

  if (attentions.value && attentions.value.length > 0) {
    const lastAttention = attentions.value[attentions.value.length - 1];
    localStorage.setItem(`attention_${lastAttention.id}`, "viewed");
  }
};

const getUserData = async () => {
  let user = await gameStore.getUserData();

  if (user?.boosters?.coins) {
    let prevHourly = user.hourly_income;
    user.hourly_income = prevHourly + (prevHourly / 100) * user?.boosters?.coins;
  }

  gameData.value = user;
  AD.value = user.promote_tasks;

  if (user.blacklist) {
    console.log(proxy.$t("blocked"));
    webapp.showAlert(proxy.$t("blocked"), () => {
      webapp.close();
    });
  }

  if (!user.image_url) {
    mainButton.text = proxy.$t("get_free_ship");
  } else if (user.mining_status === "Mining in progress") {
    startMiningCountdown(user.mining_time_left / 1000, user.hourly_income);
  } else if (user.mining_status === "Ready to claim") {
    mainButton.text = proxy.$t("claim_coins", {
      coins: formatNumber(user.hourly_income * (gameData.value.total_mining_minutes / 60)),
    });
  } else {
    mainButton.text = proxy.$t("start_mining");
  }

  eventsData.value = gameStore.events;

  loading.value = false;

  let attentions_data = gameStore.attentions;

  if (attentions_data) attentions.value = attentions_data;

  if (attentions.value && attentions.value.length > 0) {
    const lastAttention = attentions.value[attentions.value.length - 1];
    const lastAttentionViewed = localStorage.getItem(`attention_${lastAttention.id}`);

    if (!lastAttentionViewed) {
      attentions_modal_opened.value = true;
    }
  }
};

let countdownInterval = null;

const completeStartFarmQuest = async () => {
  try {
    await axios.post(
      import.meta.env.VITE_BOT_API + "/api/partnerEvent/completeUserTask",
      {
        questType: "startFarm",
      },
      {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("jwt_token")}`,
        },
      }
    );
  } catch (error) {
    console.error(error);
  }
};

const startMiningCountdown = (timeLeft, hourlyIncome) => {
  completeStartFarmQuest();
  const totalTime = gameData.value.total_mining_minutes * 60;

  const updateCountdown = () => {
    if (timeLeft <= 0) {
      mainButton.text = proxy.$t("claim_coins", {
        coins: formatNumber(gameData.value.hourly_income * (gameData.value.total_mining_minutes / 60)),
      });
      gameData.value.mining_status = "Ready to claim";
      mainButton.mining_status = "Ready to claim";
      mainButton.earnedCoins = null;
      if (countdownInterval) {
        clearInterval(countdownInterval);
      }
      return;
    }

    const hours = Math.floor(timeLeft / 3600);
    const minutes = Math.floor((timeLeft % 3600) / 60);
    const seconds = Math.floor(timeLeft % 60);

    mainButton.earnedCoins = Math.floor(((totalTime - timeLeft) / 3600) * hourlyIncome);

    mainButton.text = proxy.$t("mining_ends", {
      time: `${hours}${proxy.$t("h")} ${minutes}${proxy.$t("m")} ${seconds}${proxy.$t("s")}`,
    });
    timeLeft--;

    if (timeLeft <= 0) {
      mainButton.text = proxy.$t("claim_coins", {
        coins: formatNumber(gameData.value.hourly_income * (gameData.value.total_mining_minutes / 60)),
      });
      gameData.value.mining_status = "Ready to claim";
      mainButton.mining_status = "Ready to claim";
      mainButton.earnedCoins = null;
      if (countdownInterval) {
        clearInterval(countdownInterval);
      }
    }
  };

  updateCountdown();
  if (!countdownInterval) {
    countdownInterval = setInterval(updateCountdown, 1000);
  }
};

onUnmounted(() => {
  clearTimeout(countdownInterval);
});

const getInitialShip = async () => {
  let { data: ship, error } = await axiosInstance.post("/rest/v1/rpc/v2_give_initial_ship_to_user");
  if (error) {
    addAlert(proxy.$t("error"), "error");
  } else {
    gameData.value.image_url = ship.image_url;
    gameData.value.hourly_income = ship.income_per_hour;
    mainButton.text = proxy.$t("start_mining");
    addAlert(proxy.$t("success"), "success");
  }
};

const buttonActivity = ref(false);

const mainButtonClicked = async (x2) => {
  buttonActivity.value = true;
  if (!gameData.value.image_url) {
    getInitialShip();
  } else {
    if (loading.value) return;
    webapp.HapticFeedback.impactOccurred("light");

    let { data, error } = await axiosInstance.post(
      "/rest/v1/rpc/v10_mine",
      x2 && {
        x2: x2,
      }
    );
    if (error) {
      console.log(error);
      addAlert(proxy.$t("error"), "error");
    } else {
      if (data.status === "Coins claimed") {
        gameData.value.coins += data.coins_added;
        gameData.value.mining_status = "Not mining";
        mainButton.text = proxy.$t("start_mining");
        mainButton.earnedCoins = null;
        addAlert(proxy.$t("success"), "success");
      }

      if (data.status === "Mining in progress") {
        console.log("Mining in progress");
      }

      if (data.status === "Mining started") {
        gameData.value.mining_status = "Mining in progress";
        mainButton.text = proxy.$t("mining_progress");

        gameData.value.collection_time = data.next_claim_available_in_minutes;
        gameData.value.mining_time_left = data.mining_time_left;
        gameData.value.total_mining_minutes = data.total_mining_minutes;

        startMiningCountdown(gameData.value.total_mining_minutes * 60, gameData.value.hourly_income);
        addAlert(proxy.$t("success"), "success");
      }
    }
  }
  buttonActivity.value = false;
};

onMounted(async () => {
  await getUserData();
});

const dailyCheck = () => {
  gameData.value.reward_amount = null;
  gameData.value.reward_streak = null;
};

const AD = ref(null);
const skip = () => {
  mainButtonClicked(false);
};

const check_load = ref(false);

const AdController = window.Adsgram.init({ blockId: import.meta.env.VITE_ADSGRAM_BLOCK_ID });

const watchAds = async () => {
  check_load.value = true;
  buttonActivity.value = true;

  let ads = [1];
  let checkout = [];

  await AdController.show()
    .then((result) => {
      checkout.push(1);
    })
    .catch((result) => {
      checkout.push(0);
    });

  if (checkout && checkout.length === ads.length) {
    if (checkout.includes(0)) {
      addAlert(proxy.$t("not_completed"), "error");
    } else {
      mainButtonClicked(true);
    }
  }

  check_load.value = false;
  buttonActivity.value = false;
};

const check = async () => {
  check_load.value = true;
  buttonActivity.value = true;

  // Создаем массив промисов для всех проверок
  const checkoutPromises = AD.value.map(async (element) => {
    let localeComplete = window.localStorage.getItem(`T${element.id}`);

    if (localeComplete) {
      if (element.channel_id) {
        let is_member = await checkSubscription(gameData.value.chat_id, element.channel_id);
        return is_member && !is_member.data.subscribed ? 0 : 1;
      } else {
        return 1;
      }
    } else {
      return 0;
    }
  });

  // Ожидаем выполнения всех промисов
  const checkout = await Promise.all(checkoutPromises);

  // Проверяем результаты
  if (checkout && checkout.length === AD.value.length) {
    if (checkout.includes(0)) {
      addAlert(proxy.$t("not_completed"), "error");
    } else {
      await mainButtonClicked(true);

      let { data, error } = await axiosInstance.post("/rest/v1/rpc/v2_mark_tasks_completed", {
        task_ids: AD.value.map((el) => el.id),
      });
      if (error) console.error(error);
      else console.log(data);
    }
  }

  check_load.value = false;
  buttonActivity.value = false;
};

const eventsData = ref(null);
</script>

<template>
  <div>
    <transition name="fade" mode="out-in">
      <div v-if="loading" class="flex flex-col gap-y-4 px-4 py-6 animate-pulse">
        <div class="flex gap-x-2 items-center">
          <span class="flex h-16 aspect-square bg-secondary_bg_color rounded-2xl" />

          <div class="flex flex-col gap-y-2">
            <span class="flex h-12 w-64 bg-secondary_bg_color rounded-2xl" />
            <span class="flex h-6 w-40 bg-secondary_bg_color rounded-2xl" />
          </div>
        </div>

        <div class="flex flex-col gap-y-2">
          <div class="flex justify-between gap-x-2">
            <span class="flex h-20 w-1/2 bg-secondary_bg_color rounded-2xl" />
            <span class="flex h-20 w-1/2 bg-secondary_bg_color rounded-2xl" />
          </div>

          <span class="flex h-20 bg-secondary_bg_color rounded-2xl" />
          <span class="flex h-40 bg-secondary_bg_color rounded-2xl" />
        </div>
      </div>

      <main v-else class="flex flex-col gap-y-6 px-4 pt-6 pb-[182px]">
        <transition name="fade">
          <div v-if="alerts.length > 0" v-auto-animate class="fixed z-20 top-4 left-4 right-4 flex flex-col gap-y-1.5">
            <Alert v-for="alert in alerts" :key="alert.id" :title="alert.title" :type="alert.type" />
          </div>
        </transition>
        <transition name="fade">
          <Daily v-if="gameData?.reward_streak && gameData.reward_amount" :reward_streak="gameData?.reward_streak" :reward_amount="gameData?.reward_amount" @close="dailyCheck" />
          <Claim :claimedCoins="gameData?.not_claimed" v-else-if="gameData?.not_claimed && gameData?.not_claimed > 0" @claim="claim" />
        </transition>

        <MainModal v-if="attentions?.length > 0 && !gameData?.not_claimed && !gameData.reward_streak" :isOpen="attentions_modal_opened" @close="attention_close">
          <div class="rounded-2xl overflow-hidden p-1 relative min-h-40">
            <img :src="attentions[attentions.length - 1].image_url" class="w-full rounded-xl h-full" />
            <div class="absolute bottom-0 left-0 right-0 p-4">
              <router-link :to="attentions[attentions.length - 1].page" class="w-full p-4 rounded-2xl bg-pantone_color border-text_color border-b-2 border-r-2 flex justify-center font-medium">
                {{ attentions[attentions.length - 1].button_title }}
              </router-link>
            </div>
          </div>
        </MainModal>

        <Header :league="gameData.total_user_ships" />
        <Stats :coins="gameData.coins" :per_hour="gameData.hourly_income" :eventsData="eventsData" />
        <Ship :ship="gameData.image_url" @getInitialShip="getInitialShip" />
      </main>
    </transition>

    <Navigator
      :uncompleted_tasks="gameData?.uncompleted_tasks > 0"
      :page="'HOME'"
      :buttonText="mainButton.text"
      :earnedCoins="mainButton.earnedCoins"
      :mining_status="gameData?.mining_status"
      @mainButtonClicked="mainButtonClicked"
    />
  </div>
</template>
