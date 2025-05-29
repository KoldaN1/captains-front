<script setup>
import chestImg from '../../assets/chest.svg'
import shipImg from '../../assets/ships_new.svg'
import piratsImg from '../../assets/pirats.svg'
import nftsImg from '../../assets/nfts.png'
import raftImg from '../../assets/raft.svg'
import coinImg from '../../assets/coin.svg'
import trophyImg from '../../assets/trophy.svg'
import backgroundPattern from '../../assets/kraken.svg'

import { useRouter } from 'vue-router'

import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/swiper-bundle.css'

import { ref, computed, getCurrentInstance, onMounted } from 'vue'

const { proxy } = getCurrentInstance()

const router = useRouter()

const webapp = window.Telegram.WebApp

const slides = ref(null)

onMounted(() => {
    slides.value = [
    {
        image: chestImg,
        title: proxy.$t('onboarding_title_1'),
        description: proxy.$t('onboarding_description_1'),
        subDescription: proxy.$t('onboarding_sub_description_1'),
    },
    {
        image: shipImg,
        title: proxy.$t('onboarding_title_2'),
        description: proxy.$t('onboarding_description_2'),
        subDescription: proxy.$t('onboarding_sub_description_2'),
    },
    {
        image: piratsImg,
        title: proxy.$t('onboarding_title_3'),
        description: proxy.$t('onboarding_description_3'),
        subDescription: proxy.$t('onboarding_sub_description_3'),
    },
    {
        image: nftsImg,
        title: proxy.$t('onboarding_title_4'),
        description: proxy.$t('onboarding_description_4'),
        subDescription: proxy.$t('onboarding_sub_description_4'),
    },
    {
        image: raftImg,
        title: proxy.$t('onboarding_title_5'),
        description: proxy.$t('onboarding_description_5'),
        subDescription: proxy.$t('onboarding_sub_description_5'),
    },
    {
        image: coinImg,
        title: proxy.$t('onboarding_title_6'),
        description: proxy.$t('onboarding_description_6'),
        subDescription: proxy.$t('onboarding_sub_description_6'),
    },
    {
        image: trophyImg,
        title: proxy.$t('onboarding_title_7'),
        description: proxy.$t('onboarding_description_7'),
            subDescription: proxy.$t('onboarding_sub_description_7'),
        },
    ]
})

const currentSlide = ref(0)

const onSwiper = (swiper) => {
    swiperRef.value = swiper
}

const onSlideChange = (swiper) => {
    currentSlide.value = swiper.activeIndex
    webapp.HapticFeedback.impactOccurred('light')
}

const isLastSlide = computed(() => {
    return currentSlide.value === (slides.value?.length - 1)
})

const nextSlide = () => {
    if (isLastSlide.value) {
        localStorage.setItem('onboarding_completed', true)
        router.push({ name: 'INDEX'})
    } else {
        swiperRef.value.slideNext()
    }
}

const previousSlide = () => {
    swiperRef.value.slidePrev()
}

const swiperRef = ref(null)

</script>

<template>
    <div 
        class="flex relative flex-col bg-cover bg-center bg-fixed min-h-screen pb-24 px-4 py-6"
        :style="{ backgroundImage: `url(${backgroundPattern})` }"
    >

        <transition name="fade" mode="out-in" appear>
            <swiper
                :modules="modules"
                @swiper="onSwiper"
                @slideChange="onSlideChange"
                class="flex-1 w-full"
            >
                    <swiper-slide
                        v-for="slide, index in slides"
                        :key="index"
                        class="h-full"
                    >
                        <div class="flex flex-col items-center gap-y-6">

                            <div class="flex justify-center order-3 items-center w-3/4 aspect-square p-2">
                                <img :src="slide.image" />
                            </div>

                            <h1 class="text-2xl order-1 font-bold text-text_color uppercase text-center min-h-[64px] w-[220px]" v-html="slide.title" />
                            <p class="text-text_color order-2 text-justify min-h-[120px]" v-html="slide.description" />
                            <p class="text-text_color order-4 text-center" v-html="slide.subDescription" />

                        </div>

                    </swiper-slide>
                </swiper>
        </transition>

        <div class="fixed bottom-4 left-0 right-0 w-full p-4 z-10">
            <button @click="nextSlide" class="bg-button_color active:bg-button_color/80 transition-colors w-full flex justify-center items-center font-medium h-12 rounded-2xl text-button_text_color">
                <transition name="fade" mode="out-in">
                    <span v-if="isLastSlide">Начать играть</span>
                    <span v-else>Далее</span>
                </transition>
            </button>
        </div>
    </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.10s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>