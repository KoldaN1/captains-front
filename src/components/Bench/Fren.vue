<script setup>

    // import isColorDark from '../../utils/isColorDark'
    // import stringToColor from '../../utils/stringToColor'
    import { computed, ref } from 'vue'
    import MainModal from '../Modals/MainModal.vue'
    import Card from './Nft.vue'

    const emit = defineEmits(['change'])

    const props = defineProps({
        fren: Object,
        ship_id: Number,
        selected: Boolean
    })

    const isOpen = ref(false)

    // const avatarColor = computed(() => {
    //     return stringToColor(props.fren?.username?.slice(0, 2) || props.fren?.name?.slice(0, 2) || 'FR')
    // })

    // const textColor = computed(() => {
    //     return isColorDark(avatarColor.value) ? '#FFFFFF' : '#000000'
    // })

</script>

<template>
     <MainModal :isOpen="isOpen" @close="() => isOpen = false">

        <div class="flex flex-col gap-y-4 p-2.5">
            <Card
                :fren="fren"
            />

            <div class="text-xs flex flex-col text-start px-4">
                <span class="uppercase text-sm font-semibold mb-2">{{ $t('this_card') }}</span>
                <div class="mb-2 flex flex-col">
                    <span v-if="fren.boosters?.coins" class="font-medium">
                        - {{ $t('booster_coins', { coins: fren.boosters?.coins }) }}%
                    </span>
                </div>

                <span class="text-hint_color">{{ $t('rare_fren') }}</span>
            </div>

            <div class="flex justify-end items-center gap-x-2">
                <button @click="emit('change', { ship_id: ship_id, fren: fren.chat_id, selected: !selected })" v-if="ship_id" class="w-8 aspect-square rounded-full flex border-button_color justify-center items-center border-[2px]">
                    <transition name="fade">
                        <span v-if="selected" class="flex aspect-square bg-button_color w-6 rounded-full" />
                    </transition>
                </button>
            </div>
        </div>

     </MainModal>

    <button @click="() => isOpen = true" :class="['flex gap-y-1.5 relative flex-col death-pattern bg-center bg-no-repeat bg-cover justify-center p-2 text-text_color font-medium text-xs text-center active:opacity-75 transition-all items-center rounded-2xl aspect-square w-full', fren.rare === 'plain' && 'bg-bg_plain', fren.rare === 'scarce' && 'bg-bg_scarce', fren.rare === 'epic' && 'bg-bg_epic']">
        <div class="uppercase bg-white text-black w-[52px] aspect-square rounded-full shrink-0 flex justify-center text-xl items-center font-semibold">{{ fren.name?.slice(0, 2) || fren.username?.slice(0, 2) || 'Fr' }}</div>

        <span v-if="ship_id" class="absolute flex justify-center items-center bottom-2 right-2 w-6 aspect-square rounded-full border-[2px] border-white">
            <span class="w-4 aspect-square bg-white rounded-full" v-if="selected" />
        </span>
    </button>
</template>

<style scoped>
.death-pattern {
    background-image: url('../../assets/death_bg.svg');
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
}
</style>