<script setup>

    import { onMounted, ref, getCurrentInstance } from 'vue'
    import { Icon } from '@iconify/vue'
    import FrenCard from '../Bench/Fren.vue'
import axiosInstance from '../../utils/axiosInstance'

    const frens = ref(null)
    const searchQuery = ref('')
    const loading = ref(true)
    const webapp = window.Telegram.WebApp

    const props = defineProps({
        ship: Object
    })

    const emit = defineEmits(['commit', 'clear'])

    const { proxy } = getCurrentInstance()
    const link = `t.me/${import.meta.env.VITE_SHARE_APP}?startapp=${webapp.initDataUnsafe.user?.id}`

    const change = async (e) => {
        if (e.selected) {
            const maxFrenSlots = Math.ceil(props.ship.crew_capacity * 0.3);
            const currentFrenCount = props.ship.crew_members?.filter(member => member.type === 'fren').length || 0;
            
            if (currentFrenCount >= maxFrenSlots) {
                return webapp.showAlert(proxy.$t('max_fren_crews'));
            }
            
            if (props.ship.crew_capacity - (props.ship.crew_members?.length || 0) < 1) {
                return webapp.showAlert(proxy.$t('max_crews'));
            }
        }
        
        emit('commit', e)

        let { data, error } = await axiosInstance.post('/rest/v1/rpc/change_fren_to_ship', {
            p_ship_id: e.ship_id,
            p_fren_chat_id: e.fren
        })
    }

    const share = () => {
        webapp.HapticFeedback.impactOccurred('light')
        let reply = proxy.$t('share_title')
        window.open(`https://t.me/share/url?url=${link}&text=${reply}`)
    }

    const searchFrens = async () => {
        await getFrens(searchQuery.value)
    }

    const getFrens = async (searchQuery) => {
        loading.value = true

        let { data, error } = await axiosInstance.post('/rest/v1/rpc/v3_get_referred_users', {
            p_page: 1, 
            p_page_size: 100, 
            p_search_query: searchQuery
        })
        if (error) console.error(error)
        else {
            frens.value = data
        }

        loading.value = false
    }

    onMounted(async () => {
        await getFrens()
    })

</script>

<template>
    <div class="flex flex-col gap-y-4">
        <div class="flex justify-center gap-x-2">
            <input 
                type="text" 
                v-model="searchQuery" 
                :placeholder="$t('search')" 
                class="w-44 px-4 h-10 rounded-full text-center font-medium outline-none placeholder:text-text_color bg-secondary_bg_color"
                @keyup.enter="(e) => {e.target.blur(); searchFrens()}"
            />
        </div>

        <div class="grid grid-cols-3 gap-2">
            <button @click="share" class="flex justify-center active:opacity-75 transition-all items-center bg-secondary_bg_color rounded-2xl aspect-square w-full">
                <Icon icon="typcn:plus" class="text-xl text-hint_color" />
            </button>

            <FrenCard 
                v-if="!loading"
                v-for="f, index in frens" :key="index" 
                :fren="f"
                :ship_id="ship?.ship_id" 
                :selected="ship?.crew_members?.some(member => member.type === 'fren' && member.chat_id === f.chat_id) || false"
                @change="change"
            />

            <div v-else v-for="el in 2" :key="el" class="flex animate-pulse justify-center active:opacity-75 transition-all items-center bg-secondary_bg_color rounded-2xl aspect-square w-full" />
                
        </div>
    </div>
</template>