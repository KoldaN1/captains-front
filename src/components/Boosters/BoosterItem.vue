<script setup>
import seaStar from "../../assets/sea-star.svg";
import diamond from "../../assets/diamond.svg";
import pirateBell from "../../assets/pirate-bell.svg";
import ButtonEvent from "../ButtonEvent/ButtonEvent.vue";
import { computed, onMounted, ref, getCurrentInstance } from "vue";
import { useTonAddress, useTonConnectUI } from "@townsquarelabs/ui-vue";
import { useTgTheme } from "../../composables/tg_theme.js";
import axios from "axios";
import Alert from "../Alert/Alert.vue";
import generateId from "../../utils/generateId";

const { proxy } = getCurrentInstance();

const alerts = ref([]);
const userFriendlyAddress = useTonAddress();

const addAlert = (title, type) => {
  const id = generateId();
  alerts.value.push({ id, title, type });

  setTimeout(() => {
    removeAlert(id);
  }, 10000);
};

const removeAlert = (id) => (alerts.value = alerts.value.filter((alert) => alert.id !== id));

const props = defineProps({
  title: String,
  id: String,
  subTitle: String,
  icon: String,
  iconText: String,
  eventData: Object,
  userData: Object,
  boostersCost: Object,
});

const buy_booster_is_load = ref(false);
const items = ref([]);

onMounted(() => {
  items.value = [
    {
      title: proxy.$t("boosters.XTR.title"),
      id: "XTR",
      text: proxy.$t("boosters.XTR.description"),
      icon: seaStar,
      alt: "sea-star",
      buttonIcon: seaStar,
    },
    {
      title: proxy.$t("boosters.TON.title"),
      id: "TON",
      text: proxy.$t("boosters.TON.description"),
      icon: diamond,
      alt: "diamond",
      buttonIcon: pirateBell,
    },
  ];
  console.log(props.boostersCost);
});

const webapp = window.Telegram.WebApp;
const [tonConnectUI] = useTonConnectUI();

const background = computed(() => {
  return useTgTheme() === "light" ? "bg-white" : "bg-white/[0.16]";
});

const borderButtonColor = computed(() => {
  return useTgTheme() === "light" ? "border-black" : "";
});

async function handleBuy(currency) {
  try {
    if (!userFriendlyAddress.value) {
      return addAlert(proxy.$t("needWallet"), "error");
    }

    buy_booster_is_load.value = true;
    const payment_data = await axios.post(
      import.meta.env.VITE_BOT_API + "/api/boosters",
      {
        paymentId: Math.floor(100000 + Math.random() * 900000),
        eventId: props.eventData.id,
        currency,
        boosterName: props.id,
      },
      {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("jwt_token")}`,
        },
      },
    );

    const fullPaymentData = payment_data?.data || null;
    if (!fullPaymentData) return;

    if (fullPaymentData.type === "XTR" && fullPaymentData.invoiceLink) {
      webapp.openInvoice(fullPaymentData.invoiceLink, async (status) => {
        if (status) {
          props.eventData.userBoosters = [
            ...props.eventData.userBoosters,
            { booster_name: fullPaymentData.payload.name },
          ];

          if (fullPaymentData.payload.data && fullPaymentData.payload.name == "compensation") {
            props.userData[0].partner_coins += parseInt(fullPaymentData.payload.data);
          }
        }
      });
    } else if (fullPaymentData.type === "TON") {
      const payload = fullPaymentData.payload;
      const myTransaction = {
        validUntil: Math.floor(Date.now() + 60 * 1000),
        messages: [
          {
            address: payload.wallet,
            amount: payload.totalAmount,
            payload: payload.paymentId,
          },
        ],
      };

      const result = await tonConnectUI.sendTransaction(myTransaction);
      addAlert(proxy.$t("successTransaction"), "success");
    }

    buy_booster_is_load.value = false;
  } catch (error) {
    buy_booster_is_load.value = false;
    addAlert(error.response?.data?.error || proxy.$t("error"), "error");
    console.log(error);
  }
}
</script>

<template>
  <transition name="fade">
    <div v-if="alerts.length > 0" v-auto-animate class="fixed z-20 top-4 left-4 right-4 flex flex-col gap-y-1.5">
      <Alert v-for="alert in alerts" :key="alert.id" :title="alert.title" :type="alert.type" />
    </div>
  </transition>
  <div class="p-4 h-full bg-secondary_bg_color rounded-[20px]">
    <div class="flex justify-between">
      <h3 class="font-medium">{{ title }}</h3>
      <img :src="icon" :alt="iconText" class="booster-item__icon" />
    </div>
    <hr class="ml-[-16px] mr-[-16px] mt-2 mb-2 opacity-50" />
    <p class="text-sm">{{ subTitle }}</p>

    <div v-if="items.length > 0" class="grid grid-cols-2 gap-2 mt-2">
      <div
        v-for="item in items"
        :key="item.id"
        :class="`${background} flex flex-col justify-center items-center px-2 py-4 rounded-[10px] booster-item__wrapper`"
      >
        <img :src="item.icon" :alt="item.alt" class="w-[24px] h-[24px]" />
        <h2 class="font-medium mt-2">{{ item.title }}</h2>
        <p class="text-center mt-2 mb-2 text-sm opacity-60">{{ item.text }}</p>
        <div v-if="boostersCost[props.id][item.id]">
          <ButtonEvent
            v-if="
              !(
                props.id == 'compensation' &&
                props.eventData.userBoosters.some((booster) => booster.booster_name === props.id)
              )
            "
            :buy_booster_is_load="buy_booster_is_load"
            :key="item.id + props.id"
            :text="boostersCost[props.id][item.id] || 0"
            :img-url="item.buttonIcon"
            :class="`mt-auto w-[84px] h-[32px] text-sm text-white ${borderButtonColor} booster-item__button`"
            @click="handleBuy(item.id)"
          />
        </div>
        <div v-else class="text-center mt-2 mb-2 text-sm opacity-60">
          <p>{{ $t("notAvailable") }}</p>
        </div>
      </div>
    </div>
    <div v-else>
      <p>Loading items...</p>
    </div>
  </div>
</template>

<style lang="scss">
.booster-item {
  &__button {
    img {
      width: 16px;
      height: 16px;
      margin-left: 5px;
    }
  }

  &__wrapper {
    &:first-child {
      .booster-item__button {
        background: #f87c56;

        img {
          filter: brightness(0) invert(1);
        }
      }
    }
  }
}
</style>
