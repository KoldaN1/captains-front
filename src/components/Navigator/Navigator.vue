<script setup>
import { Icon } from "@iconify/vue";

import { ref, watch, getCurrentInstance } from "vue";
import formatNumber from "../../utils/formatNumber";
import clipboard from "../../utils/copy";

const { proxy } = getCurrentInstance();

const webapp = window.Telegram.WebApp;

const props = defineProps({
  page: String,
  buttonText: String,
  earnedCoins: Number,
  mining_status: String,
  buttonActivity: Boolean,
});

const animatedCoins = ref(props.earnedCoins);

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

setupAnimation(animatedCoins, "earnedCoins");

const emit = defineEmits(["mainButtonClicked"]);

let link = `t.me/${import.meta.env.VITE_SHARE_APP}?startapp=${webapp.initDataUnsafe.user?.id}`;

const share = () => {
  webapp.HapticFeedback.impactOccurred("light");
  let reply = proxy.$t("share_title");
  window.open(`https://t.me/share/url?url=${link}&text=${reply}`);
};

const copied = ref(null);

const copy = () => {
  webapp.HapticFeedback.notificationOccurred("success");
  clipboard(link);

  copied.value = true;
  setTimeout(() => {
    copied.value = false;
  }, 2000);
};
</script>

<template>
  <div class="fixed bottom-0 left-0 right-0 pb-6 pt-4 px-4 bg-bg_color">
    <div v-if="page === 'HOME' && buttonText" class="pb-4 flex gap-x-2">
      <button
        :disabled="mining_status === 'Mining in progress' || buttonActivity"
        @click="emit('mainButtonClicked')"
        :class="[
          'flex flex-col relative overflow-hidden w-full active:opacity-75 transition-all rounded-2xl h-16 justify-center items-center font-medium text-lg',
          mining_status === 'Mining in progress' ? 'bg-secondary_bg_color text-text_color' : mining_status === 'Ready to claim' ? 'bg-pantone_color text-white' : 'bg-button_color text-white',
        ]"
      >
        <span class="z-[2] font-medium">{{ buttonText }}</span>
        <span class="text-xs flex items-center justify-center gap-x-1 font-semibold text-yellow-500" v-if="earnedCoins"
          ><img src="../../assets/coin.svg" class="w-4 h-4" />{{ $t("sailing") }} {{ formatNumber(animatedCoins) }}</span
        >
      </button>

      <!-- <router-link :to="{ name: 'FRENS' }" @click="webapp.HapticFeedback.impactOccurred('light')"
                :class="['flex aspect-square h-16 rounded-2xl shrink-0 text-white bg-button_color flex-col items-center gap-y-0.5 justify-center']">
                <Icon icon="mynaui:users-group" class="text-2xl" />
            </router-link> -->
    </div>

    <div v-if="page === 'FRENS'" class="pb-4 flex gap-x-2">
      <button
        @click="share"
        :class="['flex flex-col relative overflow-hidden w-2/3 active:opacity-75 transition-all rounded-2xl h-12 justify-center items-center font-medium bg-button_color text-white']"
      >
        <span class="z-[2] font-medium">{{ $t("invite") }}</span>
      </button>

      <button
        @click="copy"
        :disabled="copied"
        :class="[
          'flex flex-col relative overflow-hidden w-1/3 active:opacity-75 transition-all rounded-2xl h-12 justify-center items-center font-medium text-white bg-button_color',
          copied && 'opacity-75',
        ]"
      >
        <span class="z-[2] font-medium">
          <Icon v-if="!copied" class="text-lg" icon="gravity-ui:copy-chevron-right" />
          <Icon v-else class="text-lg" icon="icon-park-solid:check-one" />
        </span>
      </button>
    </div>

    <div class="flex w-full justify-around items-center">
      <router-link
        :to="{ name: 'BENCH' }"
        @click="webapp.HapticFeedback.impactOccurred('light')"
        :class="['w-1/5 flex flex-col items-center gap-y-0.5 justify-center', page !== 'MARKET' && 'opacity-50']"
      >
        <Icon icon="hugeicons:cargo-ship" class="text-2xl" />
        <span class="text-sm">{{ $t("market") }}</span>
      </router-link>

      <router-link
        :to="{ name: 'QUESTS' }"
        @click="webapp.HapticFeedback.impactOccurred('light')"
        :class="['w-1/5 flex relative flex-col items-center gap-y-0.5 justify-center', page !== 'TASKS' && 'opacity-50']"
      >
        <Icon icon="mdi:task-auto" class="text-2xl" />
        <span class="text-sm">{{ $t("tasks") }}</span>
      </router-link>

      <router-link
        :to="{ name: 'INDEX' }"
        @click="webapp.HapticFeedback.impactOccurred('light')"
        :class="['w-1/5 flex flex-col items-center gap-y-0.5 justify-center', page !== 'HOME' && 'opacity-50']"
      >
        <Icon icon="mdi:ship-wheel" class="text-2xl" />
        <span class="text-sm">{{ $t("home") }}</span>
      </router-link>

      <!-- <router-link :to="{ name: 'FRENS' }" @click="webapp.HapticFeedback.impactOccurred('light')" :class="['w-1/5 flex flex-col items-center gap-y-0.5 justify-center', page !== 'FRIENDS' && 'opacity-50']">
                <Icon icon="mynaui:users-group" class="text-2xl" />
                <span class="text-sm">{{ $t('frens') }}</span>
            </router-link> -->

      <router-link
        :to="{ name: 'EVENTS' }"
        @click="webapp.HapticFeedback.impactOccurred('light')"
        :class="['w-1/5 flex flex-col items-center gap-y-0.5 justify-center', page !== 'FARMPAD' && 'opacity-50']"
      >
        <Icon icon="solar:pie-chart-outline" class="text-2xl" />
        <span class="text-sm">FarmPad</span>
      </router-link>

      <router-link
        :to="{ name: 'WEB3' }"
        @click="webapp.HapticFeedback.impactOccurred('light')"
        :class="['w-1/5 relative flex flex-col items-center gap-y-0.5 justify-center', page !== 'WEB3' && 'opacity-50']"
      >
        <Icon icon="solar:backpack-linear" class="text-2xl" />
        <span class="text-sm">Web3</span>
      </router-link>
    </div>
  </div>
</template>
