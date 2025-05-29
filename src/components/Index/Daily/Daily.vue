<script setup>

    import formatNumber from '../../../utils/formatNumber'
    import { onMounted } from 'vue'

    defineProps({
        reward_amount: Number,
        reward_streak: Number
    })

    const emit = defineEmits(['close'])

    onMounted(() => {
        setTimeout(() => {
            emit('close')
        }, 3000)
    })

</script>

<template>
    <div class="flex flex-col gap-y-8 fixed justify-center items-center top-0 left-0 right-0 bottom-0 bg-black bg-opacity-40 backdrop-blur-sm z-50">

      <div>
        <span class="text-[204px] font-black leading-none text-white">{{ reward_streak }}</span>
      </div>

      <div class="flex flex-col items-center gap-y-1.5">
        <h1 class="text-xl text-center font-bold uppercase text-white">{{ $t('days_streak') }}</h1>
        <span class="font-bold text-xl text-yellow-500">+{{ formatNumber(reward_amount) }}</span>
      </div>

    </div>
</template>