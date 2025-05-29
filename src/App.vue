<script setup>
import { TonConnectUIProvider } from "@townsquarelabs/ui-vue";
import { useGameStore } from "./stores/gameStore";
import { useRouter } from "vue-router";

import { onMounted, ref } from "vue";

import Loader from "./components/Loader/Loader.vue";
import getJWT from "./utils/getJWT";

import NOT_FOUND from "./views/404/Index.vue";
import NOT_FOUND_TECH from "./views/404_techwork/Index.vue";
import axiosInstance from "./utils/axiosInstance";
import axios from "axios";

import i18n from "./i18n";

const TECH_WORK = false;
const TECH_WORK_USERS = [1259156988, 477376998, 442607384, 284102087, 212104289];

const webapp = window.Telegram.WebApp.initData
  ? window.Telegram.WebApp
  : {
      initData:
        "query_id=AAGKH8stAAAAAIofyy0MivGF&user=%7B%22id%22%3A768286602%2C%22first_name%22%3A%22%D0%A1%D0%B5%D1%80%D0%B3%D0%B5%D0%B9%22%2C%22last_name%22%3A%22%D0%9A%D1%83%D0%B7%D1%8C%D0%BC%D0%B5%D0%BD%D0%BA%D0%BE%D0%B2%22%2C%22username%22%3A%22Sergeipanda%22%2C%22language_code%22%3A%22ru%22%2C%22allows_write_to_pm%22%3Atrue%2C%22photo_url%22%3A%22https%3A%5C%2F%5C%2Ft.me%5C%2Fi%5C%2Fuserpic%5C%2F320%5C%2FIMLlhzHDKgaNwUcTeBH68qda67DdB5YLJvl8J_ufx40.svg%22%7D&auth_date=1739147221&signature=nSh0rqPnJ_lAu_3-VZdao5bUYl4Pe0WPFhfRRvkaS0y98rDX4tdMQUmp9BNtBnQs_pG03IA5zhQYPMktIWwQAQ&hash=cc05d20ce7c38e84a46101b943fa848759eac956e7f0388841060c47b1522652",
      initDataUnsafe: {
        query_id: "AAGKH8stAAAAAIofyy0MivGF",
        user: {
          id: 768286602,
          first_name: "Сергей",
          last_name: "Кузьменков",
          username: "Sergeipanda",
          language_code: "ru",
          allows_write_to_pm: true,
          photo_url: "https://t.me/i/userpic/320/IMLlhzHDKgaNwUcTeBH68qda67DdB5YLJvl8J_ufx40.svg",
        },
        auth_date: "1739147221",
        signature: "nSh0rqPnJ_lAu_3-VZdao5bUYl4Pe0WPFhfRRvkaS0y98rDX4tdMQUmp9BNtBnQs_pG03IA5zhQYPMktIWwQAQ",
        hash: "cc05d20ce7c38e84a46101b943fa848759eac956e7f0388841060c47b1522652",
      },
      version: "8.0",
      platform: "tdesktop",
      colorScheme: "dark",
      themeParams: {
        accent_text_color: "#6ab2f2",
        bg_color: "#17212b",
        bottom_bar_bg_color: "#17212b",
        button_color: "#5288c1",
        button_text_color: "#ffffff",
        destructive_text_color: "#ec3942",
        header_bg_color: "#17212b",
        hint_color: "#708499",
        link_color: "#6ab3f3",
        secondary_bg_color: "#232e3c",
        section_bg_color: "#17212b",
        section_header_text_color: "#6ab3f3",
        section_separator_color: "#111921",
        subtitle_text_color: "#708499",
        text_color: "#f5f5f5",
      },
      isExpanded: true,
      viewportHeight: 590,
      viewportStableHeight: 590,
      safeAreaInset: { top: 0, bottom: 0, left: 0, right: 0 },
      contentSafeAreaInset: { top: 0, bottom: 0, left: 0, right: 0 },
      isClosingConfirmationEnabled: false,
      isVerticalSwipesEnabled: false,
      isFullscreen: false,
      isOrientationLocked: false,
      isActive: true,
      headerColor: "#17212b",
      backgroundColor: "#17212b",
      bottomBarColor: "#17212b",
      BackButton: { isVisible: false, show() {} },
      MainButton: {
        type: "main",
        text: "Continue",
        color: "#5288c1",
        textColor: "#ffffff",
        isVisible: false,
        isProgressVisible: false,
        isActive: true,
        hasShineEffect: false,
      },
      SecondaryButton: {
        type: "secondary",
        text: "Cancel",
        color: "#17212b",
        textColor: "#5288c1",
        isVisible: false,
        isProgressVisible: false,
        isActive: true,
        hasShineEffect: false,
        position: "left",
      },
      SettingsButton: { isVisible: false },
      HapticFeedback: {
        impactOccurred() {},
      },
      CloudStorage: {},
      BiometricManager: {
        isInited: false,
        isBiometricAvailable: false,
        biometricType: "unknown",
        isAccessRequested: false,
        isAccessGranted: false,
        isBiometricTokenSaved: false,
        deviceId: "",
      },
      Accelerometer: { isStarted: false, x: null, y: null, z: null },
      DeviceOrientation: { isStarted: false, absolute: false, alpha: null, beta: null, gamma: null },
      Gyroscope: { isStarted: false, x: null, y: null, z: null },
      LocationManager: {
        isInited: false,
        isLocationAvailable: false,
        isAccessRequested: false,
        isAccessGranted: false,
      },
      ready() {},
      onEvent() {},
      offEvent() {},
    };
window.Telegram.WebApp = webapp;
const gameStore = useGameStore();
const router = useRouter();
const options = {
  actionsConfiguration: { twaReturnUrl: "https://t.me/CaptainsBayBot/aboard" },
  manifestUrl: import.meta.env.VITE_MANIFEST_URL,
};

const loading = ref(true);
const isAuthorized = ref(false);
const isError = ref(false);

const tgWebAppStartParam = new URLSearchParams(window.location.search).get("tgWebAppStartParam");

function changeLanguage(lang) {
  i18n.global.locale = lang;
}

onMounted(async () => {
  if (webapp.initDataUnsafe.user?.language_code === "ru" || webapp.initDataUnsafe.user?.language_code === "uk") {
    changeLanguage("ru");
  }

  webapp.ready();

  let session_token = sessionStorage.getItem("jwt_token");

  if (session_token) {
    isAuthorized.value = true;
  } else {
    const jwt = await getJWT(webapp.initData);
    if (jwt) {
      sessionStorage.setItem("jwt_token", jwt.token);
      session_token = jwt.token;
      isAuthorized.value = true;
    } else {
      isError.value = true;
    }
  }

  if (isAuthorized.value) {
    await gameStore.initializeProject();
  }

  try {
    if (session_token && tgWebAppStartParam && isAuthorized.value) {
      let { error } = await axiosInstance.post("/rest/v1/rpc/sep_add_referral", {
        invited_chat_id: tgWebAppStartParam,
      });
      if (error) console.error(error);
    }
  } catch (ex) {}

  if (!localStorage.getItem("onboarding_completed") && isAuthorized.value) {
    router.push({ name: "ONBOARDING" });
  }

  axios.post(import.meta.env.VITE_BOT_API + "/api/tonstation/quest", {
    userId: webapp.initDataUnsafe.user?.id,
    type: "DAILY",
    value: 1,
  });

  loading.value = false;
});
</script>

<template>
  <router-view v-if="!loading" v-slot="{ Component }">
    <div class="gameView">
      <transition name="fade" appear>
        <NOT_FOUND_TECH
          v-if="
            TECH_WORK && webapp.initDataUnsafe.user?.id && !TECH_WORK_USERS.includes(webapp.initDataUnsafe.user?.id)
          "
        />
        <div v-else="!TECH_WORK">
          <NOT_FOUND v-if="isError" />
          <div v-else-if="isAuthorized">
            <TonConnectUIProvider :options="options">
              <component :is="Component" />
            </TonConnectUIProvider>
          </div>
        </div>
      </transition>
    </div>
  </router-view>
  <Loader v-else />
</template>
