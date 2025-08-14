<script setup>
import formatNumber from "../../utils/formatNumber";
import formatTime from "../../utils/formatTime";
import { onMounted, onBeforeUnmount, ref } from "vue";
import checkSubscription from "../../utils/checkExists";
import checkApi from "../../utils/checkApi";
import { Icon } from "@iconify/vue";

const emit = defineEmits(["complete", "check_error"]);

const props = defineProps({
  task: Object,
});

const webapp = window.Telegram.WebApp;
const chat_id = webapp.initDataUnsafe.user?.id;

const load = ref(false);
const trans = ref(null);
const timerText = ref(null);
const intervalId = ref(null);
const lastClaimTimestamp = ref(null);

const startTimer = (secondsLeftInit) => {
  timerText.value = formatTime(secondsLeftInit);

  if (intervalId.value) clearInterval(intervalId.value);

  let secondsLeft = secondsLeftInit;

  intervalId.value = setInterval(() => {
    secondsLeft--;
    if (secondsLeft <= 0) {
      clearInterval(intervalId.value);
      timerText.value = null;
      props.task.is_completed = false;
      lastClaimTimestamp.value = null;
    } else {
      timerText.value = formatTime(secondsLeft);
    }
  }, 1000);
};

const checkTask = async (e) => {
  e.preventDefault();
  if (!chat_id) return emit("check_error");
  load.value = true;

  if (props.task.channel_id) {
    const check = await checkSubscription(chat_id, props.task.channel_id);
    if (check && !check.data.subscribed) {
      emit("check_error");
      webapp.HapticFeedback.notificationOccurred("error");
      load.value = false;
      return;
    }
  }

  if (props.task.api) {
    const check = await checkApi(chat_id, props.task.api);
    if (check && !check.data.confirm) {
      emit("check_error");
      webapp.HapticFeedback.notificationOccurred("error");
      load.value = false;
      return;
    }
  }

  emit("complete", props.task);
  load.value = false;
};

const redirect = () => {
  webapp.HapticFeedback.impactOccurred("light");

  if (props.task.category === "Recurring Tasks") {
    if (!props.task.is_completed) {
      load.value = true;
      show_9549301().then(() => {
        props.task.is_completed = true;
        emit("complete", props.task);
        webapp.HapticFeedback.notificationOccurred("success");

        lastClaimTimestamp.value = Math.floor(Date.now() / 1000);

        const secondsLeft = props.task.every_seconds || 0;
        startTimer(secondsLeft);
        load.value = false;
      });
    }
  } else {
    if (!trans.value) {
      window.localStorage.setItem(`T${props.task.id}`, "complete");
      trans.value = "complete";
    }
  }
};

onMounted(() => {
  trans.value = window.localStorage.getItem(`T${props.task.id}`);

  if (props.task.category === "Recurring Tasks" && props.task.next_claim_seconds && props.task.last_claim_timestamp) {
    const now = Math.floor(Date.now() / 1000);
    lastClaimTimestamp.value = props.task.last_claim_timestamp;

    const secondsPassed = now - lastClaimTimestamp.value;
    const secondsLeft = Math.max(props.task.every_seconds - secondsPassed, 0);

    if (secondsLeft > 0) {
      props.task.is_completed = true;
      startTimer(secondsLeft);
    } else {
      timerText.value = null;
      props.task.is_completed = false;
      lastClaimTimestamp.value = null;
    }
  }
});

onBeforeUnmount(() => {
  if (intervalId.value) clearInterval(intervalId.value);
});
</script>

<template>
  <a :href="props.task.link" @click="redirect" target="_blank" class="flex relative bg-secondary_bg_color rounded-2xl p-2.5 text-sm overflow-hidden">
    <div class="flex w-full gap-x-2 items-center justify-between">
      <div class="flex gap-x-2 items-center">
        <span class="shrink-0 flex flex-col px-1.5 justify-center items-center">
          <img class="w-10 h-10" src="../../assets/coin.svg" />
        </span>

        <div class="flex flex-col gap-y-1">
          <span class="font-medium text-base">{{ task.title }}</span>
          <span class="text-sm font-medium text-hint_color line-clamp-1"> +{{ formatNumber(task.reward) }} {{ $t("coins") }} </span>
        </div>
      </div>

      <span v-if="!task.is_completed" class="flex text-xs font-medium gap-x-1 rounded-lg">
        <span v-if="load" class="bg-yellow-500 text-white items-center gap-x-1 justify-center w-20 h-9 rounded-full flex">
          <Icon icon="line-md:loading-loop" />
        </span>

        <button v-else-if="trans && task.category !== 'Recurring Tasks'" @click="checkTask" :disabled="load" class="bg-yellow-500 text-white w-20 items-center justify-center h-9 rounded-full flex">
          {{ $t("check") }}
        </button>

        <span v-else class="bg-bg_color justify-center items-center h-9 w-20 rounded-full flex">
          {{ $t("start") }}
        </span>
      </span>

      <span v-else class="flex text-xs font-medium gap-x-1 rounded-lg">
        <span v-if="task.category === 'Recurring Tasks'" class="bg-yellow-500 text-white justify-center items-center h-9 w-24 rounded-full flex">
          <template v-if="timerText">{{ timerText }}</template>
          <template v-else><Icon icon="lets-icons:check-fill" class="text-xl" /></template>
        </span>
        <span v-else class="bg-green-500 text-white justify-center items-center h-9 w-20 rounded-full flex">
          <Icon icon="lets-icons:check-fill" class="text-xl" />
        </span>
      </span>
    </div>
  </a>
</template>
