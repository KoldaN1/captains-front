<script setup>
import { ref, watch } from 'vue'

const webapp = window.Telegram.WebApp
const theme = ref(webapp.colorScheme)

const emit = defineEmits(['getInitialShip'])

defineProps({
  ship: String,
})

// Watch for theme changes
watch(() => webapp.colorScheme, (newTheme) => {
  theme.value = newTheme
})

function getRandomPosition() {
  const top = Math.random() * 30 + 10 + '%'
  const left = Math.random() * 90 + '%'
  return { top, left }
}

function getRandomDelay() {
  return Math.random() * 3 + 's'; // Random delay between 0 and 3 seconds
}

function getRandomSize(min, max) {
  return Math.random() * (max - min) + min + 'px';
}
</script>

<template>
  <div class="flex justify-center items-center p-4 relative h-[280px]">
    <div class="waves rounded-2xl">
      <div class="wave wave1"></div>
      <div class="wave wave2"></div>
      <div class="wave wave3"></div>
      <div class="wave wave4"></div>
      <div class="wave wave5"></div>
    </div>

    <img v-if="ship" :src="ship" class="w-64 boat" />
    <div v-else class="font-medium flex flex-col items-center gap-y-4">
      <span class="text-hint_color text-center">{{ $t('get_first_ship') }}</span>
      <button @click="emit('getInitialShip')" class="bg-yellow-500 animate-pulse w-fit active:opacity-75 transition-all px-4 py-2.5 rounded-xl flex shadow-sm uppercase font-semibold text-white">{{ $t('get_free' )}}</button>
    </div>

    <div v-if="theme === 'dark'" class="stars opacity-50">
      <img v-for="n in 10" :key="n" :style="[getRandomPosition(), { animationDelay: getRandomDelay(), width: getRandomSize(10, 20), height: getRandomSize(10, 20) }]" src="../../assets/star.svg" class="star" />
      <img src="../../assets/moon.svg" class="moon" />
    </div>

    <div v-else class="clouds opacity-50">
      <img v-for="n in 5" :key="n" :style="[getRandomPosition(), { width: getRandomSize(50, 100), height: getRandomSize(30, 60) }]" src="../../assets/cloud.svg" class="cloud" />
      <img src="../../assets/soon.svg" class="sun" />
    </div>
  </div>
</template>

<style scoped>
.boat {
  animation: rocking 7s infinite ease-in-out;
}

@keyframes rocking {
  0% { transform: translateX(-3%) rotate(0deg); }
  25% { transform: translateX(3%) rotate(1deg); }
  50% { transform: translateX(-3%) rotate(0deg); }
  75% { transform: translateX(3%) rotate(-1deg); }
  100% { transform: translateX(-3%) rotate(0deg); }
}

.stars, .clouds {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: -1;
}

.star {
  position: absolute;
  animation: twinkle 3s infinite ease-in-out;
}

@keyframes twinkle {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.cloud {
  position: absolute;
  animation: move 60s infinite linear;
  z-index: 1;
}

@keyframes move {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.moon, .sun {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 100px;
  height: 100px;
}

.waves {
  background-color: #549bf840;
  position: absolute;
  bottom: -20%;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  height: 100px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.wave {
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 135%;
  height: 100px;
  background: #549bf840; /* Light blue color */
  opacity: 0.7;
  border-radius: 50%;
}

.wave1 {
  animation: wave1 5s infinite ease-in-out;
  z-index: 1;
}

.wave2 {
  animation: wave2 6s infinite ease-in-out;
  z-index: 2;
}

.wave3 {
  animation: wave3 7s infinite ease-in-out;
  z-index: 3;
}

.wave4 {
  animation: wave4 8s infinite ease-in-out;
  z-index: 4;
}

.wave5 {
  animation: wave5 9s infinite ease-in-out;
  z-index: 5;
}

@keyframes wave1 {
  0%, 100% { transform: translate(-50%, -50%) scale(0.8); }
  50% { transform: translate(-50%, -50%) scale(1); }
}

@keyframes wave2 {
  0%, 100% { transform: translate(-50%, -50%) scale(0.7); }
  50% { transform: translate(-50%, -50%) scale(1.1); }
}

@keyframes wave3 {
  0%, 100% { transform: translate(-50%, -50%) scale(0.6); }
  50% { transform: translate(-50%, -50%) scale(1.2); }
}

@keyframes wave4 {
  0%, 100% { transform: translate(-50%, -50%) scale(0.5); }
  50% { transform: translate(-50%, -50%) scale(1.3); }
}

@keyframes wave5 {
  0%, 100% { transform: translate(-50%, -50%) scale(0.4); }
  50% { transform: translate(-50%, -50%) scale(1.4); }
}
</style>
