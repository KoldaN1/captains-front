<script setup>
import { ref } from "vue";
import { useEventsStore } from "../../stores/events.js";

const props = defineProps({
  value: {
    type: String,
    default: "events",
    validator: (value) => ["air-drop", "events"].includes(value),
  },
});

const emit = defineEmits(["page-switched"]);

const eventsStore = useEventsStore()

const value = ref(props.value);

function switchPage(page) {
  value.value = page;
  eventsStore.setEventPage(page);
  emit("page-switched", page);
}
</script>

<template>
  <div class="switch">
    <button @click="switchPage('air-drop')" class="switch__btn" :class="{ switch__btn_active: value === 'air-drop' }">
      AirDrop
    </button>
    <button @click="switchPage('events')" class="switch__btn" :class="{ switch__btn_active: value === 'events' }">
      FarmPad
    </button>
  </div>
</template>

<style scoped>
.switch {
  width: 300px;
  height: 36px;
  display: flex;
  justify-content: center;
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.1);
}
.switch__btn {
  flex-grow: 1;
}
.switch__btn_active {
  background-color: #eab308;
}
</style>
