<script setup>

import formatNumber from '../../utils/formatNumber'
import { Icon } from '@iconify/vue'

const props = defineProps({
    proj: Object
})

function formatDate(dateString) {
    const [year, month, day] = dateString.split('-')
    return `${day}.${month}`
}

</script>

<template>
    <a :href="proj.link" class="bg-secondary_bg_color gap-y-4 active:opacity-75 rounded-2xl flex flex-col">
        <div class="flex justify-between items-center px-4 pt-4">
            <div class="flex items-center gap-x-4">
                <span class="w-12 h-12 shrink-0 bg-bg_color rounded-full flex justify-center items-center overflow-hidden text-2xl">
                <img class="w-full h-full object-cover rounded-full" v-if="proj.logo && proj.logo !== '#'" :src="proj.logo" />
                <span v-else>
                    <Icon icon="lucide:bot" />
                </span>
                </span>

                <div class="flex flex-col">
                <span class="font-semibold text-lg line-clamp-1">{{ proj.title }}</span>
                <span class="text-sm font-medium text-hint_color line-clamp-1">{{ proj.description }}</span>
                </div>
            </div>

            <span class="text-xl text-hint_color shrink-0 w-12 h-12 flex justify-center items-center">
                <Icon icon="solar:share-bold-duotone" />
            </span>
        </div>

        <div class="flex gap-x-1 px-4">
            <span class="font-medium">{{ $t('raid_date') }}</span>
            <span class="text-hint_color">{{ formatDate(proj.raid_date) }}</span>
        </div>

        <span class="flex w-full border-[1px] border-dashed rounded-full border-bg_color" />

        <div v-if="proj.coins || proj.cost" class="w-full flex justify-center items-center text-2xl font-bold p-2.5 uppercase">
            <span v-if="proj.coins"><span :class="[proj.nft ? 'text-purple-500' : 'text-yellow-500']">{{ formatNumber(proj.coins) }} {{ proj.nft ? 'nft' : 'tokens'}}</span></span>
            <span v-else-if="proj.cost"><span class="text-green-500">${{ formatNumber(proj.cost) }}</span></span>
        </div>

        <span class="text-xs px-4 pb-4 text-hint_color">{{ $t('raid_description') }}</span>
    </a>
</template>