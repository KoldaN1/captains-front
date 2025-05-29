<script setup>

  import formatNumber from '../../../utils/formatNumber'

  const emit = defineEmits(['claim'])

  defineProps({
      claimedCoins: Number
  })

</script>

<template>
    <div class="flex flex-col gap-y-8 fixed justify-center items-center top-0 left-0 right-0 bottom-0 bg-black bg-opacity-40 backdrop-blur-sm z-50">

      <div class="w-80 h-80 rounded-full overflow-hidden">
        <img src="../../../assets/pirats.svg" />
      </div>

      <div class="flex flex-col items-center gap-y-6">
        <h1 class="text-xl text-center font-bold uppercase text-white">{{ $t('frens_earned') }}<br/><span class="text-yellow-500">{{ formatNumber(claimedCoins) }}</span> {{ $t('coins_for_you') }}</h1>
        <button @click="emit('claim')" class="uppercase text-xl animate-pulse font-black bg-yellow-500 px-8 py-2.5 rounded-xl shadow-sm text-white mt-2">{{ $t('claim') }}</button>
      </div>

    </div>
</template>