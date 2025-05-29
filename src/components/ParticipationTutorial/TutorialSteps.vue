<script setup>
import { useEventsStore } from "../../stores/events.js";
import { computed, getCurrentInstance, ref, onMounted } from "vue";
import { useTgTheme } from "../../composables/tg_theme.js";
import i18n from "../../i18n.js";

const { proxy } = getCurrentInstance();

const eventsStore = useEventsStore();
const tgTheme = useTgTheme();

const eventPage = computed(() => {
  return eventsStore.eventPage === "events" ? "FarmPAD" : "AirDrop";
});

let steps = ref([]);

onMounted(() => {
  const farmPadItemsEn = ref([
    {
      id: 1,
      title: proxy.$t("participationTutorial.steps.farmPad.step1.title"),
      text: proxy.$t("participationTutorial.steps.farmPad.step1.text"),
      items: [
        { text: proxy.$t("participationTutorial.steps.farmPad.step1.listItems.step1") },
        { text: proxy.$t("participationTutorial.steps.farmPad.step1.listItems.step2") },
        { text: proxy.$t("participationTutorial.steps.farmPad.step1.listItems.step3") },
      ],
    },
    {
      id: 2,
      title: proxy.$t("participationTutorial.steps.farmPad.step2.title"),
      items: [
        { text: proxy.$t("participationTutorial.steps.farmPad.step2.listItems.step1") },
        { text: proxy.$t("participationTutorial.steps.farmPad.step2.listItems.step2") },
      ],
    },
    {
      id: 3,
      title: proxy.$t("participationTutorial.steps.farmPad.step3.title"),
      items: [{ text: proxy.$t("participationTutorial.steps.farmPad.step3.listItems.step1") }],
      innerList: [
        { text: proxy.$t("participationTutorial.steps.farmPad.step3.innerList.step1") },
        { text: proxy.$t("participationTutorial.steps.farmPad.step3.innerList.step2") },
      ],
    },
    {
      id: 4,
      title: proxy.$t("participationTutorial.steps.farmPad.step4.title"),
      items: [{ text: proxy.$t("participationTutorial.steps.farmPad.step4.listItems.step1") }],
    },
  ]);
  const farmPadItemsRu = ref([
    {
      id: 1,
      title: proxy.$t("participationTutorial.steps.farmPad.step1.title"),
      text: proxy.$t("participationTutorial.steps.farmPad.step1.text"),
    },
    {
      id: 2,
      title: proxy.$t("participationTutorial.steps.farmPad.step2.title"),
      text: proxy.$t("participationTutorial.steps.farmPad.step2.text"),
      items: [
        { text: proxy.$t("participationTutorial.steps.farmPad.step2.listItems.step1") },
        { text: proxy.$t("participationTutorial.steps.farmPad.step2.listItems.step2") },
        { text: proxy.$t("participationTutorial.steps.farmPad.step2.listItems.step3") },
      ],
    },
    {
      id: 3,
      title: proxy.$t("participationTutorial.steps.farmPad.step3.title"),
      text: proxy.$t("participationTutorial.steps.farmPad.step3.text"),
    },
    {
      id: 4,
      title: proxy.$t("participationTutorial.steps.farmPad.step4.title"),
      text: proxy.$t("participationTutorial.steps.farmPad.step4.text"),
    },
  ]);
  const AirDropItemsEn = ref([
    {
      id: 1,
      title: proxy.$t("participationTutorial.steps.airDrop.step1.title"),
      items: [
        { text: proxy.$t("participationTutorial.steps.airDrop.step1.listItems.step1") },
        { text: proxy.$t("participationTutorial.steps.airDrop.step1.listItems.step2") },
      ],
    },
    {
      id: 2,
      title: proxy.$t("participationTutorial.steps.airDrop.step2.title"),
      text: proxy.$t("participationTutorial.steps.airDrop.step2.text"),
      text2: proxy.$t("participationTutorial.steps.airDrop.step2.text2"),
      items: [
        { text: proxy.$t("participationTutorial.steps.airDrop.step2.listItems.step1") },
        { text: proxy.$t("participationTutorial.steps.airDrop.step2.listItems.step2") },
        { text: proxy.$t("participationTutorial.steps.airDrop.step2.listItems.step3") },
      ],
      items2: [
        { text: proxy.$t("participationTutorial.steps.airDrop.step2.listItems2.step1") },
        { text: proxy.$t("participationTutorial.steps.airDrop.step2.listItems2.step2") },
      ],
    },
    {
      id: 3,
      title: proxy.$t("participationTutorial.steps.airDrop.step3.title"),
      items: [
        { text: proxy.$t("participationTutorial.steps.airDrop.step3.listItems.step1") },
        { text: proxy.$t("participationTutorial.steps.airDrop.step3.listItems.step2") },
        { text: proxy.$t("participationTutorial.steps.airDrop.step3.listItems.step3") },
      ],
    },
    {
      id: 4,
      title: proxy.$t("participationTutorial.steps.airDrop.step4.title"),
      items: [
        { text: proxy.$t("participationTutorial.steps.airDrop.step4.listItems.step1") },
        { text: proxy.$t("participationTutorial.steps.airDrop.step4.listItems.step2") },
      ],
      innerList: [
        { text: proxy.$t("participationTutorial.steps.airDrop.step4.innerList.step1") },
        { text: proxy.$t("participationTutorial.steps.airDrop.step4.innerList.step2") },
        { text: proxy.$t("participationTutorial.steps.airDrop.step4.innerList.step3") },
      ],
    },
  ]);
  const AirDropItemsRu = ref([
    {
      id: 1,
      title: proxy.$t("participationTutorial.steps.airDrop.step1.title"),
      items: [
        { text: proxy.$t("participationTutorial.steps.airDrop.step1.listItems.step1") },
        { text: proxy.$t("participationTutorial.steps.airDrop.step1.listItems.step2") },
      ],
    },
    {
      id: 2,
      title: proxy.$t("participationTutorial.steps.airDrop.step2.title"),
      text: proxy.$t("participationTutorial.steps.airDrop.step2.text"),
      text2: proxy.$t("participationTutorial.steps.airDrop.step2.text2"),
      items: [
        { text: proxy.$t("participationTutorial.steps.airDrop.step2.listItems.step1") },
        { text: proxy.$t("participationTutorial.steps.airDrop.step2.listItems.step2") },
        { text: proxy.$t("participationTutorial.steps.airDrop.step2.listItems.step3") },
      ],
      items2: [
        { text: proxy.$t("participationTutorial.steps.airDrop.step2.listItems2.step1") },
        { text: proxy.$t("participationTutorial.steps.airDrop.step2.listItems2.step2") },
      ],
    },
    {
      id: 3,
      title: proxy.$t("participationTutorial.steps.airDrop.step3.title"),
      items: [
        { text: proxy.$t("participationTutorial.steps.airDrop.step3.listItems.step1") },
        { text: proxy.$t("participationTutorial.steps.airDrop.step3.listItems.step2") },
        { text: proxy.$t("participationTutorial.steps.airDrop.step3.listItems.step3") },
      ],
    },
    {
      id: 4,
      title: proxy.$t("participationTutorial.steps.airDrop.step4.title"),
      items: [
        { text: proxy.$t("participationTutorial.steps.airDrop.step4.listItems.step1") },
        { text: proxy.$t("participationTutorial.steps.airDrop.step4.listItems.step2") },
      ],
      innerList: [
        { text: proxy.$t("participationTutorial.steps.airDrop.step4.innerList.step1") },
        { text: proxy.$t("participationTutorial.steps.airDrop.step4.innerList.step2") },
        { text: proxy.$t("participationTutorial.steps.airDrop.step4.innerList.step3") },
      ],
    },
  ]);

  if (i18n.global.locale === "en") {
    steps.value = eventPage.value === "FarmPAD" ? farmPadItemsEn.value : AirDropItemsEn.value;

    return;
  }

  steps.value = eventPage.value === "FarmPAD" ? farmPadItemsRu.value : AirDropItemsRu.value;
});
</script>

<template>
  <div class="p-4 bg-secondary_bg_color rounded-[20px]">
    <h2 class="text-[28px] text-center font-[700]">{{ $t("participationTutorial.steps.title") }} {{ eventPage }}</h2>
    <p class="mt-3 text-center">{{ $t("participationTutorial.learnMore") }} {{ eventPage }}</p>

    <div class="mt-8 flex flex-col gap-y-8 width-full">
      <div
        v-for="step in steps"
        :key="step.id"
        :class="['p-4 rounded-[20px] width-full ', tgTheme === 'dark' ? 'bg-gray-900' : 'bg-white']"
      >
        <h3 class="text-base font-bold">{{ step.title }}</h3>

        <p v-html="step.text" class="text-sm" v-if="step.text" />

        <ul v-if="step.items" class="ml-2">
          <li class="tutorial-steps__list-item" v-for="item in step.items" :key="item.text">
            <span>•</span>
            <span v-html="item.text"></span>
          </li>
        </ul>

        <p v-html="step.text2" class="text-sm" v-if="step.text2" />

        <ul v-if="step.items2" class="ml-2">
          <li class="tutorial-steps__list-item" v-for="item in step.items2" :key="item.text">
            <span>•</span>
            <span v-html="item.text"></span>
          </li>
        </ul>

        <ul v-if="step.innerList" class="ml-8">
          <li class="tutorial-steps__list-item" v-for="item in step.innerList" :key="item.text">
            <span>•</span>
            <span v-html="item.text"></span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.tutorial-steps {
  &__list-item {
    display: grid;
    grid-template-columns: 16px 1fr;
  }
}
</style>
