<script setup>
import { ref, onMounted, onUnmounted, getCurrentInstance } from 'vue'
import Heading from '../../components/Other/Heading.vue'
import i18n from '../../i18n.js'
import axios from 'axios'
import Navigator from '../../components/Navigator/Navigator.vue'
import { useRouter, useRoute } from 'vue-router'
const { proxy } = getCurrentInstance()

const router = useRouter()
const webapp = window.Telegram.WebApp

const name = ref('')
const project = ref('')
const cost = ref('')
const tg = ref('')

const submitForm = async () => {

    if (name.value === '' || project.value === '' || tg.value === '') return webapp.HapticFeedback.notificationOccurred('warning')
    webapp.HapticFeedback.notificationOccurred('success')

    try {
        const message = await axios.post(import.meta.env.VITE_BOT_API + '/api/notify', {
            message: `<b>🔥 New order 🔥</b>\n\nName: <b>${name.value}</b>\nProject: <b>${project.value}</b>\nTotal USDT: <b>${cost.value}</b>\nContact: <b>${tg.value}</b>\n\nSended by: <a href='tg://user?id=${webapp.initDataUnsafe.user.id}'>${webapp.initDataUnsafe.user.first_name}</a> ${webapp.initDataUnsafe.user?.username ? '@' + webapp.initDataUnsafe.user?.username : ''}`
        })

        webapp.showAlert(proxy.$t('order_sended'), () => {
            webapp.HapticFeedback.impactOccurred('light')
            name.value = ''
            project.value = ''
            cost.value = ''
            tg.value = ''
        })

    } catch (ex) {
        webapp.HapticFeedback.notificationOccurred('error')
    }

}

const blur = () => {

}

const focus = () => {

}

</script>

<template>
    <div class="pb-[68px]">
        <transition name="fade" appear>
            <main class="flex flex-col gap-y-2 px-4 py-6">
                <Heading
                    title="<b class='text-button_color'>FARMPAD</b> <b class='font-medium'>IS COMMING SOON...</b>" />

                <div class="flex flex-col gap-y-4">
                    <span class="font-semibold uppercase px-4">{{ $t('what_farm_title') }}</span>

                    <div class="bg-secondary_bg_color relative flex justify-between rounded-2xl p-4 overflow-hidden">
                        <div class="text-sm z-10">{{ $t('what_farm_desctiption') }}</div>

                        <span class="flex justify-center items-center absolute right-4 top-0 bottom-0 z-0 opacity-25">
                            <img src="../../assets/logo.svg" class="w-32" />
                        </span>
                    </div>

                    <span class="text-sm px-4 font-semibold text-hint_color">{{ $t('farm_answer') }}</span>

                    <span class="font-semibold uppercase px-4">{{ $t('what_farm_work_title') }}</span>

                    <div class="grid grid-cols-2 rounded-2xl overflow-hidden">
                        <div class="text-sm flex flex-col p-4 gap-y-1 bg-secondary_bg_color">
                            <div class="flex justify-between items-center gap-x-1">
                                <span class="font-semibold">{{ $t('1st_farm_work_title') }}</span>
                                <img src="../../assets/hour.svg" class="w-10" />
                            </div>
                            <span class="text-xs text-hint_color">{{ $t('1st_farm_work_description') }}</span>
                        </div>

                        <div class="text-sm flex flex-col p-4 gap-y-1 bg-secondary_bg_color">
                            <div class="flex justify-between items-center gap-x-1">
                                <span class="font-semibold">{{ $t('2st_farm_work_title') }}</span>
                                <img src="../../assets/key.svg" class="w-10" />
                            </div>
                            <span class="text-xs text-hint_color">{{ $t('2st_farm_work_description') }}</span>
                        </div>

                        <div class="text-sm flex flex-col p-4 gap-y-1 bg-secondary_bg_color">
                            <div class="flex justify-between items-center gap-x-1">
                                <span class="font-semibold">{{ $t('3st_farm_work_title') }}</span>
                                <img src="../../assets/evil.svg" class="w-10" />
                            </div>
                            <span class="text-xs text-hint_color">{{ $t('3st_farm_work_description') }}</span>
                        </div>

                        <div class="text-sm flex flex-col p-4 gap-y-1 bg-secondary_bg_color">
                            <div class="flex justify-between items-center gap-x-1">
                                <span class="font-semibold">{{ $t('4st_farm_work_title') }}</span>
                                <img src="../../assets/trophy.svg" class="w-10" />
                            </div>
                            <span class="text-xs text-hint_color">{{ $t('4st_farm_work_description') }}</span>
                        </div>
                    </div>

                    <span class="font-semibold uppercase px-4">{{ $t('tfe_advantages_title') }}</span>

                    <div class="bg-secondary_bg_color flex flex-col gap-y-2 p-4 rounded-2xl">
                        <div class="flex items-center gap-2 font-semibold flex-wrap">
                            <span
                                class="w-8 aspect-square rounded-full bg-button_color flex justify-center items-center text-sm font-semibold text-white">1</span>
                            <span>{{ $t('tfe_advantages_1_title') }}</span>
                        </div>

                        <span class="text-xs">{{ $t('tfe_advantages_1_description') }}</span>
                    </div>

                    <div class="bg-secondary_bg_color flex flex-col gap-y-2 p-4 rounded-2xl">
                        <div class="flex items-center gap-2 font-semibold flex-wrap">
                            <span
                                class="w-8 aspect-square rounded-full bg-button_color flex justify-center items-center text-sm font-semibold text-white">2</span>
                            <span>{{ $t('tfe_advantages_2_title') }}</span>
                        </div>

                        <span class="text-xs">{{ $t('tfe_advantages_2_description') }}</span>
                    </div>

                    <div class="bg-secondary_bg_color flex flex-col gap-y-2 p-4 rounded-2xl">
                        <div class="flex items-center gap-2 font-semibold flex-wrap">
                            <span
                                class="w-8 aspect-square rounded-full bg-button_color flex justify-center items-center text-sm font-semibold text-white">3</span>
                            <span>{{ $t('tfe_advantages_3_title') }}</span>
                        </div>

                        <span class="text-xs">{{ $t('tfe_advantages_3_description') }}</span>
                    </div>

                    <div class="bg-secondary_bg_color flex flex-col gap-y-2 p-4 rounded-2xl">
                        <div class="flex items-center gap-2 font-semibold flex-wrap">
                            <span
                                class="w-8 aspect-square rounded-full bg-button_color flex justify-center items-center text-sm font-semibold text-white">4</span>
                            <span>{{ $t('tfe_advantages_4_title') }}</span>
                        </div>

                        <span class="text-xs">{{ $t('tfe_advantages_4_description') }}</span>
                    </div>

                    <div class="bg-secondary_bg_color flex flex-col gap-y-2 p-4 rounded-2xl">
                        <div class="flex items-center gap-2 font-semibold flex-wrap">
                            <span
                                class="w-8 aspect-square rounded-full bg-button_color flex justify-center items-center text-sm font-semibold text-white">5</span>
                            <span>{{ $t('tfe_advantages_5_title') }}</span>
                        </div>

                        <span class="text-xs">{{ $t('tfe_advantages_5_description') }}</span>
                    </div>

                    <span class="font-semibold uppercase px-4">{{ $t('tfe_sub_title') }}</span>

                    <span class="text-sm p-4 border-2 rounded-2xl bg-button_color text-white font-medium">{{
                        $t('tfe_sub_description') }}</span>

                </div>

                <span class="flex justify-center gap-x-1 mt-2">
                    <span v-for="el in 3" class="w-3 aspect-square flex bg-secondary_bg_color rounded-full" />
                </span>

                <div id="form" class="bg-secondary_bg_color p-4 mt-2 rounded-2xl gap-y-2 flex flex-col">
                    <span class="font-semibold uppercase text-center text-xl py-4 px-4">{{ $t('tfe_title') }}
                    </span>

                    <input @click="webapp.HapticFeedback.impactOccurred('light')" @blur="blur" @focus="focus"
                        @keyup.enter="(e) => e.target.blur()" :placeholder="$t('full_name')" v-model="name"
                        class="bg-bg_color px-4 py-3 rounded-2xl outline-none text-sm" />
                    <input @click="webapp.HapticFeedback.impactOccurred('light')" @blur="blur" @focus="focus"
                        @keyup.enter="(e) => e.target.blur()" :placeholder="$t('your_project')" v-model="project"
                        class="bg-bg_color px-4 py-3 rounded-2xl outline-none text-sm" />
                    <input @click="webapp.HapticFeedback.impactOccurred('light')" @blur="blur" @focus="focus"
                        @keyup.enter="(e) => e.target.blur()" :placeholder="$t('your_cost')" v-model="cost"
                        class="bg-bg_color px-4 py-3 rounded-2xl outline-none text-sm" />
                    <input @click="webapp.HapticFeedback.impactOccurred('light')" @blur="blur" @focus="focus"
                        @keyup.enter="(e) => e.target.blur()" :placeholder="$t('your_tg_link')" v-model="tg"
                        class="bg-bg_color px-4 py-3 rounded-2xl outline-none text-sm" />

                    <button @click="submitForm"
                        class="bg-pantone_color active:opacity-75 text-white transition-all py-3 px-4 rounded-2xl border-b-2 border-r-2 border-text_color text-sm uppercase font-semibold">{{
                            $t('join_farmpad') }}</button>
                </div>
            </main>
        </transition>

        <Navigator :page="'FARMPAD'" />
    </div>
</template>