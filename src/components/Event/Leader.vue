<script setup>
import formatNumber from "../../utils/formatNumber";
import stringToColor from "../../utils/stringToColor";
import isColorDark from "../../utils/isColorDark";
import { Icon } from "@iconify/vue/dist/iconify.js";

const props = defineProps({
  user: Object,
  position: Number,
});

const avatarColor = stringToColor(props.user?.users?.username?.slice(0, 2) || props.user?.users?.name?.slice(0, 2) || "");
const textColor = isColorDark(avatarColor) ? "#FFFFFF" : "#000000";
</script>

<template>
  <div class="flex text-sm justify-between bg-bg_color py-2 px-3 rounded-2xl items-center">
    <div class="flex items-center">
      <span class="font-medium w-10 text-center">{{ position }}</span>
      <span :style="{ backgroundColor: avatarColor, color: textColor }" class="w-8 aspect-square mr-2.5 rounded-xl flex justify-center items-center font-medium uppercase">{{
        user?.users?.name?.slice(0, 2) || user?.users?.username?.slice(0, 2) || "AN"
      }}</span>
      <span class="font-semibold truncate max-w-[112px]">{{ user?.users?.name || user?.users?.username || "Anon" }}</span>
    </div>

    <div class="font-semibold uppercase flex items-center gap-x-1.5">
      <!-- <Icon v-if="user.user_position <= 15" icon="majesticons:ticket-text" class="text-lg text-yellow-500" /> -->
      <span class="w-16 flex justify-center">{{ formatNumber(user.partner_coins) }}</span>
    </div>
  </div>
</template>
