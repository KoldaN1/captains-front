<script setup>
import bandage from "../../assets/bandage.svg";
</script>

<template>
  <div class="px-4 width-full grid grid-cols-[1fr_0.5fr] gap-[10px]">
    <RouterLink
      :to="{ name: 'EVENTS' }"
      class="uppercase bg-[#549BF8] text-white width-full h-[42px] rounded-[15px] font-semibold flex items-center justify-center"
    >
      Launch farmpad
    </RouterLink>
    <RouterLink
      :to="{ name: 'ABOUT_US' }"
      class="uppercase bg-[#F87C56] width-full h-[42px] rounded-[15px] flex items-center justify-center"
      @click="goToAboutPage"
    >
      <img :src="bandage" alt="bandage" />
    </RouterLink>
  </div>
</template>

<style scoped></style>
