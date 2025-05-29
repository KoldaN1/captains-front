<script setup>
import formatNumber from "../../utils/formatNumber";
import { ref, watch, computed } from "vue";
import ButtonEvent from "../ButtonEvent/ButtonEvent.vue";
import ButtonTutorial from "../ButtonTutorial/ButtonTutorial.vue";
import { useRoute, useRouter } from "vue-router";
import axiosInstance from "../../utils/axiosInstance.js";
import bomb from "../../assets/bomb.svg";
import trunk from "../../assets/trunk.svg";
import addCircle from "../../assets/add-circle.svg";
import { useEventsStore } from "../../stores/events.js";

const props = defineProps({
  eventData: Object,
  userData: Object,
  partner_coins: Number,
});

const router = useRouter();
const eventsStore = useEventsStore();
const animatedPartnerCoins = ref(props.partner_coins);
// const webapp = window.Telegram.WebApp;

const animateCount = (start, end, duration, updateCallback, completeCallback) => {
  const startTime = performance.now();
  const animate = (currentTime) => {
    const elapsedTime = currentTime - startTime;
    const progress = Math.min(elapsedTime / duration, 1);
    updateCallback(Math.floor(start + (end - start) * progress));
    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      completeCallback();
    }
  };
  requestAnimationFrame(animate);
};

const setupAnimation = (propRef, propName) => {
  watch(
    () => props[propName],
    (newVal, oldVal) => {
      animateCount(
        oldVal,
        newVal,
        500,
        (value) => {
          propRef.value = value;
        },
        () => {
          propRef.value = newVal;
        },
      );
    },
  );
};
setupAnimation(animatedPartnerCoins, "partner_coins");
const route = useRoute();

const eventDataFull = ref(null);
axiosInstance
  .get("/rest/v1/events", {
    params: {
      id: `eq.${route.params.id}`,
      is_active: "eq.true",
    },
  })
  .then((resp) => {
    eventDataFull.value = resp.data[0];
  });

// const isAppleDevice = computed(() => {
//   return /(Macintosh|iPhone|iPod|iPad)/i.test(navigator.userAgent);
// });

function addToCalendar() {
  if (!eventDataFull.value) {
    console.error("Event data is not loaded!");
    return;
  }

  const eventDetails = {
    title: props.eventData.partner,
    start: eventDataFull.value.start_date,
    end: props.eventData.end_date,
    location: "Captains Bay",
    description: "",
  };

  // if (isAppleDevice.value) {
  //   generateICS(eventDetails);
  // } else {
  openGoogleCalendar(eventDetails);
  // }
}

function openGoogleCalendar(event) {
  const formatGoogleDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  };

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    dates: `${formatGoogleDate(event.start)}/${formatGoogleDate(event.end)}`,
    details: event.description,
    location: event.location,
  });

  window.open(`https://www.google.com/calendar/render?${params}`, "_blank");
}

// function generateICS(event) {
//   try {
//     webapp.downloadFile({
//       url: `https://api.captainsbay.xyz/storage/v1/object/public/assets/eventscal/${eventDataFull.value.id}.ics`,
//       file_name: `event.ics`,
//     });
//   } catch (error) {
//     const formatDate = (dateString) => {
//       return new Date(dateString)
//         .toISOString()
//         .replace(/[-:]/g, "")
//         .replace(/\.\d+Z/, "Z");
//     };

//     const icsContent = `
// BEGIN:VCALENDAR
// VERSION:2.0
// PRODID:-//Event//EN
// BEGIN:VEVENT
// UID:${Date.now()}@myapp.com
// SUMMARY:${event.title}
// DTSTART:${formatDate(event.start)}
// DTEND:${formatDate(event.end)}
// LOCATION:${event.location}
// DESCRIPTION:${event.description}
// END:VEVENT
// END:VCALENDAR
// `
//       .trim()
//       .replace(/\n/g, "\r\n");

//     const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
//     const url = URL.createObjectURL(blob);

//     const link = document.createElement("a");
//     link.href = url;
//     link.download = "event.ics";
//     document.body.appendChild(link);
//     link.click();
//     URL.revokeObjectURL(url);
//     document.body.removeChild(link);
//   }
// }

function goToInstruction() {
  if (eventsStore.eventPage === "events") {
    router.push({ name: "PARTICIPATION_TUTORIAL_EVENTS" });

    return;
  }

  router.push({ name: "PARTICIPATION_TUTORIAL_AIRDROP" });
}
</script>

<template>
  <div class="bg-secondary_bg_color p-4 rounded-3xl counters" v-if="eventDataFull">
    <div class="flex">
      <div class="w-[80px] h-[80px]">
        <img :src="eventData.partner_logo" alt="partner-logo" class="partner-logo" />
      </div>
      <div class="ml-4 w-full">
        <h2>{{ eventData.partner }}</h2>
        <p class="description">
          {{
            $i18n.locale === "ru"
              ? JSON.parse(eventDataFull.description)?.ru
              : JSON.parse(eventDataFull.description)?.en
          }}
        </p>
        <div class="flex align-center mt-4 justify-end w-full">
          <ButtonEvent :text="$t('setTimer')" :img-url="bomb" @click="addToCalendar" />
          <div
            class="partner-coins-indicatior p-2 font-[700] border-b-[2px] border-white rounded-[8px] flex items-center justify-center button-event ml-2"
          >
            {{ userData ? formatNumber(animatedPartnerCoins) : "Load..." }}
            <img :src="trunk" alt="trunk" class="ml-2" />
          </div>
        </div>
      </div>
    </div>
    <div>
      <ButtonTutorial
        :text="$t('event_instruction_title')"
        background="#100000"
        text-color="white"
        :img-url="addCircle"
        class="mt-4"
        @click="goToInstruction"
      />
    </div>
  </div>
</template>

<style scoped>
.counters {
  color: white;
}
.partner-logo {
  border-radius: 12px;
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  overflow: hidden;
}

.description {
  max-width: 90%;
  margin-top: 5px;
  color: grey;
  font-size: 16px;
}

.partner-coins-indicatior {
  background-color: #0f0f0f;
}
</style>
