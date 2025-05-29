<script setup>
    import { Icon } from '@iconify/vue'

    defineProps({
        league: Number
    })
</script>

<template>
    <div class="space-y-4">
      <!-- Swabbie's League -->
      <span v-if="league <= 1" class="flex items-center text-blue-500 font-semibold ">
        <Icon icon="bi:emoji-smile" class=" mr-1"></Icon>
        Swabbie's League
      </span>
  
      <!-- Deckhand's League -->
      <span v-if="league === 2" class="flex items-center text-green-500 font-semibold ">
        <Icon icon="mdi:sail-boat" class=" mr-1"></Icon>
        Deckhand's League
      </span>
  
      <!-- Seafarer's League -->
      <span v-if="league === 3" class="flex items-center text-teal-500 font-semibold ">
        <Icon icon="mdi:anchor" class=" mr-1"></Icon>
        Seafarer's League
      </span>
  
      <!-- Buccaneer's League -->
      <span v-if="league === 4" class="flex items-center text-yellow-500 font-semibold ">
        <Icon icon="mdi:treasure-chest" class=" mr-1"></Icon>
        Buccaneer's League
      </span>
  
      <!-- Corsair's League -->
      <span v-if="league === 5" class="flex items-center text-orange-500 font-semibold">
        <Icon icon="mdi:sword-cross" class=" mr-1"></Icon>
        Corsair's League
      </span>
  
      <!-- Marauder's League -->
      <span v-if="league === 6" class="flex items-center text-red-500 font-semibold ">
        <Icon icon="mdi:skull-crossbones" class=" mr-1"></Icon>
        Marauder's League
      </span>
  
      <!-- Quartermaster's League -->
      <span v-if="league === 7" class="flex items-center text-purple-500 font-semibold ">
        <Icon icon="mdi:map-marker-path" class=" mr-1"></Icon>
        Quartermaster's League
      </span>
  
      <!-- Captain's League -->
      <span v-if="league === 8" class="flex items-center text-pink-500 font-semibold ">
        <Icon icon="mdi:pirate" class=" mr-1"></Icon>
        Captain's League
      </span>
  
      <!-- Admiral's League -->
      <span v-if="league === 9" class="flex items-center text-indigo-500 font-semibold ">
        <Icon icon="mdi:compass-rose" class=" mr-1"></Icon>
        Admiral's League
      </span>
  
      <!-- Pirate King's League -->
      <span v-if="league >= 10" class="flex items-center text-gray-900 font-semibold  bg-yellow-300 p-2 rounded">
        <Icon icon="mdi:crown" class=" mr-1"></Icon>
        Pirate King's League
      </span>
    </div>
</template>