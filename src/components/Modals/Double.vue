<script setup>
    import {
        TransitionRoot,
        TransitionChild,
        Dialog,
        DialogPanel,
    } from '@headlessui/vue'
    import { Icon } from '@iconify/vue'

    const props = defineProps({
        is_open: Boolean,
        AD: Array,
        load: Boolean,
        buttonActivity: Boolean
    })

    const emit = defineEmits(['skip', 'check', 'close', 'watchAds'])

    const skip = () => {
        emit('skip')
    }

    const check = () => {
        if (!props.AD || props.AD.length < 1) {
          emit('watchAds')
        } else {
          emit('check', props.AD)
        }
    }

    const close = () => {
        emit('close')
    }

    const save = (id) => {
      const localeTransition = window.localStorage.getItem(`T${id}`, `complete`)
      if (!localeTransition) {
        window.localStorage.setItem(`T${id}`, `complete`)
      }
    }
    

</script>

<template>
    <TransitionRoot appear :show="is_open" @close="close" as="template">
      <Dialog as="div" class="relative z-10">
        <TransitionChild
          as="template"
          enter="duration-300 ease-out"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="duration-200 ease-in"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-black/25" />
        </TransitionChild>
  
        <div class="fixed inset-0 overflow-y-auto">
          <div
            class="flex min-h-full items-center justify-center p-4 text-center"
          >
            <TransitionChild
              as="template"
              enter="duration-300 ease-out"
              enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100"
              leave="duration-200 ease-in"
              leave-from="opacity-100 scale-100"
              leave-to="opacity-0 scale-95"
            >
              <DialogPanel
                class="w-full max-w-lg flex flex-col gap-y-6 transform overflow-hidden rounded-2xl bg-secondary_bg_color p-6 transition-all"
              >

                <div class="flex flex-col items-center gap-y-2">
                    <h3 class="text-md font-medium">{{ AD && AD.length > 0 ? $t('x2_title') : $t('x2_ads') }}</h3>
                    <span class="flex items-center gap-x-2 font-bold">
                      <span class="text-pantone_color text-3xl uppercase">{{ $t('time') }} x2</span>
                    </span>
                </div>

                <div v-if="AD && AD.length > 0" class="flex flex-col gap-y-2">
                    <a :href="el.link" @click="() => save(el.id)" target="_blank" v-for="el, index in AD" :key="index" class="flex outline-none items-center justify-between bg-bg_color px-4 py-2.5 rounded-2xl gap-x-2">
                        <div class="flex gap-x-3 items-center">
                            <span class="w-8 h-8 flex justify-center items-center bg-button_color text-white shrink-0 rounded-full text-lg">
                                <Icon icon="tabler:link" />
                            </span>
                            <span class="text-left text-sm font-medium line-clamp-2">{{ el.title }}</span>
                        </div>

                        <button class="flex bg-secondary_bg_color outline-none font-medium text-xs p-2 rounded-full">{{ $t('start') }}</button>
                    </a>
                </div>
  
                <div class="flex gap-x-2 justify-between">
                  <button
                    :disabled="buttonActivity"
                    @click="skip"
                    class="w-full bg-bg_color h-12 outline-none text-text_color rounded-2xl font-medium active:opacity-75 transition-all"
                  >
                    {{ $t('skip') }}
                  </button>

                  <button
                    @click="check"
                    :disabled="load || buttonActivity"
                    class="w-full bg-button_color flex justify-center items-center outline-none text-white h-12 rounded-2xl font-medium active:opacity-75 transition-all"
                  >
                    <span v-if="!load">{{ AD && AD.length > 0 ? $t('check') : $t('watch') }}</span>
                    <Icon v-else icon="line-md:loading-twotone-loop" class="text-lg" />
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </template>
  