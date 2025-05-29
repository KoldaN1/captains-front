<script setup>
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/swiper-bundle.css";
import ghostPirateShip from "../../assets/ghost-pirate-ship.svg";
import close from "../../assets/close.svg";
import pirateHat from "../../assets/pirate-hat.svg";
import barrel from "../../assets/barrel.svg";
import shipWhite from "../../assets/ship-white.svg";
import BoosterItem from "./BoosterItem.vue";
import { useTgTheme } from "../../composables/tg_theme.js";
import { ref, onMounted, getCurrentInstance, computed } from "vue";

const { proxy } = getCurrentInstance();

const props = defineProps({
  eventData: Object,
  userData: Object,
  boostersCost: Object,
});

const buttonCloseColor = computed(() => {
  return useTgTheme() === "light" ? "boosters__close-icon--white" : "";
});

const items = ref([]);

onMounted(() => {
  items.value = [
    {
      title: proxy.$t("boosters.compensation.title"),
      id: "compensation",
      icon: barrel,
      iconText: "barrel",
      subTitle: proxy.$t("boosters.compensation.text"),
    },
    {
      title: proxy.$t("boosters.x2.title"),
      id: "x2",
      icon: pirateHat,
      iconText: "pirateHat",
      subTitle: proxy.$t("boosters.x2.text"),
    },
    {
      title: proxy.$t("boosters.autofarm.title"),
      id: "autofarm",
      icon: shipWhite,
      iconText: "ship-white",
      subTitle: proxy.$t("boosters.autofarm.text"),
    },
  ];
});

const filteredItems = computed(() => {
  return items.value.filter((item) => props.eventData.boosters.includes(item.id));
});
</script>

<template>
  <div>
    <div class="w-full flex justify-center relative">
      <div class="w-full flex flex-col justify-center items-center">
        <div class="w-[96px] h-1 bg-white rounded-[20px]" />
        <img :src="ghostPirateShip" alt="ghost-pirate-ship" class="w-[80px] h-[80px] mt-4" />
      </div>
      <button
        :class="`bg-[#f87c56] w-[40px] h-[40px] absolute rounded-[8px] flex items-center justify-center top-0 right-2`"
        @click="$emit('close')"
      >
        <img :src="close" alt="close" :class="buttonCloseColor" />
      </button>
    </div>

    <h2 class="text-center font-bold text-xl mt-4">{{ $t("getBoosters") }}</h2>
    <div class="px-4 mt-4">
      <swiper
        class="mt-4"
        :slides-per-view="filteredItems.length > 1 ? 1.2 : 1"
        :space-between="8"
        :centered-slides="filteredItems.length === 1"
      >
        <swiper-slide
          v-for="(item, index) in filteredItems"
          :key="index"
          class="boosters__item"
          :style="filteredItems.length === 1 ? 'margin: 0 auto;' : ''"
        >
          <BoosterItem
            :title="item.title"
            :id="item.id"
            :sub-title="item.subTitle"
            :icon="item.icon"
            :icon-text="item.iconText"
            :eventData="eventData"
            :userData="userData"
            :boostersCost="boostersCost"
          />
        </swiper-slide>
      </swiper>
    </div>
  </div>
</template>

<style scoped lang="scss">
.swiper-slide {
  height: auto;
}

.boosters {
  &__item {
    &:last-child:deep(.booster-item__icon) {
      width: 32px;
      height: 32px;
      filter: invert(79%) sepia(23%) saturate(2645%) hue-rotate(133deg) brightness(277%) contrast(99%);
    }
  }

  &__close-icon {
    &--white {
      filter: invert(1);
    }
  }
}
</style>
