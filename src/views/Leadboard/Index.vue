<script setup>
import { ref, onMounted, onUnmounted, reactive } from "vue";
import axiosInstance from "../../utils/axiosInstance";
import formatNumber from "../../utils/formatNumber";
import League from "../../components/Leadboard/League.vue";
import { Icon } from "@iconify/vue";
import { useRouter } from "vue-router";
import Heading from "../../components/Other/Heading.vue";

const router = useRouter();

const back = () => {
  if (window.history.length > 1) {
    router.go(-1);
  } else {
    router.push({ name: "INDEX" });
  }
};

const total_league = 9;
const loading = ref(true);
const webapp = window.Telegram.WebApp;
const current_league = ref(null);

const leadboard = ref(null);
const loadLeague = reactive({
  prev: false,
  next: false,
});
const profile = ref(null);

const getLeadboardInfo = async (league) => {
  let { data, error } = await axiosInstance.post("/rest/v1/rpc/v5_get_top_100_players_by_income_and_league", {
    p_league_ship_count: league,
  });
  if (error) console.error(error);
  else {
    leadboard.value = data;
    current_league.value = data.user_league_ship_count;
    if (data?.my_info) {
      profile.value = data.my_info;
    }
  }
};

onMounted(async () => {
  webapp.onEvent("backButtonClicked", back);
  webapp.BackButton.show();

  await getLeadboardInfo();

  loading.value = false;
});

onUnmounted(() => {
  webapp.offEvent("backButtonClicked", back);
  webapp.BackButton.hide();
});

const prevLeague = async () => {
  let newLeague = current_league.value - 1;
  if (newLeague >= 1) {
    loadLeague.prev = true;
    await getLeadboardInfo(newLeague);
    loadLeague.prev = false;
  }
};

const nextLeague = async () => {
  let newLeague = current_league.value + 1;
  if (newLeague <= total_league) {
    loadLeague.next = true;
    await getLeadboardInfo(newLeague);
    loadLeague.next = false;
  }
};
</script>

<template>
  <div class="flex flex-col gap-y-6 px-4 pt-6 pb-4">
    <Heading :title="$t('leadboard')" :description="$t('leadboard_description')" />

    <transition name="fade" mode="out-in">
      <div v-if="!loading" class="flex flex-col gap-y-6">
        <div v-if="profile">
          <div class="flex rounded-2xl p-4 bg-secondary_bg_color gap-x-2.5 items-center">
            <span
              class="flex w-11 rounded-full justify-center items-center text-xs font-semibold bg-bg_color aspect-square"
              >#{{ profile.rank }}</span
            >

            <div class="flex flex-col text-sm">
              <span class="font-medium">{{ $t("your_profile") }}</span>
              <div class="flex items-center gap-x-2">
                <League :league="profile.ship_count" />
              </div>
            </div>
          </div>
        </div>

        <div class="flex justify-between items-center">
          <div class="flex flex-col">
            <span class="text-sm flex gap-x-1 text-hint_color">
              <span>{{ $t("current_league") }}: {{ current_league }}</span>
              <span class="opacity-50">{{ $t("from") }} {{ total_league }}</span>
            </span>
            <League :league="current_league" />
          </div>

          <div class="flex gap-x-2">
            <button
              :disabled="!current_league || current_league <= 1 || loadLeague.prev || loadLeague.next"
              @click="prevLeague"
              :class="[
                'w-10 aspect-square flex rounded-xl justify-center items-center bg-secondary_bg_color text-2xl active:opacity-75 transition-all',
                current_league <= 1 && 'opacity-50',
              ]"
            >
              <Icon v-if="!loadLeague.prev" icon="iconamoon:arrow-left-2-bold" />
              <Icon v-else icon="line-md:loading-twotone-loop" class="text-xl" />
            </button>
            <button
              :disabled="!current_league || current_league >= total_league || loadLeague.prev || loadLeague.next"
              @click="nextLeague"
              :class="[
                'w-10 aspect-square flex rounded-xl justify-center items-center bg-secondary_bg_color text-2xl active:opacity-75 transition-all',
                current_league >= total_league && 'opacity-50',
              ]"
            >
              <Icon v-if="!loadLeague.next" icon="iconamoon:arrow-right-2-bold" />
              <Icon v-else icon="line-md:loading-twotone-loop" class="text-xl" />
            </button>
          </div>
        </div>

        <div v-if="leadboard && leadboard.top_users && leadboard.top_users.length > 0" class="flex flex-col gap-y-2">
          <div v-for="(user, index) in leadboard.top_users" :key="index" class="flex gap-x-2.5 items-center">
            <span
              class="flex w-11 rounded-full justify-center items-center text-xs shrink-0 font-semibold bg-secondary_bg_color aspect-square"
            >
              <span v-if="user.rank > 3">#{{ user.rank }}</span>

              <span class="text-sm font-medium text-nowrap" v-else>
                <Icon class="text-2xl" v-if="user.rank === 1" icon="fluent-emoji-high-contrast:1st-place-medal" />
                <Icon class="text-2xl" v-else-if="user.rank === 2" icon="fluent-emoji-high-contrast:2nd-place-medal" />
                <Icon class="text-2xl" v-else-if="user.rank === 3" icon="fluent-emoji-high-contrast:3rd-place-medal" />
                <span v-else class="text-sm font-medium">#{{ user.rank }}</span>
              </span>
            </span>

            <div class="flex justify-between w-full text-sm items-center">
              <span v-if="user.username" class="font-medium overflow-clip">{{
                user.username && user.username?.slice(0, 20) + (user.username?.length > 20 ? ".." : "")
              }}</span>
              <span v-else-if="user.name" class="font-medium overflow-clip">{{
                (user.name && user.name?.slice(0, 20) + (user.name?.length > 20 ? ".." : "")) || "Hidden user"
              }}</span>
              <span class="font-medium flex flex-col items-end gap-x-1">
                <span class="text-yellow-500">~{{ formatNumber(user.coins) }}</span>
                <span class="text-xs text-hint_color">{{ $t("in_hour") }} {{ formatNumber(user.hourly_income) }}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="flex flex-col gap-y-6 animate-pulse">
        <div class="flex rounded-2xl p-4 bg-secondary_bg_color gap-x-2.5 items-center h-20" />

        <div class="flex justify-between items-center">
          <span class="w-40 h-10 bg-secondary_bg_color rounded-2xl"></span>
          <div class="flex gap-x-2">
            <span v-for="i in 2" :key="i" class="h-10 aspect-square bg-secondary_bg_color rounded-2xl flex" />
          </div>
        </div>

        <div class="flex flex-col gap-y-4">
          <div v-for="el in 10" class="flex justify-between items-center">
            <div class="flex gap-x-2 items-center">
              <span class="w-10 aspect-square flex bg-secondary_bg_color rounded-full"></span>
              <span class="w-40 h-8 bg-secondary_bg_color rounded-2xl flex"></span>
            </div>

            <span class="w-32 h-8 bg-secondary_bg_color rounded-2xl flex"></span>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>
