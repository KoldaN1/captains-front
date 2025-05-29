<script setup>
const props = defineProps({
    title: String,
    description: String,
    image: String
})
</script>

<template>
    <div class="flex flex-col items-center gap-y-2.5">
        <span v-if="image" class="w-16 h-16 shrink-0 rounded-2xl overflow-hidden justify-center items-center flex">
            <img :src="image" />
        </span>
        <h3 class="text-3xl font-bold relative text-center" v-html="title" />
        <span class="text-sm text-center text-hint_color" v-html="description" />
    </div>
</template>