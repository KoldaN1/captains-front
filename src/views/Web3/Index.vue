<script setup>

  import Heading from '../../components/Other/Heading.vue'
  import List from '../../components/Web3/List.vue'
  import Navigator from '../../components/Navigator/Navigator.vue'
  import Collection from '../../components/Web3/Collection.vue'

</script>

<template>
  <div>
    <main class="flex flex-col gap-y-6 pt-6 pb-[102px]">
        <Heading 
          :title="$t('inventory_title')"
          :description="$t('inventory_description')"
          class="px-4"
        />

        <Collection />
        
        <List 
          class="px-4"
        />
    </main>

    <Navigator
      :page="'WEB3'"
    />
  </div>
</template>
