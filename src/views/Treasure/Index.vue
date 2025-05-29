<script setup>

import { ref, onMounted, onUnmounted } from 'vue'

import axiosInstance from '../../utils/axiosInstance'

import { useRouter } from 'vue-router'

import Card from '../../components/Treasure/Card.vue'
import Heading from '../../components/Other/Heading.vue'

const loading = ref(true)

const webapp = window.Telegram.WebApp

const router = useRouter()

const back = () => {
  if (window.history.length > 1) {
    router.go(-1)
  } else {
    router.push({ name: 'INDEX' })
  }
}

const tresures = ref(null)

const limit = ref(100)

const getTresures = async () => {

  const { data } = await axiosInstance.get('/rest/v1/treasure', {
        params: {
          select: '*',
          order: 'raid_date.desc',
          limit: limit
        },
      }
    )

    return data
}

onMounted(async () => {  
  tresures.value = await getTresures()

  loading.value = false
  webapp.onEvent('backButtonClicked', back)
  webapp.BackButton.show()
})

onUnmounted(() => {
    webapp.offEvent('backButtonClicked', back)
    webapp.BackButton.hide()
})

</script>

<template>
    <main class="flex flex-col gap-y-4 p-4">

      <div class="flex justify-center">
        <img src="../../assets/airdrop.svg" class="w-72 h-72" />
      </div>

      <Heading :title="$t('treasure')" :description="$t('treasure_description')" />

      <div v-if="!loading" class="flex flex-col gap-y-4">
        <div class="flex">
          <span class="flex gap-x-1 font-medium text-lg uppercase">
            <span class="text-hint_color">{{ $t('total_partners') }}</span>
            <span>{{ tresures && tresures.length }}</span>
          </span>
        </div>

        <div class="flex flex-col gap-y-2" v-if="tresures && tresures.length > 0">
          <Card v-for="proj, index in tresures" :key="index" :proj="proj" />
        </div>

        <span v-else class="text-hint_color font-medium text-center text-sm">
          <span>{{ $t('partners_empty') }}</span>
        </span>
      </div>

      <div v-else class="flex flex-col gap-y-2 animate-pulse">
        <span class="flex h-8 w-40 bg-secondary_bg_color rounded-2xl" />

        <span v-for="el in 3" :key="el" class="flex h-40 w-full bg-secondary_bg_color rounded-2xl" />
      </div>

    </main>
</template>