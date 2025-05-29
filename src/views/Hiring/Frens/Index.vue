<script setup>

    import { onMounted, onUnmounted, ref } from 'vue'
    import { useRoute, useRouter } from 'vue-router'

    import Teamate from '../../../components/Web3/Teamate.vue'
import axiosInstance from '../../../utils/axiosInstance'

    const route = useRoute()
    const router = useRouter()
    const webapp = window.Telegram.WebApp
    const loading = ref(true)
    const shipInfo = ref(null)

    const back = () => {
        if (window.history.length > 1) {
            router.go(-1)
        } else {
            router.push({ name: 'INDEX' })
        }
    }

    const getShip = async () => {
        let { data, error } = await axiosInstance.post('/rest/v1/rpc/get_ship_info_by_id', {
            p_ship_id: route.params.id
        })
        if (error) console.error(error)
        else {
            loading.value = false
            shipInfo.value = data
        }
    }

    const change = async (commit) => {
        if (shipInfo.value) {
            if (!shipInfo.value.crew_members) {
                shipInfo.value.crew_members = [];
            }
            
            const frenIndex = shipInfo.value.crew_members.findIndex(member => member.chat_id === commit.fren);
            
            if (frenIndex === -1) {
                shipInfo.value.crew_members.push({ chat_id: commit.fren, type: 'fren' });
            } else {
                shipInfo.value.crew_members.splice(frenIndex, 1);
            }
        }
    }

    onMounted(async () => {  
        webapp.onEvent('backButtonClicked', back)
        webapp.BackButton.show()

        await getShip()
    })

    onUnmounted(() => {
        webapp.offEvent('backButtonClicked', back)
        webapp.BackButton.hide()
    })

</script>

<template>
    <transition name="fade" mode="out-in">
        <div v-if="loading" class="flex flex-col gap-y-6 pb-[102px] py-6 px-4 animate-pulse">
            <div class="flex justify-center flex-col items-center gap-y-2">
                <span class="flex h-10 w-40 bg-secondary_bg_color rounded-2xl" />
            </div>
        </div>
      
        <main v-else class="flex flex-col gap-y-5 py-6 px-4">
            <div class="flex justify-center">
                <span class="text-center text-hint_color font-medium" v-if="Math.ceil((shipInfo.crew_capacity || 0) * 0.3) > ((shipInfo.crew_members || []).filter(member => member.type === 'fren').length || 0) && (shipInfo?.crew_members?.length || 0) < (shipInfo.crew_capacity || 0)">
                    {{ $t('ship_can_add_fren', { shipName: shipInfo.name, nftCount: (Math.ceil((shipInfo.crew_capacity || 0) * 0.3) - ((shipInfo.crew_members || []).filter(member => member.type === 'fren').length || 0)) }) }}
                </span>
                <span class="text-center text-hint_color" v-else>
                    {{ $t('ship_full', { shipName: shipInfo.name }) }}
                </span>
            </div>

            <Teamate
                :ship="shipInfo"
                @commit="change"
            />
        </main>
    </transition>
</template>