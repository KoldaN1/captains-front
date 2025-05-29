<script setup>

    // import isColorDark from '../../utils/isColorDark'
    // import stringToColor from '../../utils/stringToColor'
    // import { computed } from 'vue'

    const props = defineProps({
        fren: Object
    })

    // const avatarColor = computed(() => {
    //     return stringToColor(props.fren?.username?.slice(0, 2) || props.fren?.name?.slice(0, 2) || 'FR')
    // })

    // const textColor = computed(() => {
    //     return isColorDark(avatarColor.value) ? '#FFFFFF' : '#000000'
    // })

</script>

<template>
    <div :class="['text-[#0D0D0D] rounded-xl shadow-md', fren.rare === 'plain' && 'bg-bg_plain', fren.rare === 'scarce' && 'bg-bg_scarce', fren.rare === 'epic' && 'bg-bg_epic']">
        <div class="flex justify-between items-center py-2 px-4 gap-x-4">
            <h3 class="uppercase text-left font-bold text-xl line-clamp-1">{{ fren.name }}</h3>

            <div class="flex gap-x-1 items-center">
                <span class="flex items-center gap-x-2">
                    <span class="flex w-6 aspect-square justify-center items-center">
                        <img v-if="fren.rare === 'plain'" src="../../assets/plain_icon.svg" class="w-full" />
                        <img v-if="fren.rare === 'scarce'" src="../../assets/scarce_icon.svg" class="w-full" />
                        <img v-if="fren.rare === 'epic'" src="../../assets/epic_icon.svg" class="w-full" />
                    </span>
                    <span class="font-bold text-sm">{{ fren.rare === 'plain' && 'Plain' || fren.rare === 'scarce' && 'Scarce' || fren.rare === 'epic' && 'Epic' }}</span>
                </span>
            </div>
        </div>

        <div class="w-full aspect-square flex flex-col gap-y-4 justify-center items-center death-pattern bg-center bg-no-repeat bg-cover">
            <div class="uppercase bg-white text-black w-[102px] aspect-square rounded-full shrink-0 flex justify-center text-xl items-center font-semibold">{{ fren.name?.slice(0, 2) || fren.username?.slice(0, 2) || 'Fr' }}</div>
        </div>

        <div class="flex justify-center items-center py-2 px-4 gap-x-4">
            <span v-if="fren.boosters?.coins" class="flex gap-x-1 items-center">
                <span class="flex w-6 justify-center items-center">
                    <img src="../../assets/boosters.svg" class="w-full" />
                </span>
                <span class="font-black">+{{ fren.boosters?.coins }}%</span>
            </span>
        </div>
    </div>
</template>

<style scoped>
.death-pattern {
    background-image: url('../../assets/death_bg.svg');
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
}
</style>