<script setup>
import { ref, onMounted, getCurrentInstance, watch } from "vue";
import Leader from "./Leader.vue";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/vue";
import ticket from "../../assets/ticket.svg";

const is_loading = ref(true);
const leaders = ref(null);
const myPostionInTop = ref(null);
const { proxy } = getCurrentInstance();
const selectedTicketCountInLeaderboard = ref(null);

const props = defineProps({
  event_id: Number,
  userId: Number,
});

const swiperItems = ref([]);

onMounted(() => {
  swiperItems.value = [
    {
      id: null,
      title: proxy.$t("anyTicket"),
    },
    {
      id: 1,
      title: proxy.$t("oneTicket"),
    },
    {
      id: 2,
      title: proxy.$t("twoTickets"),
    },
    {
      id: 3,
      title: proxy.$t("threeTickets"),
    },
  ];
});

const getLeaders = async () => {
  if (!props.event_id) return;

  is_loading.value = true;

  const getLeaderboard = await axios.get(import.meta.env.VITE_BOT_API + "/api/event/leaderboard?id=" + props.event_id, {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("jwt_token")}`,
    },
  });

  if (!getLeaderboard || getLeaderboard.status !== 200 || !getLeaderboard.data.success) {
    console.error(getLeaderboard);
    return;
  } else {
    leaders.value = getLeaderboard.data.data;
  }

  is_loading.value = false;
};

const getUserPostion = (newVal) => {
  try {
    if (!leaders?.value.leaderboard) return;
    let newValueTop = leaders?.value.leaderboard.filter((user) => (newVal ? user.tickets == newVal : true)).findIndex((user) => user.user == props.userId);
    if (newValueTop > -1) {
      myPostionInTop.value = newValueTop + 1;
    } else {
      myPostionInTop.value = null;
    }
  } catch (error) {
    console.error(error);
  }
};

onMounted(async () => {
  await getLeaders();
  await getUserPostion(null);
});

watch(selectedTicketCountInLeaderboard, async (newVal) => {
  getUserPostion(newVal);
});
</script>

<template>
  <transition name="fade" mode="out-in" appear>
    <div v-if="leaders" class="bg-secondary_bg_color flex flex-col gap-y-3 py-4 px-6 rounded-3xl">
      <div class="flex justify-between items-center">
        <span class="font-semibold">{{ $t("leaders") }}</span>
        <span class="text-xs font-medium text-hint_color bg-bg_color flex justify-center items-center rounded-2xl px-2 py-1"
          >{{ $t("position") }} {{ myPostionInTop > 10000 ? ">10k" : myPostionInTop || "-" }}</span
        >
      </div>

      <div class="tickets_swiper z-0">
        <swiper class="flex flex-row" :slides-per-view="1.5" space-between="8px">
          <swiper-slide v-for="(item, index) in swiperItems" :key="index" class="tickets__count__swiper">
            <div
              class="flex flex-row gap-x-2 items-center cursor-pointer bg-bg_color rounded-2xl py-2 px-4 hover:bg-yellow-500 transition-all duration-300"
              @click="selectedTicketCountInLeaderboard = item.id"
              :class="selectedTicketCountInLeaderboard === item.id ? 'bg-yellow-500' : ''"
            >
              <img :src="ticket" class="w-4 h-4" alt="ticket" />
              <p>{{ item.title }}</p>
            </div>
          </swiper-slide>
        </swiper>
      </div>

      <div v-if="leaders?.leaderboard" class="flex flex-col gap-y-2">
        <Leader
          v-for="(user, index) in leaders?.leaderboard.filter((user) => (selectedTicketCountInLeaderboard ? user.tickets == selectedTicketCountInLeaderboard : true))"
          :key="index"
          :user="user"
          :position="index + 1"
        />
      </div>
    </div>
  </transition>
</template>
