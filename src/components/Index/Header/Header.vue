<script setup>
    import League from '../../Leadboard/League.vue'

    const webapp = window.Telegram.WebApp
    const first_name = webapp.initDataUnsafe.user?.first_name || 'Captain'

    defineProps({
        league: Number
    })
</script>

<template>
    <div class="flex items-center gap-x-2">
        <div class="w-14 h-14 shrink-0">
            <img src="../../../assets/user.svg" />
        </div>

        <div class="flex flex-col gap-y-1">
            <span class="text-xl font-semibold">{{ $t('header_welcome') }}, {{ first_name }}!</span>
            <router-link :to="{ name: 'LEADBOARD' }" class="font-medium text-sm animate-pulse flex gap-x-1">
                <span class="flex items-center gap-x-1">
                    <League :league="league" />
                </span>
            </router-link>
        </div>
    </div>
</template>