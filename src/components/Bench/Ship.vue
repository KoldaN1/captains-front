<script setup>
import {Icon} from '@iconify/vue'
import formatNumber from '../../utils/formatNumber'
import {ref, watch, onUnmounted, onMounted, getCurrentInstance} from 'vue'
import {useRouter} from 'vue-router'
import Boosters from './Boosters.vue'
import getFinePrice from "../../utils/getFinePrice.js";
import getShipInvoice from "../../services/api/getShipInvoice.js";
import {timeout} from "../../utils/timeout.js";
import getShipPayload from "../../services/api/getShipPayload.js";
import {useTonConnectUI} from "@townsquarelabs/ui-vue";

const router = useRouter()

const {proxy} = getCurrentInstance()

const emit = defineEmits([
  'getUserData',
  'buy',
  'upgrade',
  'select',
  'level_up',
  'cut_time',
  'restore_ads',
  'openBottomSheet'
])

const props = defineProps({
  ship: Object,
  selected_ship: Number,
  available_ads: Number,
  ads_restore_time_left: Number,
  buttonActivity: Boolean,
})

const webapp = window.Telegram.WebApp

const formatTimeLeft = (timeLeftSeconds) => {
  const hours = Math.floor(timeLeftSeconds / 3600);
  const minutes = Math.floor((timeLeftSeconds % 3600) / 60);
  const seconds = Math.floor(timeLeftSeconds % 60);

  let formattedTime = '';
  if (hours > 0) {
    formattedTime += `${hours}${proxy.$t('h')} `;
  }
  formattedTime += `${minutes}${proxy.$t('m')} ${seconds}${proxy.$t('s')}`;

  return formattedTime.trim();
}

// Переменные для отслеживания времени до восстановления энергии
const timeLeftToRestoreAds = ref(null)

watch(() => props.ads_restore_time_left, (newVal) => {
  if (props.available_ads < 2) {
    timeLeftToRestoreAds.value = newVal / 1000;
    if (intervalRestoreId.value) {
      clearInterval(intervalRestoreId.value);
    }

    intervalRestoreId.value = setInterval(() => {
      if (timeLeftToRestoreAds.value !== null && timeLeftToRestoreAds.value > 1) {
        timeLeftToRestoreAds.value -= 1;
      } else {
        timeLeftToRestoreAds.value = null;
        clearInterval(intervalRestoreId.value);
        emit('restore_ads', 2); // Восстанавливаем энергию до 2 и сбрасываем таймер
      }
    }, 1000);
  }
});

const timeLeftToUpgrade = ref(props.ship.time_left_to_upgrade ? props.ship.time_left_to_upgrade / 1000 : null)

// Следим за изменением свойства time_left_to_upgrade
watch(() => props.ship.time_left_to_upgrade, (newVal) => {
  timeLeftToUpgrade.value = newVal / 1000
  if (intervalId.value) {
    clearInterval(intervalId.value)
  }

  intervalId.value = setInterval(() => {
    if (timeLeftToUpgrade.value !== null && timeLeftToUpgrade.value > 1) {
      timeLeftToUpgrade.value -= 1
    } else {
      emit('level_up', props.ship)
      timeLeftToUpgrade.value = null
      clearInterval(intervalId.value)
    }
  }, 1000)
})

const intervalId = ref(null)
const intervalRestoreId = ref(null)

const isPurchasing = ref(false);
const isStarsPurchase = ref(true);

onMounted(() => {
  if (timeLeftToUpgrade.value) {
    intervalId.value = setInterval(() => {
      if (timeLeftToUpgrade.value !== null && timeLeftToUpgrade.value > 1) {
        timeLeftToUpgrade.value -= 1
      } else {
        emit('level_up', props.ship)
        timeLeftToUpgrade.value = null
        clearInterval(intervalId.value)
      }
    }, 1000)
  }

  if (props.ads_restore_time_left && props.available_ads === 0) {
    timeLeftToRestoreAds.value = props.ads_restore_time_left / 1000;
    intervalRestoreId.value = setInterval(() => {
      if (timeLeftToRestoreAds.value !== null && timeLeftToRestoreAds.value > 1) {
        timeLeftToRestoreAds.value -= 1
      } else {
        timeLeftToRestoreAds.value = null;
        clearInterval(intervalRestoreId.value);
        emit('restore_ads', 2); // Восстанавливаем энергию до 2 и сбрасываем таймер
      }
    }, 1000);
  }
})

onUnmounted(() => {
  clearInterval(intervalId)
  clearInterval(intervalRestoreId)
})

const openLinked = (e) => {
  if (props.ship.is_purchased) {
    if (e.type === 'nft') {
      router.push({name: 'HIRING_NFTS', params: {id: e.ship}})
    } else if (e.type === 'fren') {
      router.push({name: 'HIRING_FRENS', params: {id: e.ship}})
    } else {
      emit('openBottomSheet', props.ship.ship_id)
    }
  } else {
    webapp.showAlert(proxy.$t('ship_not_purchased'))
  }
}

const invoicePromise = (invoiceLink) => new Promise((fulfill, reject) => {
  try {
    webapp.openInvoice(invoiceLink, status => {
      if (status) {
        fulfill();
      } else {
        reject();
      }
    })
  } catch (error) {
    console.error('[invoicePromise]', error);
    reject(error);
  }
})

const onPurchaseStars = async () => {
  try {
    if (isPurchasing.value || !props.ship.prices.starsPrice) return;

    webapp.HapticFeedback.impactOccurred('light');
    isPurchasing.value = true;
    isStarsPurchase.value = true;
    const invoice = await getShipInvoice(props.ship.ship_id);

    await invoicePromise(invoice);
    await timeout(1500);
    emit('getUserData');
  } catch (error) {
    console.error('[onPurchaseStars]', error);
  }
  isPurchasing.value = false;
}

const [tonConnectUI] = useTonConnectUI();

const onPurchaseTon = async () => {
  try {
    if (isPurchasing.value || !props.ship.prices.tonPrice) return;

    webapp.HapticFeedback.impactOccurred('light');
    isPurchasing.value = true;
    isStarsPurchase.value = false;
    const data = await getShipPayload(props.ship.ship_id);
    console.log('[getShipPayload]', data);

    const myTransaction = {
      validUntil: Math.floor(Date.now() + 60 * 1000),
      messages: [
        {
          address: data.wallet,
          amount: data.amount,
          payload: data.payload,
        },
      ],
    };

    const result = await tonConnectUI.sendTransaction(myTransaction);

    await timeout(60 * 1000);
    emit('getUserData');
  } catch (error) {
    console.error('[onPurchaseTon]', error);
  }
  isPurchasing.value = false;
}

</script>

<template>
  <div class="flex flex-col items-center">
        <span class="w-60 h-60">
            <img :src="ship.ship_image_url"/>
        </span>

    <div class="flex flex-col gap-y-4 w-full">
      <div class="flex flex-col font-medium rounded-2xl gap-y-2 shadow-sm bg-secondary_bg_color w-full">
        <div class="flex p-4 pb-2 justify-between">
          <div @click="() => {
                                if (ship.is_purchased && selected_ship !== ship.ship_id) {
                                    webapp.HapticFeedback.impactOccurred('light')
                                    emit('select', ship)
                                }
                            }" class="flex items-center gap-x-2">
                        <span class="w-5 h-5 shadow-sm flex justify-center items-center rounded-full bg-bg_color">
                            <span v-if="selected_ship === ship.ship_id"
                                  class="w-3 h-3 flex rounded-full bg-button_color text-white"/>
                        </span>
            <h4 class="font-medium">{{ ship.name }}</h4>
          </div>
          <span class="font-medium text-hint_color">{{ $t('level') }} {{ ship.user_level }} / {{
              ship.max_level
            }}</span>
        </div>

        <hr class="border-hint_color opacity-10"/>

        <span class="flex px-4 items-center gap-x-2 text-sm">
                    <img src="../../assets/coin.svg" class="w-6"/>
                    <span class="flex items-center gap-x-1">{{
                        $t('income_per_hour')
                      }} {{ formatNumber(ship.income_per_hour) }}</span>
                </span>

        <span class="flex px-4 items-center gap-x-2 text-sm">
                    <img src="../../assets/coin.svg" class="w-6"/>
                    <span class="flex items-center gap-x-1" v-if="ship.user_level >= ship.max_level">{{
                        $t('limit_life')
                      }}</span>
                    <span class="flex items-center gap-x-1" v-else>{{
                        $t('las_upgrade')
                      }} {{ formatNumber(ship.income_per_hour + ship.update_income_level) }}</span>
                </span>

        <Boosters
            :crew_members="ship?.crew_members || []"
        />

        <span/>

        <div class="px-4 pb-4">
          <button @click="(e) => emit('buy', ship)" v-if="!ship.is_purchased"
                  :class="['bg-yellow-500 w-full rounded-2xl shadow-sm active:opacity-75 transition-all p-2.5 text-white font-semibold uppercase']">
            {{ $t('buy') }} {{ formatNumber(ship.price) }} {{ $t('coins') }}
          </button>

          <div v-else-if="ship.is_purchased" class="relative">
            <button :disabled="ship.user_level >= ship.max_level || timeLeftToUpgrade || buttonActivity"
                    @click="(e) => emit('upgrade', ship)"
                    :class="['bg-button_color relative rounded-2xl shadow-sm active:opacity-75 transition-all p-2.5 text-white w-full font-semibold uppercase', { 'bg-slate-500 cursor-not-allowed': timeLeftToUpgrade }]">
              <span v-if="ship.user_level >= ship.max_level">{{ $t('max_level') }}</span>
              <span v-else-if="timeLeftToUpgrade">
                                <span>{{ $t('upgraded') }} {{ formatTimeLeft(timeLeftToUpgrade) }}</span>
                                <button v-if="available_ads" :disabled="!available_ads || buttonActivity"
                                        @click="() => emit('cut_time', ship)"
                                        class="absolute text-sm -top-5 -right-2 bg-button_color rounded-full px-3 py-1.5 shadow-sm">
                                    <div>
                                        <span>-20 {{ $t('min') }}</span>
                                        <sup class="ml-1">{{ available_ads }}/2 ads</sup>
                                    </div>

                                  <!-- <div v-else class="flex items-center gap-x-1">
                                      <Icon icon="mingcute:time-line" />
                                      <span v-if="timeLeftToRestoreAds">{{ formatTimeLeft(timeLeftToRestoreAds) }}</span>
                                  </div> -->
                                </button>
                            </span>
              <span v-else>{{ $t('upgrade') }} {{ formatNumber(ship.upgrade_cost) }} {{ $t('coins') }}</span>
            </button>
          </div>
          <div class="ship-upgrade">
            <div class="ship-upgrade-block">
              <svg width="21" height="22" viewBox="0 0 21 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11.9568 1.78525L14.0568 6.06551C14.2225 6.40302 14.5415 6.63653 14.9115 6.69016L19.6075 7.37671C20.9397 7.57145 21.472 9.21851 20.5074 10.1632L17.1097 13.4961C16.8423 13.7585 16.7201 14.1364 16.7832 14.5069L17.5855 19.2114C17.8127 20.5465 16.4207 21.564 15.2287 20.9335L11.0289 18.712C10.6983 18.5371 10.303 18.5371 9.9724 18.712L5.77258 20.9335C4.58071 21.5639 3.18863 20.5457 3.41584 19.2114L4.21807 14.5069C4.28123 14.1364 4.15901 13.7585 3.8916 13.4961L0.492258 10.1641C-0.47156 9.21843 0.0599701 7.57211 1.39211 7.37755L6.08815 6.69101C6.45809 6.63654 6.77801 6.40301 6.94288 6.06635L9.04279 1.7861C9.63913 0.571438 11.36 0.571438 11.9564 1.78527L11.9568 1.78525Z" fill="#F87C56"/>
              </svg>
              <div class="ship-upgrade-title">
                Telegram Stars
              </div>
              <div class="ship-upgrade-text">
                Buy this ship with STARS and get this ship with MAX Level
              </div>
              <button :class="[
                  'ship-upgrade-button',
                  {
                    disabled: (isPurchasing && !isStarsPurchase) || !ship.prices.starsPrice
                  }
              ]" @click="onPurchaseStars()">
                <template v-if="isPurchasing && isStarsPurchase">
                  <Icon icon="line-md:loading-twotone-loop" class="text-lg" />
                </template>
                <template v-else>
                  <span>{{ship.prices.starsPrice}}</span>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8.97123 1.85684L10.3712 4.71034C10.4816 4.93534 10.6944 5.09102 10.941 5.12677L14.0717 5.58447C14.9598 5.7143 15.3147 6.81234 14.6716 7.44216L12.4065 9.66404C12.2282 9.83898 12.1467 10.0909 12.1888 10.3379L12.7236 13.4742C12.8751 14.3643 11.9471 15.0427 11.1525 14.6223L8.35261 13.1414C8.13223 13.0247 7.86865 13.0247 7.64827 13.1414L4.84838 14.6223C4.0538 15.0426 3.12575 14.3638 3.27723 13.4742L3.81205 10.3379C3.85416 10.0909 3.77268 9.83898 3.5944 9.66404L1.32817 7.44273C0.685627 6.81229 1.03998 5.71474 1.92808 5.58504L5.05877 5.12734C5.3054 5.09103 5.51868 4.93534 5.62859 4.7109L7.02853 1.8574C7.42608 1.04763 8.57337 1.04763 8.97095 1.85685L8.97123 1.85684Z" fill="white"/>
                  </svg>
                </template>
              </button>
            </div>
            <div class="ship-upgrade-block">
              <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16.6946 8.11035H12.6504L14.7085 11.6744H19.1211L17.0546 8.31024C16.9826 8.18691 16.8386 8.11035 16.6946 8.11035Z" fill="#549BF8"/>
                <path d="M12.3066 20.0192L19.0738 12.5254H14.6866L12.3066 20.0192Z" fill="#549BF8"/>
                <path d="M13.3118 5.36711C13.6379 5.44366 14.6288 6.43886 14.6924 6.74508C14.6924 6.97899 14.8829 7.17888 15.1158 7.17888C15.3445 7.17888 15.5266 7.00876 15.5393 6.78335V6.75784C15.6155 6.43036 16.5938 5.44366 16.9241 5.36711C17.1528 5.36285 17.3433 5.17572 17.3433 4.94606C17.3433 4.7164 17.1739 4.52927 16.9495 4.52076H16.9241C16.5938 4.44421 15.6028 3.44901 15.5393 3.14279C15.5393 2.90888 15.353 2.70898 15.1158 2.70898C14.8914 2.70898 14.7051 2.8791 14.6966 3.10451C14.6966 3.11302 14.6924 3.12153 14.6924 3.13003C14.6204 3.46176 13.6252 4.45697 13.3245 4.51651C13.0916 4.51651 12.8926 4.70789 12.8926 4.94181C12.8926 5.17147 13.062 5.3586 13.2822 5.36711H13.3118Z" fill="#549BF8"/>
                <path d="M22.6061 8.51002C22.5976 8.51002 22.5891 8.51002 22.5807 8.50577C22.2504 8.43346 21.2594 7.43826 21.1959 7.13205C21.1959 6.89813 21.0053 6.69824 20.7724 6.69824C20.5437 6.69824 20.3616 6.86836 20.3489 7.09377V7.11929C20.2727 7.45102 19.2818 8.44197 18.9811 8.50577C18.744 8.50577 18.5449 8.69715 18.5449 8.93106C18.5449 9.16073 18.7143 9.34361 18.9388 9.35636H18.9642C19.2945 9.43292 20.2854 10.4281 20.3489 10.7343C20.3489 10.9682 20.5353 11.1681 20.7724 11.1681C20.9969 11.1681 21.1832 10.998 21.1917 10.7726C21.1959 10.7641 21.1959 10.7556 21.1959 10.7471C21.2679 10.4196 22.2504 9.43292 22.5807 9.35636C22.8051 9.35211 22.9999 9.16498 22.9999 8.93532C22.9999 8.70566 22.8348 8.52278 22.6061 8.51002Z" fill="#549BF8"/>
                <path d="M18.6631 4.58064C18.9256 4.6657 19.6625 5.40572 19.726 5.62263C19.726 5.85654 19.9166 6.06494 20.1495 6.06494C20.3739 6.06494 20.556 5.90332 20.5687 5.68217C20.5687 5.66941 20.5729 5.6609 20.5729 5.64814C20.6534 5.38871 21.3776 4.66145 21.6359 4.58064C21.8561 4.56788 22.0509 4.385 22.0509 4.1596C22.0509 3.93419 21.89 3.74705 21.6655 3.73855C21.657 3.7343 21.6443 3.7343 21.6359 3.7343C21.3733 3.65349 20.6365 2.90921 20.5729 2.69231C20.5729 2.4584 20.3866 2.25 20.1495 2.25C19.925 2.25 19.7429 2.41161 19.7302 2.63277C19.7302 2.64553 19.726 2.65403 19.726 2.66679C19.6455 2.93048 18.9087 3.6705 18.6885 3.7343C18.4556 3.7343 18.248 3.92143 18.248 4.15534C18.248 4.385 18.409 4.56788 18.6334 4.58064H18.6631Z" fill="#549BF8"/>
                <path d="M8.47075 8.11035H4.42653C4.28255 8.11035 4.1428 8.18691 4.06657 8.31024L2 11.6744H6.41264L8.47075 8.11035Z" fill="#549BF8"/>
                <path d="M2.05469 12.5254L8.8134 20.0234L6.43345 12.5254H2.05469Z" fill="#549BF8"/>
                <path d="M7.32227 12.5254L10.1553 21.4524C10.168 21.495 10.1892 21.5375 10.2146 21.5758C10.2231 21.5885 10.2358 21.597 10.2443 21.6098C10.2612 21.6311 10.2824 21.6481 10.3078 21.6693C10.3332 21.6863 10.3586 21.6991 10.3882 21.7119C10.4094 21.7246 10.4348 21.7331 10.4645 21.7374C10.4941 21.7459 10.528 21.7501 10.5619 21.7501C10.6212 21.7501 10.6804 21.7374 10.7313 21.7119C10.7609 21.7034 10.7863 21.6863 10.8075 21.6693C10.8075 21.6693 10.8075 21.6693 10.8117 21.6693C10.8371 21.6481 10.8583 21.6311 10.8752 21.6098C10.8837 21.597 10.8964 21.5885 10.9049 21.5758C10.9303 21.5375 10.9515 21.495 10.9642 21.4524L13.7972 12.5254H7.32227Z" fill="#549BF8"/>
                <path d="M7.39062 11.6744H13.7301L11.7906 8.31875C11.7143 8.19116 11.5746 8.11035 11.4221 8.11035H9.69858C9.54613 8.11035 9.40638 8.19116 9.33015 8.31875L7.39062 11.6744Z" fill="#549BF8"/>
              </svg>
              <div class="ship-upgrade-title">
                Transaction
              </div>
              <div class="ship-upgrade-text">
                Make a transaction with TON and get this ship FREE with MAX Level
              </div>
              <button :class="[
                  'ship-upgrade-button',
                  'blue',
                  {
                    disabled: (isPurchasing && isStarsPurchase) || !ship.prices.tonPrice
                  }
              ]" @click="onPurchaseTon()">
                <template v-if="isPurchasing && !isStarsPurchase">
                  <Icon icon="line-md:loading-twotone-loop" class="text-lg" />
                </template>
                <template v-else>
                  <span>{{getFinePrice(ship.prices.tonPrice)}}</span>
                  <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7.95382 6.30438C8.05092 6.20713 8.20778 6.20713 8.30487 6.30438L8.91237 6.91279C9.93067 6.22708 11.3224 6.33181 12.2237 7.23445L14.1309 9.14451L9.64678 13.6354L7.7396 11.7253C6.83832 10.8227 6.73374 9.42873 7.41843 8.40899L6.81093 7.80058C6.71383 7.70333 6.71383 7.54623 6.81093 7.449L7.95382 6.30438Z" fill="white"/>
                    <path d="M15.4272 9.69327L15.0313 9.2968C14.9342 9.19955 14.7581 9.21763 14.679 9.2968L9.79912 14.1841C9.70202 14.2813 9.70202 14.439 9.79912 14.5369L10.195 14.9334C10.2921 15.0306 10.4682 15.0125 10.5473 14.9334L15.4272 10.0461C15.5243 9.94884 15.5243 9.79112 15.4272 9.69327Z" fill="white"/>
                    <path d="M2.35128 1.84094C2.3712 1.82099 2.39111 1.80104 2.41103 1.78359C3.51149 0.738805 5.30407 0.738805 6.40449 1.78359C7.27341 2.60894 7.54977 3.86073 7.10909 4.97527C6.95971 5.35179 7.06926 5.81557 7.38047 6.12976L7.40039 6.1522L6.65347 6.90025L6.63355 6.87781C6.01858 6.25942 5.81692 5.35927 6.12564 4.58379C6.40698 3.87564 6.2327 3.07772 5.67749 2.55165C4.97788 1.88838 3.83755 1.88838 3.13788 2.55165C3.12543 2.56411 3.11049 2.57658 3.09804 2.58905C2.75695 2.93315 2.56523 3.38697 2.55777 3.87321C2.5503 4.37689 2.742 4.85315 3.09804 5.20972C3.09804 5.20972 1.46222 5.39923 1.49967 3.85824C1.51959 3.09273 1.81349 2.3796 2.35128 1.84094Z" fill="white"/>
                  </svg>
                </template>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="flex flex-col bg-secondary_bg_color rounded-2xl gap-y-4 shadow-sm w-full p-4">
        <div class="flex justify-between">
          <h4 class="font-medium">{{ $t('crew_members') }}</h4>
          <span class="font-medium text-hint_color">{{ $t('max') }} {{ ship.crew_capacity }}</span>
        </div>

        <div class="grid grid-cols-3 gap-2">
          <button @click="openLinked({type: el.type, ship: ship.ship_id })" v-for="el, index in ship.crew_members"
                  :key="index"
                  class="flex justify-center active:opacity-75 transition-all items-center bg-bg_color overflow-hidden rounded-2xl aspect-square w-full">
            <img v-if="el.type === 'nft'" :src="el.metadata.image" class="object-cover"/>

            <span v-if="el.type === 'fren'"
                  :class="['flex gap-y-1.5 relative flex-col death-pattern bg-center bg-no-repeat bg-cover justify-center p-2 text-text_color font-medium text-xs text-center active:opacity-75 transition-all items-center rounded-2xl aspect-square w-full', el.rare === 'plain' && 'bg-bg_plain', el.rare === 'scarce' && 'bg-bg_scarce', el.rare === 'epic' && 'bg-bg_epic']">
                            <div
                                class="uppercase bg-white text-black w-[52px] aspect-square rounded-full shrink-0 flex justify-center text-xl items-center font-semibold">{{
                                el.name?.slice(0, 2) || el.username?.slice(0, 2) || 'Fr'
                              }}</div>
                        </span>
          </button>

          <button @click="openLinked" v-for="el, index in ship.crew_capacity - (ship?.crew_members?.length || 0)"
                  :key="index"
                  class="flex justify-center active:opacity-75 transition-all items-center bg-bg_color rounded-2xl aspect-square w-full">
            <Icon icon="typcn:plus" class="text-xl text-hint_color"/>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.death-pattern {
  background-image: url('../../assets/death_bg.svg');
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
}
.ship-upgrade {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  margin-top: 24px;

  &-block {
    background: white;
    border-radius: 10px;
    padding: 16px 8px;
    gap: 8px;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
  }
  &-title {
    font-size: 16px;
    font-weight: 500;
    line-height: 16px;
    color: rgba(0, 0, 0, 1);
  }
  &-text {
    font-size: 12px;
    line-height: 14px;
    color: rgba(0, 0, 0, 0.6);
    text-align: center;
  }
  &-button {
    background: rgba(248, 124, 86, 1);
    min-width: 84px;
    padding: 8px 8px;
    gap: 4px;
    border-radius: 8px;
    box-shadow: 0 2px 0 0 rgba(0, 0, 0, 1);
    transition: all 0.15s ease 0s;
    font-size: 14px;
    line-height: 16px;
    font-weight: 700;
    color: rgba(255, 255, 255, 1);
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;

    &.blue {
      background: rgba(84, 155, 248, 1);
    }
    &.disabled {
      background: gray;
      cursor: initial;
    }
    &:not(.disabled):active {
      margin-top: 2px;
      margin-bottom: -2px;
      box-shadow: 0 0 0 0 rgba(0, 0, 0, 1);
    }
  }
}
</style>