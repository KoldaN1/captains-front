<script setup>
import { getCurrentInstance, onMounted, ref } from "vue";
import i18n from "../../i18n.js";
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/swiper-bundle.css";
import ticket from "../../assets/ticket.svg";
import shipWhite from "../../assets/ship-white.svg";
import map from "../../assets/map.svg";

const { proxy } = getCurrentInstance();

const items = ref([]);

onMounted(() => {
  if (i18n.global.locale === "en") {
    items.value = [
      {
        title: proxy.$t("participationTutorial.strategies.item1.title"),
        icon: ticket,
        alt: "ticket",
        text: proxy.$t("participationTutorial.strategies.item1.text"),
      },
      {
        title: proxy.$t("participationTutorial.strategies.item2.title"),
        icon: shipWhite,
        alt: "ship-white",
        text: proxy.$t("participationTutorial.strategies.item2.text"),
      },
      {
        title: proxy.$t("participationTutorial.strategies.item3.title"),
        icon: map,
        alt: "map",
        text: proxy.$t("participationTutorial.strategies.item3.text"),
      },
    ];

    return;
  }

  items.value = [
    {
      title: proxy.$t("participationTutorial.strategies.item1.title"),
      icon: ticket,
      alt: "ticket",
      text: proxy.$t("participationTutorial.strategies.item1.text"),
    },
    {
      title: proxy.$t("participationTutorial.strategies.item2.title"),
      icon: shipWhite,
      alt: "ship-white",
      text: proxy.$t("participationTutorial.strategies.item2.text"),
    },
    {
      title: proxy.$t("participationTutorial.strategies.item3.title"),
      icon: map,
      alt: "map",
      text: proxy.$t("participationTutorial.strategies.item3.text"),
    },
    {
      title: proxy.$t("participationTutorial.strategies.item4.title"),
      icon: ticket,
      alt: "ticket",
      text: proxy.$t("participationTutorial.strategies.item4.text"),
    },
    {
      title: proxy.$t("participationTutorial.strategies.item5.title"),
      icon: ticket,
      alt: "ticket",
      text: proxy.$t("participationTutorial.strategies.item5.text"),
    },
  ];
});
</script>

<template>
  <div class="px-4">
    <h2 class="text-[28px] text-center font-[700]">
      {{ $t("participationTutorial.strategies.title") }} {{ eventPage }}
    </h2>

    <swiper class="mt-4" :slides-per-view="3.2" space-between="8px" :initial-slide="1">
      <swiper-slide v-for="(item, index) in items" :key="index" class="tutorial-strategies__slide">
        <div class="bg-secondary_bg_color rounded-[10px] w-full px-2 pt-4 pb-2 swiper-slide">
          <img
            :src="item.icon"
            :alt="item.alt"
            class="w-[24px] h-[24px] justify-self-center"
            :class="item.alt === 'ship-white' ? 'tutorial-strategies__icon' : ''"
          />
          <h4 class="font-bold text-base/[18px] text-center mt-2">{{ item.title }}</h4>
          <p class="mt-2 text-sm/[14px] opacity-60">{{ item.text }}</p>
        </div>
      </swiper-slide>
    </swiper>
  </div>
</template>

<style scoped lang="scss">
.tutorial-strategies {
  &__icon {
    filter: invert(57%) sepia(66%) saturate(643%) hue-rotate(322deg) brightness(130%) contrast(97%);
  }

  &__slide {
    height: auto;
  }
}
</style>
