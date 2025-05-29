<script setup>
defineEmits(["click"]);

const props = defineProps({
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
    @click="$emit('click')"
    class="pl-4 pr-4 h-[52px] rounded-[30px] flex items-center justify-between w-full button-tutorial"
  >
    {{ text }}
    <img :src="imgUrl" :alt="alt" class="ml-2" v-if="imgUrl" />
  </button>
</template>

<style scoped lang="scss">
.button-tutorial {
  background-color: v-bind(background);
  color: white;
}
</style>
