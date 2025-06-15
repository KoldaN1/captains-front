<script setup>
import { ref, onMounted, onUnmounted, reactive, watch, getCurrentInstance, computed } from "vue";

import axiosInstance from "../../utils/axiosInstance";

import { useRouter, useRoute } from "vue-router";
import Heading from "../../components/Other/Heading.vue";
import { Icon } from "@iconify/vue/dist/iconify.js";
import Ship from "../../components/Index/Ship.vue";
import BSheet from "../../components/BottomSheet/BSheet.vue";
import formatToUserTime from "../../utils/formateToUserTime";
import Leadboard from "../../components/Event/Leadboard.vue";
import axios from "axios";
import Counters from "../../components/Event/Counters.vue";
import formatNumber from "../../utils/formatNumber";
import shipWhite from "../../assets/ship-white.svg";
import ticket from "../../assets/ticket.svg";
import pirateCross from "../../assets/pirate-cross.svg";
import Boosters from "../../components/Boosters/Boosters.vue";

const { proxy } = getCurrentInstance();

const webapp = window.Telegram.WebApp;

const router = useRouter();
const route = useRoute();

const isBoostersVisible = ref(false);

const back = () => {
  if (window.history.length > 1) {
    router.go(-1);
  } else {
    router.push({ name: "INDEX" });
  }
};

const bottomSheetIsOpen = ref(false);
const loading = ref(true);

const eventData = ref(null);
const boostersCost = ref(null);

const userId = webapp.initDataUnsafe.user?.id;
const completeFarmQuest = async () => {
  try {
    axios.post(import.meta.env.VITE_BOT_API + "/api/tonstation/quest", {
      userId: userId,
      type: "FARM",
      value: 1,
    });
  } catch (error) {
    console.log(error);
  }
};

const getEvent = async () => {
  loading.value = true;
  let event_id = route.params.id;
  let response = await axios.get(import.meta.env.VITE_BOT_API + "/api/event/", {
    params: {
      id: event_id,
    },
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("jwt_token")}`,
    },
  });
  if (!response || response.status !== 200 || !response.data.success) {
    console.log(response);
    return;
  } else {
    eventData.value = response.data.data;
  }
  loading.value = false;
};

const getBoosterCost = async () => {
  let response = await axios.post(
    import.meta.env.VITE_BOT_API + "/api/boosters/cost",
    {
      eventData: eventData.value,
      eventUser: userData.value[0],
      getUserBoosters: eventData.value.userBoosters,
    },
    {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("jwt_token")}`,
      },
    }
  );
  if (!response || response.status !== 200 || !response.data.success) {
    console.log(response);
    return;
  } else {
    boostersCost.value = response.data.data;
  }
};

const mainButtonText = ref("Get ticket");
const mining_status = reactive({
  status: null,
  remaining_time_seconds: null,
});

let countdownInterval = null;

watch(
  () => mining_status.status,
  (newStatus) => {
    if (newStatus === "Mining completed, collect your coins") {
      mainButtonText.value = proxy.$t("claim_your_coins");
    } else if (newStatus === "Mining not started" || newStatus === "Mining completed and rewards claimed") {
      mainButtonText.value = proxy.$t("start_mining");
    }
  }
);

const startCountdown = (remainingSeconds) => {
  if (countdownInterval) {
    clearInterval(countdownInterval);
  }

  const updateCountdown = () => {
    if (remainingSeconds <= 0) {
      clearInterval(countdownInterval);
      mainButtonText.value = proxy.$t("claim_your_coins");
      mining_status.status = "Mining completed, collect your coins";
      return;
    }

    const hours = Math.floor(remainingSeconds / 3600);
    const minutes = Math.floor((remainingSeconds % 3600) / 60);
    const seconds = remainingSeconds % 60;

    let timeString = "";
    if (hours > 0) timeString += `${hours}${proxy.$t("h")} `;
    if (minutes > 0 || hours > 0) timeString += `${minutes}${proxy.$t("m")} `;
    timeString += `${seconds}${proxy.$t("s")}`;

    mainButtonText.value = timeString;
    remainingSeconds--;
  };

  updateCountdown();
  countdownInterval = setInterval(updateCountdown, 1000);
};

watch(
  () => mining_status.remaining_time_seconds,
  (newTime) => {
    if (newTime) {
      startCountdown(newTime);
    }
  }
);

const userData = ref(null);
const loadingUserData = ref(true);
const getUserData = async () => {
  loadingUserData.value = true;

  let event_id = route.params.id;
  let { data, error } = await axiosInstance.post("/rest/v1/rpc/get_user_event_data", {
    p_event_id: event_id,
  });
  if (error) console.error(error);
  else {
    userData.value = data;

    if (!data[0].is_participant) {
      bottomSheetIsOpen.value = true;
    } else {
      mining_status.status = data[0]?.mining_status;
      mining_status.remaining_time_seconds = data[0]?.remaining_time_seconds;
    }
  }

  loadingUserData.value = false;
};

const activeTab = ref(1);

onMounted(async () => {
  webapp.onEvent("backButtonClicked", back);
  webapp.BackButton.show();

  await getEvent();
  await getUserData();
  await getBoosterCost();
});

onUnmounted(() => {
  webapp.offEvent("backButtonClicked", back);
  webapp.BackButton.hide();

  clearTimeout(countdownInterval);
});

const mine = async () => {
  if (!userData.value || !userData.value[0].is_participant) {
    bottomSheetIsOpen.value = true;
    return;
  }

  webapp.HapticFeedback.impactOccurred("light");

  let event_id = route.params.id;
  let { data, error } = await axiosInstance.post("/rest/v1/rpc/start_or_claim_mining", {
    p_event_id: event_id,
  });
  if (error) console.error(error);
  else {
    if (data) {
      completeFarmQuest();
      userData.value[0].coins = data[0].current_balance_coins;
      userData.value[0].partner_coins = data[0].current_balance_partner_coins;

      mining_status.status = data[0].status;
      mining_status.remaining_time_seconds = data[0].remaining_time_seconds;
    }
  }
};

const nft_to_tickets_is_load = ref(false);
const nft_to_tickets = async () => {
  nft_to_tickets_is_load.value = true;
  let event_id = route.params.id;
  let { data, error } = await axiosInstance.post("/rest/v1/rpc/join_event_with_nft_tickets", {
    p_event_id: event_id,
  });
  if (error) console.error(error);
  else {
    completeFarmQuest();
    if (userData.value && data?.tickets) {
      userData.value[0].tickets = data.tickets;
      userData.value[0].is_participant = true;
      bottomSheetIsOpen.value = false;
      mining_status.status = "Mining not started";
    }
  }

  nft_to_tickets_is_load.value = false;
};

const p_id = ref(null);
const buy_tickets_is_load = ref(false);
const buy_tickets = async (tickets) => {
  buy_tickets_is_load.value = true;
  let event_id = route.params.id;
  p_id.value = Math.floor(100000 + Math.random() * 900000);

  const payment_data = await axios.post(
    import.meta.env.VITE_BOT_API + "/api/tickets",
    {
      paymentId: p_id.value,
      eventId: event_id,
      tickets,
    },
    {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("jwt_token")}`,
      },
    }
  );

  buy_tickets_is_load.value = false;

  if (payment_data?.data?.invoiceLink) {
    webapp.openInvoice(payment_data.data.invoiceLink, async (status) => {
      if (status === "paid") {
        completeFarmQuest();
        userData.value[0].is_participant = true;
        userData.value[0].tickets = tickets;
        bottomSheetIsOpen.value = false;
        mining_status.status = "Mining not started";
      }
    });
  }
};

const joinLoaded = ref(false);

const isFarming = computed(() => {
  return eventData.value && new Date() > new Date(eventData.value.start_date) && new Date() < new Date(eventData.value.end_date);
});

const getTicketButtonColor = computed(() => {
  if (isFarming.value) return "bg-[#34C3C0] text-white uppercase";

  if (userData.value && userData.value[0].is_participant) {
    return "bg-button_color text-white uppercase";
  }

  return "bg-secondary_bg_color text-text_color uppercase";
});

const joinInPartnerNFT = async () => {
  let api = eventData.value[0]?.api;
  if (!api) return;

  joinLoaded.value = true;
  let event_id = route.params.id;

  try {
    let response = await axiosInstance.post(api, {
      event_id: event_id,
      user_id: webapp.initDataUnsafe.user?.id,
    });

    if (response?.data?.tickets) {
      if (userData.value) {
        userData.value[0].tickets = response.data.tickets;
        userData.value[0].is_participant = true;
        bottomSheetIsOpen.value = false;
        mining_status.status = "Mining not started";
      }
    }
  } catch (ex) {
    console.log(ex);
  }

  joinLoaded.value = false;
};

const accept_special_offer = async () => {
  let cost = userData.value[0]?.special_offer?.total_cost;
  if (!cost) return;

  buy_tickets_is_load.value = true;
  let tickets = 3;
  let event_id = route.params.id;
  p_id.value = Math.floor(100000 + Math.random() * 900000);

  const payment_data = await axios.post(
    import.meta.env.VITE_BOT_API + "/api/tickets",
    {
      paymentId: p_id.value,
      eventId: event_id,
      offer: true,
    },
    {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("jwt_token")}`,
      },
    }
  );

  buy_tickets_is_load.value = false;

  if (payment_data?.data?.invoiceLink) {
    webapp.openInvoice(payment_data.data.invoiceLink, async (status) => {
      if (status === "paid") {
        completeFarmQuest();
        userData.value[0].is_participant = true;
        userData.value[0].tickets = tickets;
        userData.value[0].partner_coins = userData.value[0]?.special_offer.claimable_coins;
        userData.value[0].coins += Math.floor(userData.value[0].special_offer.missed_claims / 2) * (userData.value[0].approx_hourly_income * 8);
        bottomSheetIsOpen.value = false;
        mining_status.status = "Mining not started";
      }
    });
  }
};
</script>

<template>
  <BSheet v-if="eventData && eventData.status_code === 0" :is_open="bottomSheetIsOpen" @close="bottomSheetIsOpen = false">
    <div v-if="eventData && userData" class="flex justify-center flex-col gap-y-4">
      <div class="flex justify-center">
        <img src="../../assets/tickets.svg" class="w-20" />
      </div>
      <h1 class="font-semibold text-xl text-center">{{ $t("cruise") }}</h1>
      <div v-if="userData && !userData[0].is_participant && userData[0].nft_data?.max_tickets_from_nft < 1" class="flex gap-x-2.5 items-center bg-pantone_color text-white px-4 py-3 rounded-2xl">
        <Icon icon="nonicons:error-16" class="text-2xl shrink-0" />
        <span class="text-xs font-medium">{{ $t("cruise_attention") }}</span>
      </div>
      <div v-if="userData[0]?.special_offer && !userData[0].is_participant" class="flex relative overflow-hidden flex-col gap-y-1 bg-secondary_bg_color p-4 rounded-2xl">
        <div class="flex z-10 gap-x-1 items-center animate-pulse">
          <Icon icon="bxs:offer" class="text-xl text-button_color" />
          <span class="font-semibold">{{ $t("special_offer") }}</span>
        </div>
        <span class="text-xs z-10 text-hint_color">{{ $t("special_offer_description") }}</span>
        <div class="mt-2 flex gap-x-2 items-center justify-between flex-wrap">
          <div class="flex gap-x-2">
            <span class="bg-bg_color flex gap-x-1 rounded-2xl h-10 text-sm px-4 justify-center items-center font-medium">
              <span>{{ formatNumber(userData[0]?.special_offer.claimable_coins) }}</span>
              <span class="w-6 aspect-square rounded-[4px] overflow-hidden"><img :src="eventData.partner_logo" /></span>
            </span>

            <span class="bg-bg_color flex gap-x-1 rounded-2xl h-10 text-sm px-4 justify-center items-center font-medium">
              <span>3</span>
              <Icon icon="fluent:ticket-diagonal-16-filled" class="text-lg text-pantone_color" />
            </span>
          </div>

          <button @click="accept_special_offer" class="flex text-sm bg-pantone_color text-white px-6 h-10 justify-center items-center rounded-xl border-b-2 border-r-2 border-text_color">
            <div v-if="!buy_tickets_is_load" class="flex items-center gap-x-0.5 font-medium text-white">
              <span>{{ userData[0]?.special_offer?.total_cost }}</span>
              <Icon icon="mingcute:star-fill" />
            </div>

            <Icon v-else icon="line-md:loading-loop" class="text-lg" />
          </button>
        </div>
      </div>

      <div class="text-sm flex flex-col gap-y-4">
        <div class="grid grid-cols-3 gap-2">
          <div class="bg-secondary_bg_color p-4 rounded-2xl flex flex-col items-center">
            <div class="flex items-center mb-2">
              <div class="flex items-center gap-x-0.5">
                <Icon v-for="el in 1" icon="fluent:ticket-diagonal-16-filled" class="text-lg text-pantone_color" />
              </div>
            </div>

            <div class="flex mb-3 flex-col text-xs gap-y-2 justify-center items-center">
              <span class="font-medium text-sm">1 {{ $t("tip") }}</span>
              <span class="text-hint_color text-center border-pantone_color pl-1.5">{{ $t("partner_hourly", { tokens: eventData.hourly_tokens["1ticket"], partner: eventData.partner }) }}</span>
            </div>

            <button
              :disabled="buy_tickets_is_load"
              @click="buy_tickets(1)"
              v-if="userData[0].tickets < 1"
              class="flex w-full border-r-2 border-b-2 border-text_color text-white items-center h-10 gap-x-0.5 bg-pantone_color rounded-xl py-2 text-sm justify-center font-semibold"
            >
              <div v-if="!buy_tickets_is_load" class="flex gap-x-0.5 items-center">
                <span>{{ eventData.prices["1ticket"] }}</span>
                <Icon icon="mingcute:star-fill" />
              </div>

              <Icon v-else icon="line-md:loading-loop" class="text-lg" />
            </button>

            <div v-else class="flex w-full border-r-2 border-b-2 border-text_color items-center gap-x-0.5 bg-bg_color h-10 rounded-xl py-2 text-sm justify-center font-semibold">
              <Icon icon="ic:round-check" class="text-lg" />
            </div>
          </div>

          <div class="bg-secondary_bg_color p-4 rounded-2xl flex flex-col items-center">
            <div class="flex items-center mb-2">
              <div class="flex items-center gap-x-0.5">
                <Icon v-for="el in 2" icon="fluent:ticket-diagonal-16-filled" class="text-lg text-pantone_color" />
              </div>
            </div>

            <div class="flex mb-3 flex-col text-xs gap-y-2 justify-center items-center">
              <span class="font-medium text-sm">2 {{ $t("tips_a") }}</span>
              <span class="text-hint_color text-center border-pantone_color pl-1.5">{{ $t("partner_hourly", { tokens: eventData.hourly_tokens["2ticket"], partner: eventData.partner }) }}</span>
            </div>

            <button
              :disabled="buy_tickets_is_load"
              @click="buy_tickets(2)"
              v-if="userData[0].tickets < 2"
              class="flex w-full text-white border-r-2 border-b-2 border-text_color items-center h-10 gap-x-0.5 bg-pantone_color rounded-xl py-2 text-sm justify-center font-semibold"
            >
              <div v-if="!buy_tickets_is_load" class="flex gap-x-0.5 items-center">
                <span>{{ userData[0].tickets === 0 ? eventData.prices["2ticket"] : userData[0].tickets === 1 ? eventData.prices["2ticket"] - eventData.prices["1ticket"] : 0 }}</span>
                <Icon icon="mingcute:star-fill" />
              </div>

              <Icon v-else icon="line-md:loading-loop" class="text-lg" />
            </button>

            <div v-else class="flex w-full border-r-2 border-b-2 border-text_color items-center gap-x-0.5 bg-bg_color h-10 rounded-xl py-2 text-sm justify-center font-semibold">
              <Icon icon="ic:round-check" class="text-lg" />
            </div>
          </div>

          <div class="bg-secondary_bg_color p-4 rounded-2xl flex flex-col items-center">
            <div class="flex items-center mb-2">
              <div class="flex items-center gap-x-0.5">
                <Icon v-for="el in 3" icon="fluent:ticket-diagonal-16-filled" class="text-lg text-pantone_color" />
              </div>
            </div>

            <div class="flex mb-3 flex-col text-xs gap-y-2 justify-center items-center">
              <span class="font-medium text-sm">3 {{ $t("tips_a") }}</span>
              <span class="text-hint_color text-center border-pantone_color pl-1.5">{{ $t("partner_hourly", { tokens: eventData.hourly_tokens["3ticket"], partner: eventData.partner }) }}</span>
            </div>

            <button
              :disabled="buy_tickets_is_load"
              @click="buy_tickets(3)"
              v-if="userData[0].tickets < 3"
              class="flex text-white w-full border-r-2 border-b-2 border-text_color items-center h-10 gap-x-0.5 bg-pantone_color rounded-xl py-2 text-sm justify-center font-semibold"
            >
              <div v-if="!buy_tickets_is_load" class="flex gap-x-0.5 items-center">
                <span>{{
                  userData[0].tickets === 0
                    ? eventData.prices["3ticket"]
                    : userData[0].tickets === 1
                    ? eventData.prices["3ticket"] - eventData.prices["1ticket"]
                    : userData[0].tickets === 2
                    ? eventData.prices["3ticket"] - eventData.prices["2ticket"]
                    : 0
                }}</span>
                <Icon icon="mingcute:star-fill" />
              </div>

              <Icon v-else icon="line-md:loading-loop" class="text-lg" />
            </button>

            <div v-else class="flex w-full border-r-2 border-b-2 border-text_color items-center gap-x-0.5 bg-bg_color h-10 rounded-xl py-2 text-sm justify-center font-semibold">
              <Icon icon="ic:round-check" class="text-lg" />
            </div>
          </div>
        </div>

        <div v-if="eventData?.nft_entry">
          <a
            v-if="!userData[0].nft_data?.max_tickets_from_nft"
            href="https://getgems.io/collection/EQBwTEjlCCJzAX-sS4lawB1xLBv6Dg-yO95Qb8Jvn5YLNWHn#items"
            target="_blank"
            class="w-full flex justify-center border-r-2 border-b-2 border-text_color items-center rounded-2xl h-12 bg-purple-500 text-white font-semibold"
          >
            {{ $t("buy_nft") }}
          </a>

          <button
            :disabled="nft_to_tickets_is_load"
            @click="nft_to_tickets"
            v-else-if="!userData[0].tickets"
            class="w-full flex justify-center border-r-2 border-b-2 border-text_color items-center rounded-2xl h-12 bg-purple-500 text-white font-semibold"
          >
            <Icon v-if="nft_to_tickets_is_load" icon="line-md:loading-loop" class="text-lg" />
            <span v-else>{{ $t("nft_tickets", { tips: userData[0].nft_data?.max_tickets_from_nft }) }}</span>
          </button>
        </div>

        <div v-else>
          <button class="w-full flex justify-center border-r-2 border-b-2 border-text_color items-center rounded-2xl h-12 bg-red-500 text-white font-semibold">
            <span>{{ $t("nftEntry") }}</span>
          </button>
        </div>

        <button @disabled="joinLoaded" v-if="eventData?.api && !userData[0]?.tickets" @click="joinInPartnerNFT" class="text-purple-500 animate-pulse font-medium">
          <span v-if="!joinLoaded">*{{ $t("enter_partner_nfts") }} {{ eventData.partner }}</span>
          <span v-else>Checking...</span>
        </button>

        <span v-if="!userData[0].nft_data?.max_tickets_from_nft" class="text-xs px-4 text-hint_color text-center">{{ $t("nft_from_event") }}</span>
      </div>
    </div>
  </BSheet>

  <transition name="fade" mode="out-in" appear>
    <div v-if="!loading">
      <div v-if="eventData && eventData?.status_code === 0 && userData && userData[0]">
        <main class="flex flex-col gap-y-6 py-6 pb-36">
          <Heading class="px-4" :title="$t('farpad_event_title')" :description="$t('farpad_event_description')" />

          <Counters v-if="userData && eventData" :userData="userData[0]" :eventData="eventData" :partner_coins="userData[0].partner_coins" />

          <div class="flex justify-center items-center px-12">
            <div class="bg-secondary_bg_color gap-x-2 flex w-full rounded-2xl p-1">
              <button @click="activeTab = 1" :class="['flex w-1/2 font-medium text-sm items-center justify-center py-1 rounded-2xl', activeTab === 1 && 'bg-[#EAB308] text-white']">
                {{ $t("event_ship") }}
              </button>
              <button @click="activeTab = 2" :class="['flex w-1/2 font-medium text-sm items-center justify-center py-1 rounded-2xl', activeTab === 2 && 'bg-[#EAB308] text-white']">
                {{ $t("event_leaderboard") }}
              </button>
            </div>
          </div>

          <transition name="fade" mode="out-in" appear>
            <div v-if="activeTab === 1" class="flex flex-col gap-y-4">
              <div class="flex justify-center gap-x-2 px-4">
                <div class="bg-secondary_bg_color w-1/3 h-14 gap-y-1 text-sm justify-center items-start p-2 rounded-xl flex flex-col">
                  <span class="text-hint_color font-medium">{{ $t("tickets") }}</span>
                  <span class="flex items-center gap-x-1.5">
                    <img src="/src/assets/ticket.svg" alt="ticket" />
                    <span v-if="!loadingUserData && userData" class="font-semibold">{{ userData[0].tickets }} {{ $t("farming") }}</span>
                    <span v-else class="flex w-10 h-3 bg-bg_color animate-pulse rounded-full" />
                  </span>
                </div>
                <button v-if="userData[0].tickets" class="bg-[#34C3C0] text-sm justify-center items-start p-2 gap-y-1 pt-2 rounded-xl flex flex-col" @click="isBoostersVisible = true">
                  <span class="text-white font-medium">{{ $t("getBoosters") }}</span>
                  <img :src="pirateCross" alt="pirate-cross" class="self-end" />
                </button>
              </div>

              <div class="px-4">
                <Ship :ship="eventData.ship_image" />
              </div>
            </div>
            <Leadboard :event_id="eventData.id" :userId="userId" v-else />
          </transition>
        </main>

        <div class="flex flex-col bg-bg_color justify-center gap-y-2.5 items-center p-4 pb-6 fixed bottom-0 right-0 left-0">
          <button
            :disabled="mining_status?.status?.includes('Mining in progress') || !eventData || new Date(eventData.start_date) > new Date()"
            :class="['w-full relative px-4 grid grid-cols-[1fr_30px] items-center rounded-2xl h-16 text-lg font-medium', getTicketButtonColor]"
            @click="mine"
          >
            <span v-if="isFarming">{{ mainButtonText }}</span>
            <span v-else-if="new Date(eventData.start_date) > new Date()">{{ formatToUserTime(eventData.start_date) }}</span>
            <span v-else>{{ $t("getTicket") }}</span>

            <img :src="shipWhite" alt="ship" v-if="isFarming" class="right" />
            <img v-else-if="!isFarming" :src="ticket" alt="ship" class="absolute right-6 w-[21px] h-[21px] event__icon-ticket" />
            <span v-else class="absolute right-6">
              <Icon icon="heroicons:lock-closed" class="text-xl" />
            </span>
          </button>
          <span class="font-medium text-sm"
            >{{ $t("event_end_date") }} <span class="text-hint_color">{{ formatToUserTime(eventData.end_date) }}</span></span
          >
          <transition name="slide-bottom">
            <div class="absolute inset-x-0 bottom-0 bg-bg_color transform" v-if="isBoostersVisible">
              <Boosters @close="isBoostersVisible = false" :eventData="eventData" :userData="userData" :boostersCost="boostersCost" />
            </div>
          </transition>
        </div>
      </div>

      <div v-else class="flex justify-center relative items-center h-screen p-4">
        <span class="font-medium text-center">{{ eventData?.length > 0 ? eventData.status : "Event not found" }}</span>
        <div class="fixed bottom-0 left-0 right-0 flex justify-center items-center p-4 bg-bg_color">
          <router-link class="w-full h-12 active:opacity-75 text-text_color transition-all bg-hint_color justify-center items-center flex text-lg font-medium rounded-2xl" :to="{ name: 'INDEX' }">{{
            $t("back")
          }}</router-link>
        </div>
      </div>
    </div>

    <div v-else class="flex flex-col gap-y-4 justify-center items-center py-6 px-4">
      <span class="w-16 h-16 rounded-2xl bg-secondary_bg_color animate-pulse" />
      <span class="w-48 h-10 rounded-2xl bg-secondary_bg_color animate-pulse" />
      <span class="w-full h-20 rounded-2xl bg-secondary_bg_color animate-pulse" />
      <span class="w-full h-32 rounded-2xl bg-secondary_bg_color animate-pulse" />
      <span class="w-48 h-10 rounded-2xl bg-secondary_bg_color animate-pulse" />
      <span class="w-full h-40 rounded-2xl bg-secondary_bg_color animate-pulse" />
    </div>
  </transition>
</template>
<style lang="scss" scoped>
.event {
  &__icon-ticket {
    filter: brightness(0) invert(1);
  }
}

.slide-bottom-enter-active,
.slide-bottom-leave-active {
  transition: transform 0.3s ease;
}

.slide-bottom-enter-from,
.slide-bottom-leave-to {
  transform: translateY(100%);
}
</style>
