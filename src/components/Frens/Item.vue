<script setup>
import formatNumber from '../../utils/formatNumber'
import stringToColor from '../../utils/stringToColor'
import isColorDark from '../../utils/isColorDark'

const props = defineProps({
    user: Object
})

const avatarColor = stringToColor(props.user.whom.username?.slice(0, 2) || props.user.whom.name?.slice(0, 2) || '')
const textColor = isColorDark(avatarColor) ? '#FFFFFF' : '#000000'
</script>

<template>

    <div class="grid grid-cols-2 text-sm items-center bg-secondary_bg_color border-b-2 border-bg_color">
        <div class="flex items-center p-4">
            <div :style="{ backgroundColor: avatarColor, color: textColor }"
                class="w-8 h-8 shrink-0 bg-brown-500 rounded-full flex items-center justify-center text-white font-bold">
                {{ user.whom?.username?.slice(0, 2) || user.whom?.name?.slice(0, 2) }}</div>
            <div class="ml-4 font-medium line-clamp-1">{{ user.whom?.username || user.whom?.name }}</div>
        </div>
        <div class="p-4 font-semibold">+{{ formatNumber(user.total_cost) }}</div>
    </div>

</template>