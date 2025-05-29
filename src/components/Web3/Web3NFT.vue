<script setup>

    import { ref, onMounted } from 'vue'
    import MainModal from '../Modals/MainModal.vue'

    const props = defineProps({
        nft: Object,
        ship_id: Number,
        selected: Boolean
    })

    const emit = defineEmits(['change'])

    const isOpen = ref(false)

    const imageLoaded = ref(true)
    const onImageLoad = () => {
        imageLoaded.value = false
    }

    const parsedAttributes = ref([])

    const parseAttributes = () => {
    props.nft.metadata.attributes.forEach(attr => {
        const match = attr.value.match(/([+-]\d+(?:\.\d+)?%?)\s+(.+)/)
        if (match) {
        parsedAttributes.value.push({
            value: match[1],
            description: match[2]
        })
        }
    })
    }

    parseAttributes()

</script>

<template>
    <MainModal :isOpen="isOpen" @close="() => isOpen = false">
        <div class="flex flex-col gap-y-4 p-2.5 pb-4">
            <div class="rounded-2xl overflow-hidden flex justify-center items-center">
                <img :src="nft.metadata.image" />
            </div>

            <div class="text-xs flex flex-col text-start px-4">
                <span class="uppercase text-sm font-semibold mb-2">{{ $t('this_card') }}</span>
                <div class="mb-2 flex flex-col">
                    <span v-for="attr in parsedAttributes" class="font-medium">
                         <span v-if="attr.description === 'hourly passive income'">
                            - {{ $t('booster_coins', { coins: attr.value }) }}
                         </span>

                         <span v-else-if="attr.description === 'min of income generation'">
                            - {{ $t('booster_mining_time', { mining_time: attr.value }) }}
                         </span>

                         <span v-else-if="attr.description === 'to refresh interval'">
                            - {{ $t('booster_time_reduction', { time_reduction: attr.value }) }}
                         </span>

                         <span v-else>
                            - {{ attr.value }} {{ attr.description }}
                         </span>
                    </span>
                </div>

                <span v-if="nft.metadata.attributes[0].value === 'Plain Cards (Lowest Tier)'" class="text-hint_color">{{ $t('rare_1') }}</span>
                <span v-if="nft.metadata.attributes[0].value === 'Scarce Cards (Mid-Tier)'" class="text-hint_color">{{ $t('rare_2') }}</span>
                <span v-if="nft.metadata.attributes[0].value === 'Epic Cards (Highest Tier)'" class="text-hint_color">{{ $t('rare_3') }}</span>
            </div>  

            <div class="flex justify-end items-center gap-x-2">
                <div v-if="!nft.is_minted" class="flex">
                    <span class="text-hint_color px-4">Not Minted</span>
                </div>

                <button @click="emit('change', { ship_id: ship_id, nft: nft.id, selected: !selected })" v-if="ship_id" class="w-8 aspect-square rounded-full flex border-button_color justify-center items-center border-[2px]">
                    <transition name="fade">
                        <span v-if="selected" class="flex aspect-square bg-button_color w-6 rounded-full" />
                    </transition>
                </button>
            </div>
        </div>
    </MainModal>

    <button @click="() => isOpen = true" class="flex relative justify-center active:opacity-75 transition-all overflow-hidden items-center rounded-2xl aspect-square w-full">
        <span :class="['absolute inset-0 bg-secondary_bg_color flex justify-center items-center', !imageLoaded && 'hidden']" />
        <img @load="onImageLoad" :src="nft.metadata.image" :class="['w-full object-contain rounded-2xl', imageLoaded && 'hidden']" />

        <span v-if="ship_id" class="absolute flex justify-center items-center bottom-2 right-2 w-6 aspect-square rounded-full border-[2px] border-white">
            <span class="w-4 aspect-square bg-white rounded-full" v-if="selected" />
        </span>
    </button>
</template>