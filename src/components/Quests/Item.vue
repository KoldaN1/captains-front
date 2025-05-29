<script setup>

    import formatNumber from '../../utils/formatNumber'
    import { onMounted, ref } from 'vue';
    import checkSubscription from '../../utils/checkExists'
    import checkApi from '../../utils/checkApi'
    import { Icon } from '@iconify/vue'

    const emit = defineEmits('complete', 'check_error')

    const props = defineProps({
        task: Object
    })

    const webapp = window.Telegram.WebApp
    const chat_id = webapp.initDataUnsafe.user?.id

    const load = ref(false)

    const checkTask = async (e) => {
        e.preventDefault()

        if (!chat_id) return emit('check_error')

        load.value = true

        if (props.task.channel_id) {
            let check = await checkSubscription(chat_id, props.task.channel_id)

            if (check && !check.data.subscribed) {
                emit('check_error')
                webapp.HapticFeedback.notificationOccurred('error')
                load.value = false
                return
            }
        }

        if (props.task.api) {
            let check = await checkApi(chat_id, props.task.api)

            if (check && !check.data.confirm) {
                emit('check_error')
                webapp.HapticFeedback.notificationOccurred('error')
                load.value = false
                return
            }
        }

        emit('complete', props.task)

        load.value = false
    }

    const trans = ref(null)

    const redirect = () => {
        if (!trans.value) {
            webapp.HapticFeedback.impactOccurred('light')
            window.localStorage.setItem(`T${props.task.id}`, `complete`)
            trans.value = `complete`
        }
    }

    onMounted(() => {
        trans.value = window.localStorage.getItem(`T${props.task.id}`)
    })

</script>

<template>
    <a :href="props.task.link" @click="redirect" target="_blank" class="flex relative bg-secondary_bg_color rounded-2xl p-2.5 text-sm overflow-hidden">

        <div class="flex w-full gap-x-2 items-center justify-between">

            <div class="flex gap-x-2 items-center">
                <span class="shrink-0 flex flex-col px-1.5 justify-center items-center">
                    <img class="w-10 h-10" src="../../assets/coin.svg" />
                </span>

                <div class="flex flex-col gap-y-1">
                    <span class="font-medium line-clamp-1 text-base">{{ task.title }}</span>
                    <span class="text-sm font-medium text-hint_color line-clamp-1">+{{ formatNumber(task.reward) }} {{ $t('coins') }}</span>
                </div>
            </div>

            <span v-if="!task.is_completed" class='flex text-xs font-medium gap-x-1 rounded-lg'>
                <span v-if="load" class="bg-yellow-500 text-white items-center gap-x-1 justify-center w-20 h-9 rounded-full flex"><Icon icon="line-md:loading-loop" /></span>
                <button v-else-if="trans" @click="checkTask" :disabled="load" class="bg-yellow-500 text-white w-20 items-center justify-center h-9 rounded-full flex">{{ $t('check') }}</button>
                <span v-else class="bg-bg_color justify-center items-center h-9 w-20 rounded-full flex">{{ $t('start') }}</span>
            </span>

            <span v-else class='flex text-xs font-medium gap-x-1 rounded-lg'>
                <span class="bg-green-500 text-white justify-center items-center h-9 w-20 rounded-full flex"><Icon icon="lets-icons:check-fill" class="text-xl" /></span>
            </span>
        </div>

    </a>
</template>