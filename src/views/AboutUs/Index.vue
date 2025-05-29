<script setup>
import { ref, onMounted, onUnmounted } from "vue";

import { useRouter } from "vue-router";
import axiosInstance from "../../utils/axiosInstance";

import Heading from "../../components/Other/Heading.vue";
const webapp = window.Telegram.WebApp;
import formatNumber from "../../utils/formatNumber";

const router = useRouter();

const back = () => {
  if (window.history.length > 1) {
    router.go(-1);
  } else {
    router.push({ name: "INDEX" });
  }
};

const total_users = ref(null);

const getTotalUsers = async () => {
  let { data, error } = await axiosInstance.post("/rest/v1/rpc/get_total_users");
  if (error) {
    console.log(error);
  } else {
    total_users.value = data;
  }
};

onMounted(async () => {
  webapp.onEvent("backButtonClicked", back);
  webapp.BackButton.show();

  getTotalUsers();
});

onUnmounted(() => {
  webapp.offEvent("backButtonClicked", back);
  webapp.BackButton.hide();
});

const faqItems = ref([
  {
    question: "what_is_captains_bay",
    answer: "what_is_captains_bay_answer",
    isOpen: false,
  },
  {
    question: "why_play_captains_bay",
    answer: "why_play_captains_bay_answer",
    isOpen: false,
  },
  {
    question: "what_are_raids",
    answer: "what_are_raids_answer",
    isOpen: false,
  },
  {
    question: "what_is_treasury",
    answer: "what_is_treasury_answer",
    isOpen: false,
  },
  {
    question: "how_to_earn",
    answer: "how_to_earn_answer",
    isOpen: false,
  },
  {
    question: "why_invite_friends",
    answer: "why_invite_friends_answer",
    isOpen: false,
  },
  {
    question: "why_buy_nft",
    answer: "why_buy_nft_answer",
    isOpen: false,
  },
  {
    question: "when_token_listing",
    answer: "when_token_listing_answer",
    isOpen: false,
  },
]);

const toggleFaq = (index) => {
  faqItems.value[index].isOpen = !faqItems.value[index].isOpen;
};
</script>

<template>
  <transition name="fade" mode="out-in" appear>
    <main class="flex flex-col gap-y-8">
      <div class="flex flex-col gap-y-4 px-4 pt-6">
        <Heading :title="$t('about_us')" :description="$t('about_description')" />

        <div class="flex flex-col gap-y-4">
          <img src="../../assets/shot.png" class="w-full rounded-xl" />

          <div class="flex flex-col gap-y-2 text-sm">
            <span>{{ $t("about_description_1") }}</span>
            <span>{{ $t("about_description_2") }}</span>
          </div>

          <div class="grid grid-cols-3 gap-2">
            <div class="bg-secondary_bg_color gap-y-0.5 rounded-xl p-2 py-4 flex flex-col justify-center items-center">
              <span class="text-[10px] text-xs text-hint_color text-center">{{ $t("launch_date") }}</span>
              <span class="text-sm sm:text-base font-bold text-center">18.06 2024</span>
            </div>

            <div class="bg-secondary_bg_color gap-y-0.5 rounded-xl p-2 py-4 flex flex-col justify-center items-center">
              <span class="text-[10px] text-xs text-hint_color text-center">{{ $t("users") }}</span>
              <span class="text-sm sm:text-base font-bold text-center"
                >~{{ total_users ? formatNumber(total_users) : "Load..." }}</span
              >
            </div>

            <a
              href="https://t.me/trendingapps/314"
              target="_blank"
              class="bg-secondary_bg_color relative gap-y-0.5 rounded-xl p-2 py-4 flex flex-col justify-center items-center overflow-hidden"
            >
              <video autoplay loop muted playsinline class="absolute inset-0 w-full h-full object-cover">
                <source src="../../assets/ava_chat.mp4" type="video/mp4" />
              </video>

              <div class="z-10 relative flex flex-col items-center">
                <span class="text-xs uppercase font-bold text-center text-black">Trending</span>
                <span class="text-sm font-bold text-center text-black">🔥 apps 🔥</span>
              </div>
            </a>
          </div>

          <a
            href="https://t.me/CaptainsBay"
            target="_blank"
            class="text-sm text-center text-white font-medium bg-pantone_color rounded-2xl py-4 px-4 active:opacity-75 transition-all"
            >{{ $t("join_community") }}</a
          >

          <!-- <div class="flex relative flex-col gap-y-3 rounded-2xl p-4 bg-secondary_bg_color">
            <span class="text-sm z-10 flex flex-col gap-y-1 pr-4">
              <b>{{ $t('tfe_title') }}</b>
              <span>{{ $t('tfe_description') }}</span>
            </span>

            <div class="flex z-10">
              <router-link :to="{ name: 'JOIN_TO_FARMPAD' }"
                class="bg-button_color w-fit text-white flex rounded-2xl px-6 py-3 text-sm font-medium justify-center items-center active:opacity-75 transition-all">
                <div>{{ $t('read_more') }}</div>
              </router-link>
            </div>

            <div class="absolute right-4 top-0 bottom-0 flex z-0 justify-center items-center">
              <img src="../../assets/logo.svg" class="w-32 opacity-25" />
            </div>

          </div> -->
        </div>
      </div>

      <div class="flex flex-col gap-y-4 bg-secondary_bg_color px-4 pt-6 pb-4 rounded-3xl">
        <Heading :title="$t('roadmap')" :description="$t('roadmap_description')" />

        <div>
          <div class="flex flex-col gap-y-4">
            <div
              v-for="(quarter, index) in [
                $t('q2_2024'),
                $t('q3_2024'),
                $t('q4_2024'),
                $t('q1_2025'),
                $t('q2_q3_2025'),
                $t('q4_2025'),
                $t('q1_q2_2026'),
                $t('q3_q4_2026'),
              ]"
              :key="index"
              class="bg-bg_color rounded-xl p-4"
            >
              <h4 class="text-lg font-bold mb-2">{{ quarter }}</h4>
              <ul class="list-disc list-inside text-sm">
                <li v-if="index === 0">{{ $t("q2_2024_0") }}</li>
                <li v-if="index === 0">{{ $t("q2_2024_1") }}</li>
                <li v-if="index === 0">{{ $t("q2_2024_2") }}</li>
                <li v-if="index === 0">{{ $t("q2_2024_3") }}</li>

                <li v-if="index === 1">{{ $t("q3_2024_0") }}</li>
                <li v-if="index === 1">{{ $t("q3_2024_1") }}</li>
                <li v-if="index === 1">{{ $t("q3_2024_2") }}</li>

                <li v-if="index === 2">{{ $t("q4_2024_0") }}</li>
                <li v-if="index === 2">{{ $t("q4_2024_1") }}</li>
                <li v-if="index === 2">{{ $t("q4_2024_2") }}</li>

                <li v-if="index === 3">{{ $t("q1_2025_0") }}</li>
                <li v-if="index === 3">{{ $t("q1_2025_1") }}</li>
                <li v-if="index === 3">{{ $t("q1_2025_2") }}</li>
                <li v-if="index === 3">{{ $t("q1_2025_3") }}</li>

                <li v-if="index === 4">{{ $t("q2_q3_2025_0") }}</li>
                <li v-if="index === 4">{{ $t("q2_q3_2025_1") }}</li>
                <li v-if="index === 4">{{ $t("q2_q3_2025_2") }}</li>
                <li v-if="index === 4">{{ $t("q2_q3_2025_3") }}</li>

                <li v-if="index === 5">{{ $t("q4_2025_0") }}</li>
                <li v-if="index === 5">{{ $t("q4_2025_1") }}</li>
                <li v-if="index === 5">{{ $t("q4_2025_2") }}</li>

                <li v-if="index === 6">{{ $t("q1_q2_2026_0") }}</li>
                <li v-if="index === 6">{{ $t("q1_q2_2026_1") }}</li>
                <li v-if="index === 6">{{ $t("q1_q2_2026_2") }}</li>
                <li v-if="index === 6">{{ $t("q1_q2_2026_3") }}</li>
                <li v-if="index === 6">{{ $t("q1_q2_2026_4") }}</li>

                <li v-if="index === 7">{{ $t("q3_q4_2026_0") }}</li>
                <li v-if="index === 7">{{ $t("q3_q4_2026_1") }}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div class="flex flex-col gap-y-8 px-4 pb-4">
        <div class="flex flex-col items-center gap-y-1.5">
          <h3 class="text-3xl text-center font-bold relative">
            <span>{{ $t("faq_title") }}</span>
          </h3>
        </div>

        <div class="flex flex-col gap-y-2">
          <div v-for="(item, index) in faqItems" :key="index">
            <div
              @click="toggleFaq(index)"
              class="flex justify-between px-4 gap-x-4 py-3 items-center bg-secondary_bg_color rounded-full cursor-pointer transition-all duration-300"
            >
              <h4 class="text-base font-medium line-clamp-1">{{ $t(item.question) }}</h4>
              <span class="text-xl transition-transform duration-300" :class="{ 'rotate-45': item.isOpen }">+</span>
            </div>
            <transition
              enter-active-class="transition-all duration-300 ease-out"
              leave-active-class="transition-all duration-300 ease-in"
              enter-from-class="opacity-0 max-h-0"
              enter-to-class="opacity-100 max-h-96"
              leave-from-class="opacity-100 max-h-96"
              leave-to-class="opacity-0 max-h-0"
            >
              <div v-show="item.isOpen" class="p-4">
                <p class="text-sm leading-relaxed">{{ $t(item.answer) }}</p>
              </div>
            </transition>
          </div>

          <div class="flex flex-col items-center gap-y-4 pt-4 pb-2">
            <p class="text-center text-sm font-medium">{{ $t("more_info") }}</p>
            <a
              href="https://captainsbay.xyz"
              target="_blank"
              rel="noopener noreferrer"
              class="bg-button_color text-white px-8 py-3 text-center font-semibold rounded-full text-sm hover:bg-opacity-90 transition-all duration-300"
            >
              {{ $t("visit_website") }}
            </a>
          </div>
        </div>
      </div>
    </main>
  </transition>
</template>
