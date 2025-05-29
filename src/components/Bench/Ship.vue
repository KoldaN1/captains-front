<script setup>
import { Icon } from '@iconify/vue'
import formatNumber from '../../utils/formatNumber'
import { ref, watch, onUnmounted, onMounted, getCurrentInstance } from 'vue'
import { useRouter } from 'vue-router'
import Boosters from './Boosters.vue'

const router = useRouter()

const { proxy } = getCurrentInstance()

const emit = defineEmits(['buy', 'upgrade', 'select', 'level_up', 'cut_time', 'restore_ads', 'openBottomSheet'])

const props = defineProps({
    ship: Object,
    selected_ship: Number,
    available_ads: Number,
    ads_restore_time_left: Number,
    buttonActivity: Boolean
})

const webapp = window.Telegram.WebApp

const formatTimeLeft = (timeLeftSeconds) => {
    const hours = Math.floor(timeLeftSeconds / 3600);
    const minutes = Math.floor((timeLeftSeconds % 3600) / 60);
    const seconds = Math.floor(timeLeftSeconds % 60);
    
    let formattedTime = '';
    if (hours > 0) {
        formattedTime += `${hours}${proxy.$t('h')} `;
    }
    formattedTime += `${minutes}${proxy.$t('m')} ${seconds}${proxy.$t('s')}`;
    
    return formattedTime.trim();
}

// Переменные для отслеживания времени до восстановления энергии
const timeLeftToRestoreAds = ref(null)

watch(() => props.ads_restore_time_left, (newVal) => {
    if (props.available_ads < 2) {
        timeLeftToRestoreAds.value = newVal / 1000;
        if (intervalRestoreId.value) {
            clearInterval(intervalRestoreId.value);
        }

        intervalRestoreId.value = setInterval(() => {
            if (timeLeftToRestoreAds.value !== null && timeLeftToRestoreAds.value > 1) {
                timeLeftToRestoreAds.value -= 1;
            } else {
                timeLeftToRestoreAds.value = null;
                clearInterval(intervalRestoreId.value);
                emit('restore_ads', 2); // Восстанавливаем энергию до 2 и сбрасываем таймер
            }
        }, 1000);
    }
});

const timeLeftToUpgrade = ref(props.ship.time_left_to_upgrade ? props.ship.time_left_to_upgrade / 1000 : null)

// Следим за изменением свойства time_left_to_upgrade
watch(() => props.ship.time_left_to_upgrade, (newVal) => {
    timeLeftToUpgrade.value = newVal / 1000
    if (intervalId.value) {
        clearInterval(intervalId.value)
    }

    intervalId.value = setInterval(() => {
        if (timeLeftToUpgrade.value !== null && timeLeftToUpgrade.value > 1) {
            timeLeftToUpgrade.value -= 1
        } else {
            emit('level_up', props.ship)
            timeLeftToUpgrade.value = null
            clearInterval(intervalId.value)
        }
    }, 1000)
})

const intervalId = ref(null)
const intervalRestoreId = ref(null)

onMounted(() => {
    if (timeLeftToUpgrade.value) {
        intervalId.value = setInterval(() => {
            if (timeLeftToUpgrade.value !== null && timeLeftToUpgrade.value > 1) {
                timeLeftToUpgrade.value -= 1
            } else {
                emit('level_up', props.ship)
                timeLeftToUpgrade.value = null
                clearInterval(intervalId.value)
            }
        }, 1000)
    }

    if (props.ads_restore_time_left && props.available_ads === 0) {
        timeLeftToRestoreAds.value = props.ads_restore_time_left / 1000;
        intervalRestoreId.value = setInterval(() => {
            if (timeLeftToRestoreAds.value !== null && timeLeftToRestoreAds.value > 1) {
                timeLeftToRestoreAds.value -= 1
            } else {
                timeLeftToRestoreAds.value = null;
                clearInterval(intervalRestoreId.value);
                emit('restore_ads', 2); // Восстанавливаем энергию до 2 и сбрасываем таймер
            }
        }, 1000);
    }
})

onUnmounted(() => {
    clearInterval(intervalId)
    clearInterval(intervalRestoreId)
})

const openLinked = (e) => {
    if (props.ship.is_purchased) {
        if (e.type === 'nft') {
            router.push({ name: 'HIRING_NFTS', params: { id: e.ship }})
        } else if ( e.type === 'fren') {
            router.push({ name: 'HIRING_FRENS', params: { id: e.ship }})
        } else {
            emit('openBottomSheet', props.ship.ship_id)
        }
    } else {
        webapp.showAlert(proxy.$t('ship_not_purchased'))
    }
}

</script>

<template>
    <div class="flex flex-col items-center">
        <span class="w-60 h-60">
            <img :src="ship.ship_image_url" />
        </span>

        <div class="flex flex-col gap-y-4 w-full">
            <div class="flex flex-col font-medium rounded-2xl gap-y-2 shadow-sm bg-secondary_bg_color w-full">
                <div class="flex p-4 pb-2 justify-between">
                    <div @click="() => {
                                if (ship.is_purchased && selected_ship !== ship.ship_id) {
                                    webapp.HapticFeedback.impactOccurred('light')
                                    emit('select', ship)
                                }
                            }" class="flex items-center gap-x-2">
                        <span class="w-5 h-5 shadow-sm flex justify-center items-center rounded-full bg-bg_color">
                            <span v-if="selected_ship === ship.ship_id" class="w-3 h-3 flex rounded-full bg-button_color text-white" />
                        </span>
                        <h4 class="font-medium">{{ ship.name }}</h4>
                    </div>
                    <span class="font-medium text-hint_color">{{ $t('level') }} {{ ship.user_level }} / {{ ship.max_level }}</span>
                </div>

                <hr class="border-hint_color opacity-10" />

                <span class="flex px-4 items-center gap-x-2 text-sm">
                    <img src="../../assets/coin.svg" class="w-6" />
                    <span class="flex items-center gap-x-1">{{ $t('income_per_hour') }} {{ formatNumber(ship.income_per_hour) }}</span>
                </span>

                <span class="flex px-4 items-center gap-x-2 text-sm">
                    <img src="../../assets/coin.svg" class="w-6" />
                    <span class="flex items-center gap-x-1" v-if="ship.user_level >= ship.max_level">{{ $t('limit_life') }}</span>
                    <span class="flex items-center gap-x-1" v-else>{{ $t('las_upgrade') }} {{ formatNumber(ship.income_per_hour + ship.update_income_level) }}</span>
                </span>

                <Boosters 
                    :crew_members="ship?.crew_members || []"
                />

                <span />

                <div class="px-4 pb-4">
                    <button @click="(e) => emit('buy', ship)" v-if="!ship.is_purchased" :class="['bg-yellow-500 w-full rounded-2xl shadow-sm active:opacity-75 transition-all p-2.5 text-white font-semibold uppercase']">{{ $t('buy') }} {{ formatNumber(ship.price) }} {{ $t('coins') }}</button>
                
                    <div v-else-if="ship.is_purchased" class="relative">
                        <button :disabled="ship.user_level >= ship.max_level || timeLeftToUpgrade || buttonActivity" @click="(e) => emit('upgrade', ship)" :class="['bg-button_color relative rounded-2xl shadow-sm active:opacity-75 transition-all p-2.5 text-white w-full font-semibold uppercase', { 'bg-slate-500 cursor-not-allowed': timeLeftToUpgrade }]">
                            <span v-if="ship.user_level >= ship.max_level">{{ $t('max_level') }}</span>
                            <span v-else-if="timeLeftToUpgrade">
                                <span>{{ $t('upgraded') }} {{ formatTimeLeft(timeLeftToUpgrade) }}</span>
                                <button v-if="available_ads" :disabled="!available_ads || buttonActivity" @click="() => emit('cut_time', ship)" class="absolute text-sm -top-5 -right-2 bg-button_color rounded-full px-3 py-1.5 shadow-sm">
                                    <div>
                                        <span>-20 {{ $t('min') }}</span>
                                        <sup class="ml-1">{{ available_ads }}/2 ads</sup>
                                    </div>

                                    <!-- <div v-else class="flex items-center gap-x-1">
                                        <Icon icon="mingcute:time-line" />
                                        <span v-if="timeLeftToRestoreAds">{{ formatTimeLeft(timeLeftToRestoreAds) }}</span>
                                    </div> -->
                                </button>
                            </span>
                            <span v-else>{{ $t('upgrade') }} {{ formatNumber(ship.upgrade_cost) }} {{ $t('coins') }}</span>
                        </button>
                    </div>
                </div>
            </div>

            <div class="flex flex-col bg-secondary_bg_color rounded-2xl gap-y-4 shadow-sm w-full p-4">
                <div class="flex justify-between">
                    <h4 class="font-medium">{{ $t('crew_members') }}</h4>
                    <span class="font-medium text-hint_color">{{ $t('max') }} {{ ship.crew_capacity }}</span>
                </div>

                <div class="grid grid-cols-3 gap-2">
                    <button @click="openLinked({type: el.type, ship: ship.ship_id })" v-for="el, index in ship.crew_members" :key="index" class="flex justify-center active:opacity-75 transition-all items-center bg-bg_color overflow-hidden rounded-2xl aspect-square w-full">
                        <img v-if="el.type === 'nft'" :src="el.metadata.image" class="object-cover" />

                        <span v-if="el.type === 'fren'" :class="['flex gap-y-1.5 relative flex-col death-pattern bg-center bg-no-repeat bg-cover justify-center p-2 text-text_color font-medium text-xs text-center active:opacity-75 transition-all items-center rounded-2xl aspect-square w-full', el.rare === 'plain' && 'bg-bg_plain', el.rare === 'scarce' && 'bg-bg_scarce', el.rare === 'epic' && 'bg-bg_epic']">
                            <div class="uppercase bg-white text-black w-[52px] aspect-square rounded-full shrink-0 flex justify-center text-xl items-center font-semibold">{{ el.name?.slice(0, 2) || el.username?.slice(0, 2) || 'Fr' }}</div>
                        </span>
                    </button>

                    <button @click="openLinked" v-for="el, index in ship.crew_capacity - (ship?.crew_members?.length || 0)" :key="index" class="flex justify-center active:opacity-75 transition-all items-center bg-bg_color rounded-2xl aspect-square w-full">
                        <Icon icon="typcn:plus" class="text-xl text-hint_color" />
                    </button>
                </div>
            </div>
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
