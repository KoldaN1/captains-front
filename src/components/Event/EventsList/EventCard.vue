<script setup>
import trunk from "../../../assets/trunk.svg";
import { useTgTheme } from "../../../composables/tg_theme.js";

const tgTheme = useTgTheme();
const props = defineProps({
  id: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  eventLogoUrl: {
    type: String,
    required: true,
  },
  claimCost: {
    type: Number,
    required: true,
  },
  startDateString: {
    type: String,
    required: true,
  },
  finishDateString: {
    type: String,
    required: true,
  },
  buttonColor: {
    type: String,
    default: "linear-gradient(180deg, #dc4cc1 -29.25%, #4146ae 137.02%)",
  },
  iconPath: {
    type: String,
    default: trunk,
  },
});
</script>

<template>
  <div class="event-card">
    <div class="event-card__logo-wrapper">
      <div
        class="event-card__logo-background"
        :style="{ 'background-color': tgTheme === 'dark' ? '#0f0f0f' : '#f0f0f0' }"
      ></div>
      <div class="event-card__logo" :style="{ 'background-image': `url(${eventLogoUrl})` }"></div>
    </div>

    <span class="event-card__name">{{ name }}</span>
    <router-link
      v-if="new Date(startDateString) < new Date() && new Date(finishDateString) > new Date()"
      class="event-card__link event-card__btn"
      :to="{ name: 'EVENT', params: { id: id } }"
    >
      <div class="event-card__btn-wrapper">
        <span>{{ $t("ev_list_join") }}</span>
        <img :src="iconPath" alt="trunk" class="ml-2" />
      </div>
    </router-link>
    <router-link
      :to="{ name: 'EVENT', params: { id: id } }"
      class="event-card__timer event-card__btn"
      v-if="new Date(startDateString) > new Date()"
    >
      <div class="event-card__btn-wrapper">
        <span>{{ $t("ev_list_join") }}</span>
      </div>
    </router-link>
    <div class="event-card__past event-card__btn" v-if="new Date(finishDateString) < new Date()">
      <div class="event-card__btn-wrapper">
        <span>{{ $t("ev_list_ev_ended") }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.event-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-weight: 500;
}

.event-card__logo-wrapper {
  position: relative;
  border-radius: 15px;
  height: 100px;
  width: 100px;
  overflow: hidden;
}

.event-card__logo-background {
  position: absolute;
  top: 0;
  left: 0;
  height: 100px;
  width: 100px;
}

.event-card__logo {
  position: absolute;
  top: 0;
  left: 0;
  height: 100px;
  width: 100px;
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
}

.event-card__name {
  margin-bottom: 8px;
}

.event-card__btn {
  border-radius: 8px;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px 0;
  background: v-bind(buttonColor);
}

.event-card__btn-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 12px;
  gap: 3px;
}

.event-card__btn-wrapper span,
.event-card__btn-wrapper img {
  min-width: 0;
}

.event-card__btn-wrapper img {
  width: 18px;
  height: 18px;
  min-width: 18px;
  min-height: 18px;
}

.event-card__timer {
  background-color: #549bf8;
}

.event-card__past {
  background: black;
}
</style>
