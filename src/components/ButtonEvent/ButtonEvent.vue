<script setup>
import { Icon } from "@iconify/vue/dist/iconify.js";

defineEmits(["click"]);

const props = defineProps({
  buy_booster_is_load: Boolean,
  text: String,
  background: {
    type: String,
    default: "#549BF8",
  },
  imgUrl: String,
  alt: {
    type: String,
    default: "icon",
  },
});
</script>

<template>
  <button
    :disabled="buy_booster_is_load"
    @click="$emit('click')"
    class="p-2 font-[700] border-b-[2px] border-white rounded-[8px] flex items-center justify-center button-event"
  >
    <div v-if="!buy_booster_is_load" class="flex gap-x-0.5 items-center">
      <span>{{ text }}</span>
      <img :src="imgUrl" :alt="alt" class="ml-2" v-if="imgUrl" />
    </div>

    <Icon v-else icon="line-md:loading-loop" class="text-lg" />
  </button>
</template>

<style scoped lang="scss">
.button-event {
  background-color: v-bind(background);
}
</style>
