<script setup>

    import { Icon } from '@iconify/vue'

    defineProps({
        title: String, type: String
    })

</script>

<template>
    <span :class="['bg-bg_color border-[1px] z-10 border-dashed rounded-xl shadow-sm p-4 w-full flex items-center gap-x-2.5', type === 'success' ? 'border-green-500' : 'border-red-500']">
        <Icon v-if="type === 'error'" icon="material-symbols:error-outline" class="text-red-500 text-xl" />
        <Icon v-if="type === 'success'" icon="ep:success-filled" class="text-green-500 text-xl" />
        <span v-if="title" :class="['text-sm font-medium', type === 'success' ? 'text-green-500' : 'text-red-500']">{{ title }}</span>
    </span>
</template>