<script setup>

import { ref, onMounted, onUnmounted } from 'vue'
import Item from '../../components/Frens/Item.vue'
import { Icon } from '@iconify/vue/dist/iconify.js'

import Heading from '../../components/Other/Heading.vue'
import formatNumber from '../../utils/formatNumber'

import { useRouter, useRoute } from 'vue-router'
import Navigator from '../../components/Navigator/Navigator.vue'
import axiosInstance from '../../utils/axiosInstance'

const loading = ref(true)
const webapp = window.Telegram.WebApp

const router = useRouter()
const counts = ref(null)
const referrals = ref(null)

const back = () => {
    if (window.history.length > 1) {
        webapp.HapticFeedback.impactOccurred('light')
        router.go(-1)
    } else {
        router.push({ name: 'INDEX' })
    }
}

onMounted(async () => {
    webapp.onEvent('backButtonClicked', back)
    webapp.BackButton.show()
})

onUnmounted(() => {
    webapp.offEvent('backButtonClicked', back)
    webapp.BackButton.hide()
})

const getReferrals = async () => {
    if (!webapp.initDataUnsafe.user?.id) return
    const { data, error } = await axiosInstance.get('/rest/v1/invites', {
        params: {
            select: 'total_cost, whom(name, username)',
            who: `eq.${webapp.initDataUnsafe.user?.id}`,
            order: 'created_at.desc',
            limit: 101,
            offset: 0
        },
    })

    return data
}

const getCounts = async () => {
    let { data, error } = await axiosInstance.post('/rest/v1/rpc/v2_get_referral_statistics')
    if (error) console.error(error)
    else counts.value = data[0]
}

onMounted(async () => {
    await getCounts()
    referrals.value = await getReferrals()
    loading.value = false
})

</script>

<template>
    <div>
        <div class="flex flex-col gap-y-6 px-4 pt-6 pb-[166px]">

            <Heading :title="$t('frens_title')"
                :description="counts?.total_count > 0 ? $t('frens_description') : $t('frens_how_its_work')" />

            <transition name="fade" mode="out-in">
                <div v-if="counts?.total_count < 1 || loading" class="flex flex-col text-sm gap-y-2.5">
                    <span class="bg-secondary_bg_color rounded-2xl p-2.5 flex items-center gap-x-1">
                        <span class="px-3">
                            <span class="w-3 h-3 flex rounded-full bg-text_color" />
                        </span>
                        <span class="flex flex-col gap-y-1">
                            <h4 class="font-semibold">{{ $t('step_title_1') }}</h4>
                            <span class="text-xs opacity-50">{{ $t('step_description_1') }}</span>
                        </span>
                    </span>

                    <span class="bg-secondary_bg_color rounded-2xl p-2.5 flex items-center gap-x-1">
                        <span class="px-3">
                            <span class="w-3 h-3 flex rounded-full bg-text_color" />
                        </span>
                        <span class="flex flex-col gap-y-1">
                            <h4 class="font-semibold">{{ $t('step_title_2') }}</h4>
                            <span class="text-xs opacity-50">{{ $t('step_description_2') }}</span>
                        </span>
                    </span>

                    <span class="bg-secondary_bg_color rounded-2xl p-2.5 flex items-center gap-x-1">
                        <span class="px-3">
                            <span class="w-3 h-3 flex rounded-full bg-text_color" />
                        </span>
                        <span class="flex flex-col gap-y-1">
                            <h4 class="font-semibold">{{ $t('step_title_3') }}</h4>
                            <span class="text-xs opacity-50">{{ $t('step_description_3') }}</span>
                        </span>
                    </span>

                    <span class="bg-secondary_bg_color rounded-2xl p-2.5 flex items-center gap-x-1">
                        <span class="px-3">
                            <span class="w-3 h-3 flex rounded-full bg-text_color" />
                        </span>
                        <span class="flex flex-col gap-y-1">
                            <h4 class="font-semibold">{{ $t('step_title_4') }}</h4>
                            <span class="text-xs opacity-50">{{ $t('step_description_4') }}</span>
                        </span>
                    </span>

                    <span class="bg-secondary_bg_color rounded-2xl p-2.5 flex items-center gap-x-1">
                        <span class="px-3">
                            <span class="w-3 h-3 flex rounded-full bg-text_color" />
                        </span>
                        <span class="flex flex-col gap-y-1">
                            <h4 class="font-semibold">{{ $t('step_title_5') }}</h4>
                            <span class="text-xs opacity-50">{{ $t('step_description_5') }}</span>
                        </span>
                    </span>
                </div>

                <div v-else>
                    <div class="rounded-2xl w-full overflow-hidden">

                        <div class="grid bg-secondary_bg_color grid-cols-2 border-b-2 border-bg_color">
                            <div class="p-4 text-hint_color font-medium flex items-center gap-x-1">
                                <span>{{ counts?.total_count }}</span>
                                <Icon icon="mynaui:users-group" class="text-xl" />
                            </div>
                            <div class="p-4 text-hint_color font-medium text-nowrap">{{ $t('total') }} {{
                                formatNumber(counts?.total_coins || 0) }}</div>
                        </div>

                        <transition name="fade" mode="out-in">
                            <div v-if="!loading">
                                <Item v-for="user, index in referrals" :key="index" :user="user" />
                            </div>

                            <div v-else>
                                <span v-for="i in 4"
                                    class="flex text-sm items-center bg-secondary_bg_color border-b-2 border-bg_color h-16 animate-pulse" />
                            </div>
                        </transition>

                    </div>
                </div>
            </transition>
        </div>

        <Navigator :page="'FRENS'" />
    </div>
</template>