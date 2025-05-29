<script setup>
import { ref, watch, onMounted, getCurrentInstance } from "vue";
import { TonConnectButton, useTonAddress } from "@townsquarelabs/ui-vue";

import getUserNfts from "../../utils/getUserNfts";
import Web3NFT from "../../components/Web3/Web3NFT.vue";
import { Icon } from "@iconify/vue/dist/iconify.js";
import axiosInstance from "../../utils/axiosInstance";

const { proxy } = getCurrentInstance();

const props = defineProps({
  ship: Object,
});

const emit = defineEmits(["commit", "clear"]);

const change = async (e) => {
  if (e.selected) {
    if (props.ship.crew_capacity - (props.ship.crew_members?.length || 0) < 1) {
      return webapp.showAlert(proxy.$t("max_crews"));
    }
  }

  emit("commit", e);

  let { data, error } = await axiosInstance.post("/rest/v1/rpc/change_nft_to_ship", {
    p_ship_id: e.ship_id,
    p_nft_id: e.nft,
  });
};

const loading = ref(false);

const userFriendlyAddress = useTonAddress();

const nfts = ref(null);

const webapp = window.Telegram.WebApp;

const getSavedNfts = async () => {
  let { data: nft_items, error } = await axiosInstance.get("/rest/v1/nft_items", {
    params: {
      select: "*",
      owner: `eq.${webapp.initDataUnsafe.user?.id}`,
      active: "eq.true",
    },
  });
  return nft_items;
};

onMounted(async () => {
  loading.value = true;
  nfts.value = await getSavedNfts();
  console.log("mounted");
  loading.value = false;
});

const checkIn = async () => {
  if (userFriendlyAddress.value) {
    loading.value = true;
    nfts.value = await getUserNfts(userFriendlyAddress.value);
    console.log("checkIn");
    loading.value = false;
  }
};

watch(userFriendlyAddress, async (newAddress) => {
  if (newAddress) {
    loading.value = true;
    const storedAddress = localStorage.getItem("userFriendlyAddress");

    if (!storedAddress || storedAddress !== newAddress) {
      localStorage.setItem("userFriendlyAddress", newAddress);

      let { data, error } = await axiosInstance.post("/rest/v1/rpc/update_user_wallet", {
        connected_wallet: newAddress,
      });

      nfts.value = await getUserNfts(newAddress);
      console.log("checkIn");
    }

    loading.value = false;
  } else {
    loading.value = true;
    nfts.value = nfts.value.filter((nft) => !nft.is_minted);
    localStorage.removeItem("userFriendlyAddress");
    emit("clear");
    loading.value = false;

    let { data, error } = await axiosInstance.post("/rest/v1/rpc/update_user_wallet", {
      connected_wallet: null,
    });
  }
});
</script>

<template>
  <div class="flex flex-col gap-y-4">
    <div class="flex justify-center gap-x-2">
      <TonConnectButton />
      <button
        v-if="userFriendlyAddress"
        :disabled="loading"
        @click="checkIn"
        class="h-10 text-bg_color text-lg aspect-square rounded-full flex justify-center items-center bg-text_color"
      >
        <Icon icon="ic:round-refresh" :class="[loading && 'animate-spin']" />
      </button>
    </div>
    <transition name="fade" mode="out-in">
      <div v-if="!loading">
        <div v-if="nfts && nfts.length > 0" class="grid grid-cols-3 gap-2">
          <Web3NFT
            v-for="(nft, index) in nfts"
            :key="index"
            :nft="nft"
            :ship_id="ship?.ship_id"
            :selected="ship?.crew_members?.some((n) => n.type === 'nft' && n.id === nft.id) || false"
            @change="change"
          />
        </div>
      </div>

      <div v-else class="grid grid-cols-3 gap-2">
        <div
          v-for="sk in 5"
          :key="sk"
          class="w-full aspect-square rounded-2xl flex bg-secondary_bg_color animate-pulse"
        />
      </div>
    </transition>
  </div>
</template>
