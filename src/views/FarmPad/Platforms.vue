<script setup>
import Heading from '../../components/Other/Heading.vue'
</script>

<template>
    <transition name="fade">
        <main class="flex flex-col gap-y-6 px-4 py-6">
            <Heading title="Welcome to <span class='animate-pulse'>FarmPad</span>!"
                description="TFE is the opportunity to farm new projects' tokens before they go to market." />

            <div class="flex justify-center">
                <router-link :to="{ name: 'JOIN_TO_FARMPAD' }"
                    class="bg-pantone_color w-fit flex rounded-2xl h-11 px-6 justify-center items-center font-semibold border-b-2 border-r-2 active:opacity-75 transition-all border-b-text_color border-r-text_color">
                    <div>Pre-registration for FarmPad</div>
                </router-link>
            </div>
        </main>
    </transition>
</template>