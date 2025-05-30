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
        "user=%7B%22id%22%3A6872359615%2C%22first_name%22%3A%22artix%22%2C%22last_name%22%3A%22%22%2C%22username%22%3A%22ar_artix%22%2C%22language_code%22%3A%22ru%22%2C%22allows_write_to_pm%22%3Atrue%2C%22photo_url%22%3A%22https%3A%5C%2F%5C%2Ft.me%5C%2Fi%5C%2Fuserpic%5C%2F320%5C%2Fh7Avqul0byfBxaIRy3MIzy5jLZIl0jIsHoFE5yMy-qxhBef95zDD1rMoDxHD-D9H.svg%22%7D&chat_instance=-1124625323709849748&chat_type=sender&auth_date=1748596247&signature=TRTozvv6yUa_F3tqN8KDWD187BoOYZuLD7Zn88zQysIKAIrRsdU33w_CEMtQjQWW9BquTAL1IFmpUYrP5dhnBg&hash=4dd598ebb33e684d86d0ef4d69f394d003a38a383677a9649fb2e7b17626d0b5",
      initDataUnsafe: {
        user: {
          id: 6872359615,
          first_name: "artix",
          last_name: "",
          username: "ar_artix",
          language_code: "ru",
          allows_write_to_pm: true,
          photo_url: "https://t.me/i/userpic/320/h7Avqul0byfBxaIRy3MIzy5jLZIl0jIsHoFE5yMy-qxhBef95zDD1rMoDxHD-D9H.svg",
        },
        chat_instance: "-1124625323709849748",
        chat_type: "sender",
        auth_date: "1748596247",
        signature: "TRTozvv6yUa_F3tqN8KDWD187BoOYZuLD7Zn88zQysIKAIrRsdU33w_CEMtQjQWW9BquTAL1IFmpUYrP5dhnBg",
        hash: "4dd598ebb33e684d86d0ef4d69f394d003a38a383677a9649fb2e7b17626d0b5",
      },
      version: "9.0",
      platform: "tdesktop",
      colorScheme: "dark",
      themeParams: {
        accent_text_color: "#a4c2e9",
        bg_color: "#191c21",
        bottom_bar_bg_color: "#191c21",
        button_color: "#697b97",
        button_text_color: "#ffffff",
        destructive_text_color: "#ec3942",
        header_bg_color: "#191c21",
        hint_color: "#666d77",
        link_color: "#a4c2ea",
        secondary_bg_color: "#24272e",
        section_bg_color: "#191c21",
        section_header_text_color: "#a4c2ea",
        section_separator_color: "#131519",
        subtitle_text_color: "#666d77",
        text_color: "#f5f5f5",
      },
      isExpanded: true,
      viewportHeight: 590,
      viewportStableHeight: 590,
      safeAreaInset: {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
      },
      contentSafeAreaInset: {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
      },
      isClosingConfirmationEnabled: false,
      isVerticalSwipesEnabled: false,
      isFullscreen: false,
      isOrientationLocked: false,
      isActive: true,
      headerColor: "#191c21",
      backgroundColor: "#191c21",
      bottomBarColor: "#191c21",
      BackButton: {
        isVisible: false,
      },
      MainButton: {
        type: "main",
        text: "Continue",
        color: "#697b97",
        textColor: "#ffffff",
        isVisible: false,
        isProgressVisible: false,
        isActive: true,
        hasShineEffect: false,
      },
      SecondaryButton: {
        type: "secondary",
        text: "Cancel",
        color: "#191c21",
        textColor: "#697b97",
        isVisible: false,
        isProgressVisible: false,
        isActive: true,
        hasShineEffect: false,
        position: "left",
      },
      SettingsButton: {
        isVisible: false,
      },
      HapticFeedback: {},
      CloudStorage: {},
      DeviceStorage: {},
      SecureStorage: {},
      BiometricManager: {
        isInited: false,
        isBiometricAvailable: false,
        biometricType: "unknown",
        isAccessRequested: false,
        isAccessGranted: false,
        isBiometricTokenSaved: false,
        deviceId: "",
      },
      Accelerometer: {
        isStarted: false,
        x: null,
        y: null,
        z: null,
      },
      DeviceOrientation: {
        isStarted: false,
        absolute: false,
        alpha: null,
        beta: null,
        gamma: null,
      },
      Gyroscope: {
        isStarted: false,
        x: null,
        y: null,
        z: null,
      },
      LocationManager: {
        isInited: false,
        isLocationAvailable: false,
        isAccessRequested: false,
        isAccessGranted: false,
      },
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

  webapp.ready?.();

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
