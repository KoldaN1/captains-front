<script setup>
import { ref, watch } from "vue";
import { Icon } from "@iconify/vue/dist/iconify.js";

const props = defineProps({
  is_open: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["close"]);

const isVisible = ref(props.is_open);

watch(
  () => props.is_open,
  (newValue) => {
    isVisible.value = newValue;
  }
);

const closeSheet = () => {
  isVisible.value = false;
  emit("close");
};
</script>

<template>
  <Teleport to="body">
    <transition name="fade">
      <div v-show="isVisible" class="fixed inset-0 z-50 bg-[#00000030]" @click.self="closeSheet">
        <transition name="slide-bottom">
          <div v-show="isVisible" class="absolute overflow-y-auto inset-x-0 bottom-0 bg-bg_color transform flex flex-col h-fit max-h-screen rounded-t-3xl">
            <div
              class="bg-pantone_color z-10 w-10 aspect-square text-white flex justify-center items-center shadow-md text-base absolute right-4 top-4 rounded-xl active:opacity-75 transition-all"
              @click="closeSheet"
            >
              <Icon icon="mingcute:close-fill" />
            </div>
            <div class="flex justify-center items-center pt-4">
              <span class="w-20 h-1 bg-hint_color flex rounded-full" />
            </div>
            <div class="flex-grow p-4">
              <slot></slot>
            </div>
          </div>
        </transition>
      </div>
    </transition>
  </Teleport>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-bottom-enter-active,
.slide-bottom-leave-active {
  transition: transform 0.3s ease;
}

.slide-bottom-enter-from,
.slide-bottom-leave-to {
  transform: translateY(100%);
}
</style>
