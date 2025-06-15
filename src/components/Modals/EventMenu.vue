<script setup>
import { computed } from "vue";
import { Icon } from "@iconify/vue/dist/iconify.js";

import { TransitionRoot, TransitionChild, Dialog, DialogPanel } from "@headlessui/vue";

import { useTgTheme } from "../../composables/tg_theme.js";

defineProps({
  isOpen: Boolean,
});

const emit = defineEmits(["close"]);
</script>

<template>
  <TransitionRoot appear :show="isOpen" as="template">
    <Dialog as="div" @close="emit('close')" class="relative z-[50]">
      <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0" enter-to="opacity-100" leave="duration-200 ease-in" leave-from="opacity-100" leave-to="opacity-0">
        <div class="fixed inset-0 bg-black/60 z-[50]" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto z-[50]">
        <div class="flex min-h-full justify-center p-4 text-center">
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel class="w-full max-w-5xl transform rounded-2xl transition-all max-h-[90vh] bg-bg_color">
              <button
                @click="emit('close')"
                class="bg-pantone_color z-10 w-10 aspect-square text-white flex justify-center items-center shadow-md text-base absolute -right-2 -top-2 rounded-xl active:opacity-75 transition-all"
              >
                <Icon icon="game-icons:crossed-bones" :size="24" />
              </button>
              <slot />
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
