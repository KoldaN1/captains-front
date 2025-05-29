<script setup>
import EventCard from "./EventCard.vue";

const props = defineProps({
  events: {
    type: Object,
    required: true,
    validate: (array) => Array.isArray(array),
  },
  caption: {
    type: String,
    required: true,
  },
  background: {
    type: String,
    default: null,
  },
  buttonColor: {
    type: String,
  },
  iconPath: {
    type: String
  }
});
</script>

<template>
  <div class="events-list">
    <div class="events-list__heading"><slot name="heading"></slot></div>
    <div class="events-list__content" :class="background ? background : ''">
      <h2 class="events-list__caption">{{ caption }}</h2>
      <ul class="events-list__list">
        <li v-for="event in events" :key="event.id">
          <EventCard
            :id="event.id"
            :name="event.partner"
            :event-logo-url="event.partner_logo"
            :claim-cost="event.claim_cost"
            :start-date-string="event.start_date"
            :finish-date-string="event.end_date"
            :button-color="buttonColor"
            :icon-path="iconPath"
          />
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.events-list__content {
  padding: 15px;
  min-height: 250px;
  background-color: rgba(0, 0, 0, 0.15);
}

.events-list__list {
  display: flex;
  max-width: 100%;
  overflow: auto;
  gap: 16px;
}

.events-list__heading {
  margin-left: 15px;
  margin-bottom: 10px;
}

.events-list__caption {
  text-align: center;
  font-weight: 700;
  font-size: 20px;
  margin-bottom: 25px;
}
</style>
