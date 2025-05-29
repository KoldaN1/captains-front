<script setup>
import { ref, watch } from 'vue';
import formatNumber from '../../utils/formatNumber.js';

const props = defineProps({
  coins: Number,
  per_hour: Number
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
  watch(() => props[propName], (newVal, oldVal) => {
    animateCount(oldVal, newVal, 500, value => {
      propRef.value = value;
    }, () => {
      propRef.value = newVal;
    });
  });
};

setupAnimation(animatedCoins, 'coins');
setupAnimation(animatedPerHour, 'per_hour');
</script>

<template>
  <div class="flex text-sm flex-wrap font-medium justify-center gap-2">

    <span class="bg-secondary_bg_color rounded-full px-2 py-1 shadow-sm"> 
      <span class="text-yellow-500 flex items-center gap-x-1">
        <img src="../../assets/coin.svg" class="w-5 h-5" /> {{ formatNumber(animatedCoins) }}
      </span>
    </span>

    <span class="bg-secondary_bg_color rounded-full px-2 py-1 shadow-sm">
      <span class="text-yellow-500 flex items-center gap-x-1">
        <img src="../../assets/coin.svg" class="w-5 h-5" /> {{ formatNumber(animatedPerHour) }} {{ $t('per_hour') }}
      </span>
    </span>

  </div>
</template>
