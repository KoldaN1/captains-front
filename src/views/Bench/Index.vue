<script setup>
import BottomSheet from "../../components/BottomSheet/BottomSheet.vue";

import { ref, onMounted, getCurrentInstance } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/swiper-bundle.css";
import Counter from "../../components/Bench/Counter.vue";
import Card from "../../components/Bench/Ship.vue";
import Alert from "../../components/Alert/Alert.vue";
import generateId from "../../utils/generateId";
import axiosInstance from "../../utils/axiosInstance";
import axios from "axios";

import Navigator from "../../components/Navigator/Navigator.vue";
import Heading from "../../components/Other/Heading.vue";

const AdController = window.Adsgram.init({ blockId: import.meta.env.VITE_ADSGRAM_BLOCK_ID });

const { proxy } = getCurrentInstance();

const webapp = window.Telegram.WebApp;
const userId = webapp.initDataUnsafe.user?.id;

const loading = ref(true);

const ships = ref(null);

const selected_ship = ref(null);
const open = (ship_id) => {
  if (!ship_id) return;
  selected_ship.value = ship_id;
  is_modal.value = true;
};

const shipIndex = ref(0);

const comeplteEnchanceQuest = async () => {
  try {
    axios.post(import.meta.env.VITE_BOT_API + "/api/tonstation/quest", {
      userId,
      type: "ENCHANCE",
      value: 1,
    });
  } catch (error) {
    console.log(error);
  }
};

const getUserShips = async () => {
  let { data, error } = await axiosInstance.post("/rest/v1/rpc/v8_get_user_ships");
  if (error) console.error(error);
  else ships.value = data;

  if (gameData.value?.ship) {
    shipIndex.value = ships.value.findIndex((ship) => ship.ship_id === gameData.value.ship);
  }
};

const gameData = ref(null);
const buttonActivity = ref(false);

const getUserData = async () => {
  let { data: user, error } = await axiosInstance.post("/rest/v1/rpc/v5_mini_get_user_info");
  if (error) {
    console.error(error);
  } else {
    gameData.value = user;
  }

  await getUserShips();

  loading.value = false;
};

onMounted(async () => {
  await getUserData();
});

const select = async (ship) => {
  webapp.HapticFeedback.impactOccurred("light");
  gameData.value.ship = ship.ship_id;

  let { data, error } = await axiosInstance.post("/rest/v1/rpc/v2_set_active_ship", {
    p_ship_id: ship.ship_id,
  });
};

const buy = async (ship) => {
  if (ship.price <= gameData.value.coins) {
    buttonActivity.value = true;

    let { data, error } = await axiosInstance.post("/rest/v1/rpc/v2_purchase_ship", {
      p_ship_id: ship.ship_id,
    });
    if (error) {
      webapp.HapticFeedback.notificationOccurred("error");
      addAlert(proxy.$t("error"), "error");
    } else {
      if (
        data[0]?.type === "first_ship_not_purchased" ||
        data[0]?.type === "previous_ship_level_too_low" ||
        data[0]?.type === "previous_ships_not_ready"
      ) {
        webapp.HapticFeedback.notificationOccurred("error");
        addAlert(data[0].status, "error");
        return;
      }

      const index = ships.value.findIndex((s) => s.ship_id === ship.ship_id);

      if (index !== -1) {
        comeplteEnchanceQuest();
        ships.value[index].user_level += 1;
        ships.value[index].is_purchased = true;
        gameData.value.coins -= ship.price;
        gameData.value.ship = ship.ship_id;
        gameData.value.hourly_income += ship.income_per_hour;
        ships.value[index].upgrade_cost =
          ships.value[index].upgrade_cost * ships.value[index].update_multiplier * ships.value[index].update_multiplier;
      }

      webapp.HapticFeedback.notificationOccurred("success");
      addAlert(proxy.$t("success"), "success");

      if (gameData.value.coins !== data[0].new_coins) {
        gameData.value.coins = data[0].new_coins;
      }

      if (gameData.value.ship !== data[0].purchased_ship_id) {
        gameData.value.ship = data[0].purchased_ship_id;
      }
    }

    buttonActivity.value = false;
  } else {
    webapp.HapticFeedback.notificationOccurred("warning");
    webapp.showAlert(proxy.$t("not_coins"));
  }
};

const level_up = (ship) => {
  const index = ships.value.findIndex((s) => s.ship_id === ship.ship_id);
  if (index !== -1) {
    ships.value[index].user_level++;
    gameData.value.hourly_income += ship.update_income_level;
    ships.value[index].income_per_hour += ship.update_income_level;
    let newPrice = ships.value[index].upgrade_cost * ships.value[index].update_multiplier;
    ships.value[index].upgrade_cost = newPrice;
  }
};

const restore_ads = () => {
  gameData.value.available_ads = 2;
  gameData.value.ads_restore_time_left = null;
};

const cut_time = async (ship) => {
  const index = ships.value.findIndex((s) => s.ship_id === ship.ship_id);

  if (index !== -1) {
    buttonActivity.value = true;

    AdController.show()
      .then(async (result) => {
        let { data, error } = await axiosInstance.post("/rest/v1/rpc/v6_reduce_upgrade_time", {
          p_ship_id: ship.ship_id,
        });
        if (error) console.error(error);
        else {
          console.log(data);
          if (data[0].new_time_left) {
            ships.value[index].time_left_to_upgrade = data[0].new_time_left;
          } else {
            ships.value[index].time_left_to_upgrade = 1;
          }
        }

        gameData.value.available_ads -= 1;
        gameData.value.ads_restore_time_left = data[0].ads_restore_time_left;
      })
      .catch((result) => {
        console.log(result);
        addAlert(proxy.$t("error"), "error");
      });

    buttonActivity.value = false;
  }
};

const upgrade = async (ship) => {
  if (ship.upgrade_cost <= gameData.value.coins) {
    buttonActivity.value = true;
    const index = ships.value.findIndex((s) => s.ship_id === ship.ship_id);

    if (index !== -1) {
      let { data, error } = await axiosInstance.post("/rest/v1/rpc/v6_upgrade_user_ship", {
        p_ship_id: ship.ship_id,
      });
      if (error) {
        console.log(error);
        addAlert(proxy.$t("error"), "error");
      } else {
        comeplteEnchanceQuest();
        gameData.value.coins -= ship.upgrade_cost;
        ships.value[index].time_left_to_upgrade = data[0].time_left_to_upgrade;

        if (data[0].status === "Boosters activated") {
          addAlert(proxy.$t("booster_activated"), "success");
        } else {
          addAlert(proxy.$t("success"), "success");
        }

        if (gameData.value.coins !== data[0].new_coins) {
          gameData.value.coins = data[0].new_coins;
        }
      }
    }

    buttonActivity.value = false;
  } else {
    webapp.HapticFeedback.notificationOccurred("warning");
    webapp.showAlert(proxy.$t("not_coins"));
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

const is_modal = ref(false);
</script>

<template>
  <transition name="fade" mode="out-in">
    <div v-if="loading" class="flex flex-col gap-y-6 pb-[102px] py-6 px-4 animate-pulse">
      <div class="flex justify-center flex-col items-center gap-y-2">
        <span class="flex h-10 w-40 bg-secondary_bg_color rounded-2xl" />
        <span class="flex h-14 w-80 bg-secondary_bg_color rounded-2xl" />
        <span class="flex h-8 w-32 bg-secondary_bg_color rounded-2xl" />
      </div>

      <span class="flex h-80 w-full bg-secondary_bg_color rounded-2xl" />
      <span class="flex h-40 w-full bg-secondary_bg_color rounded-2xl" />
    </div>

    <main v-else class="flex flex-col gap-y-6 pt-6 pb-[102px]">
      <transition name="fade">
        <div v-if="alerts.length > 0" v-auto-animate class="fixed z-20 top-4 left-4 right-4 flex flex-col gap-y-1.5">
          <Alert v-for="alert in alerts" :key="alert.id" :title="alert.title" :type="alert.type" />
        </div>
      </transition>

      <Heading class="px-4" :title="$t('market_title')" :description="$t('market_description')" />

      <Counter :coins="gameData?.coins || 0" :per_hour="gameData?.hourly_income || 0" />

      <div class="z-0">
        <swiper :slides-per-view="'1.1'" space-between="12px" :initial-slide="shipIndex">
          <swiper-slide v-for="(ship, index) in ships" :key="index" class="swiper-slide">
            <Card
              @openBottomSheet="open"
              :buttonActivity="buttonActivity"
              @restore_ads="restore_ads"
              :ads_restore_time_left="gameData.ads_restore_time_left"
              :available_ads="gameData.available_ads"
              :ship="ship"
              @level_up="level_up"
              :selected_ship="gameData.ship"
              @select="select"
              @buy="buy"
              @upgrade="upgrade"
              @cut_time="cut_time"
            />
          </swiper-slide>
        </swiper>
      </div>
    </main>
  </transition>

  <Navigator :page="'MARKET'" />

  <BottomSheet :is_open="is_modal" @close="() => (is_modal = false)">
    <template #top>
      <router-link
        :to="selected_ship ? { name: 'HIRING_NFTS', params: { id: selected_ship } } : '#'"
        class="text-text_color flex justify-center h-full items-center text-[64px] font-black uppercase"
        >NFT</router-link
      >
    </template>

    <template #bottom>
      <router-link
        :to="selected_ship ? { name: 'HIRING_FRENS', params: { id: selected_ship } } : '#'"
        class="text-white flex justify-center h-full items-center text-[40px] font-black uppercase"
        >Frens</router-link
      >
    </template>
  </BottomSheet>
</template>

<style scoped>
.swiper {
  padding: 0 16px 0 16px;
}
</style>
