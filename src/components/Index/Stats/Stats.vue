<script setup>
import { ref, watch } from "vue";
import formatNumber from "../../../utils/formatNumber";
import part_1 from "../../../assets/part_1.png";
import part_2 from "../../../assets/part_2.png";
import part_3 from "../../../assets/part_3.png";
import part_4 from "../../../assets/part_4.png";

import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/swiper-bundle.css";
import { Icon } from "@iconify/vue";

const props = defineProps({
  coins: Number,
  per_hour: Number,
  eventsData: [null, Array],
});

const animatedCoins = ref(props.coins);
const animatedPerHour = ref(props.per_hour);

const animateCount = (start, end, duration, updateCallback, completeCallback) => {
  const startTime = performance.now();
  const animate = (currentTime) => {
    const elapsedTime = currentTime - startTime;
    const progress = Math.min(elapsedTime / duration, 1);
    updateCallback(Math.floor(start + (end - start) * progress));
    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      completeCallback();
    }
  };
  requestAnimationFrame(animate);
};

const setupAnimation = (propRef, propName) => {
  watch(
    () => props[propName],
    (newVal, oldVal) => {
      animateCount(
        oldVal,
        newVal,
        500,
        (value) => {
          propRef.value = value;
        },
        () => {
          propRef.value = newVal;
        }
      );
    }
  );
};

setupAnimation(animatedCoins, "coins");
setupAnimation(animatedPerHour, "per_hour");

const getImagePath = (index) => {
  if (index === 1) return part_1;
  if (index === 2) return part_2;
  if (index === 3) return part_3;
  if (index === 4) return part_4;
};
</script>

<template>
  <div class="flex flex-col gap-y-2.5">
    <div class="flex justify-between gap-x-2.5">
      <div class="flex flex-col bg-secondary_bg_color py-3 px-0.5 rounded-2xl gap-y-0.5 items-center w-full">
        <img src="../../../assets/coin.svg" class="w-10 h-10 rounded-full overflow-hidden" />
        <span class="font-bold text-xl text-yellow-500">{{ formatNumber(animatedCoins) }}</span>
        <span class="font-semibold text-xs uppercase text-hint_color">{{ $t("coins") }}</span>
      </div>

      <div class="flex flex-col bg-secondary_bg_color py-3 px-0.5 rounded-2xl gap-y-0.5 items-center w-full">
        <img src="../../../assets/coin.svg" class="w-10 h-10 rounded-full overflow-hidden" />
        <span class="font-bold text-xl text-yellow-500">{{ animatedPerHour > 0 ? "+" : "" }}{{ formatNumber(animatedPerHour) }}</span>
        <span class="font-semibold text-xs uppercase text-hint_color">{{ $t("per_hour") }}</span>
      </div>
    </div>

    <div class="flex justify-between gap-x-2.5 bg-secondary_bg_color p-2 rounded-2xl">
      <router-link
        :to="{ name: 'TREASURE' }"
        class="flex w-1/3 overflow-hidden relative text-sm active:opacity-75 transition-all gap-x-2 justify-center bg-bg_color px-0.5 rounded-xl gap-y-1 items-center"
      >
        <!-- <span class="font-semibold uppercase text-text_color">{{ $t('partners') }}</span> -->
        <span class="font-semibold uppercase text-text_color">
          <Icon icon="lucide-lab:chest" class="text-2xl" />
        </span>
        <div class="absolute rotate-12 inset-0 flex justify-center gap-1 items-start -top-4 opacity-10">
          <img v-for="index in 4" :src="getImagePath(index)" :key="index" :class="`button-image img-${index} w-14`" />
        </div>
      </router-link>

      <router-link :to="{ name: 'ABOUT_US' }" class="flex w-1/3 justify-center h-14 relative active:opacity-75 text-sm transition-all bg-bg_color px-0.5 rounded-xl gap-y-0.5 items-center">
        <span class="font-semibold uppercase text-text_color">
          <Icon icon="lucide:info" class="text-2xl" />
        </span>
      </router-link>

      <router-link
        :to="{ name: 'FRENS' }"
        @click="webapp.HapticFeedback.impactOccurred('light')"
        :class="['flex w-1/3 rounded-2xl shrink-0 bg-bg_color flex-col items-center gap-y-0.5 justify-center']"
      >
        <Icon icon="mynaui:users-group" class="text-2xl" />
      </router-link>
    </div>

    <div>
      <swiper
        v-if="eventsData && eventsData.length > 0"
        :modules="modules"
        @swiper="onSwiper"
        @slideChange="onSlideChange"
        :slides-per-view="eventsData && eventsData.length > 0 ? 1.23 : 1"
        :space-between="10"
        :observer="true"
        :observeParents="true"
        :key="'swiper-' + (eventsData ? eventsData.length : 0)"
      >
        <swiper-slide v-for="(event, index) in eventsData" :key="index">
          <router-link
            :to="{ name: 'EVENT', params: { id: event.id } }"
            class="flex flex-col bg-secondary_bg_color py-4 justify-center relative active:opacity-75 text-sm transition-all px-2 rounded-2xl gap-y-1 items-center w-full whitespace-nowrap"
          >
            <span class="font-semibold uppercase text-text_color text-center">
              Captains Bay x <span class="text-pantone_color">{{ event.partner }}</span>
            </span>
            <span class="font-medium text-hint_color uppercase text-center"> <span class="bg-pantone_color text-white px-1 rounded-sm">Join</span> to Farm event </span>
          </router-link>
        </swiper-slide>

        <swiper-slide v-if="Math.floor(Date.now() / 1000) >= 1749038400">
          <router-link
            :to="{ name: 'QUESTS' }"
            class="flex flex-col bg-secondary_bg_color py-4 justify-center relative active:opacity-75 text-sm transition-all px-2 rounded-2xl gap-y-1 items-center w-full whitespace-nowrap"
          >
            <span class="font-semibold uppercase text-text_color text-center"> Captains Bay x <span class="text-pantone_color">Duckygram</span> </span>
            <span class="font-medium text-hint_color uppercase text-center"> <span class="bg-pantone_color text-white px-1 rounded-sm">Join</span> to Quests </span>
          </router-link>
        </swiper-slide>
      </swiper>
    </div>
  </div>
</template>

<style scoped>
@keyframes moveUpDown {
  0%,
  100% {
    transform: translateY(0px);
  }

  50% {
    transform: translateY(-140px);
  }
}

.swiper {
  padding: 0 0 0 0;
}

.button-image {
  animation: moveUpDown 10s ease-in-out infinite;
}

.img-1 {
  animation-delay: 0s;
}

.img-2 {
  animation-delay: 1s;
}

.img-3 {
  animation-delay: 2s;
}

.img-4 {
  animation-delay: 3s;
}
</style>
