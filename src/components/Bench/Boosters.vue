<script setup>

    import { ref, onMounted } from 'vue'

    const props = defineProps({
        crew_members: Array
    })

    const coins = ref(0);
    const mining_time = ref(0);
    const time_reductions = ref(0);

    onMounted(() => {
        props.crew_members.forEach(member => {
            if (member.type === 'fren') {
                switch (member.rare) {
                    case 'plain':
                        coins.value += 5;
                        break;
                    case 'scarce':
                        coins.value += 10;
                        break;
                    case 'epic':
                        coins.value += 15;
                        break;
                }
            } else if (member.type === 'nft') {
                member.metadata.attributes.slice(2).forEach(attr => {
                    const valueString = attr.value;
                    const match = valueString.match(/(\d+(\.\d+)?)/);
                    if (match) {
                        const value = parseFloat(match[0]);
                        if (!isNaN(value)) {
                            if (valueString.includes('passive income')) {
                                coins.value += value;
                            } else if (valueString.includes('refresh')) {
                                time_reductions.value += value;
                            } else if (valueString.includes('income generation')) {
                                mining_time.value += value;
                            }
                        }
                    }
                });
            }
        });
    })

</script>

<template>
    <div class="flex flex-col gap-y-2 px-4 text-sm">
        <span class="font-medium">{{ $t('crew_bonus') }}</span>

        <div class="flex gap-x-2">
            <span class="flex gap-x-1 items-center">
                <span class="flex justify-center items-center aspect-square">
                    <img src="../../assets/boosters.svg" class="w-6" />
                </span>
                <span class="font-bold">+{{ coins }}%</span>
            </span>

            <span class="flex gap-x-1 items-center">
                <span class="flex justify-center items-center aspect-square">
                    <img src="../../assets/mining_time.svg" class="w-6" />
                </span>
                <span class="font-bold">+{{ mining_time }} {{ mining_time <= 24 ? 'hour' : 'min' }}</span>
            </span>

            <span class="flex gap-x-1 items-center">
                <span class="flex justify-center items-center aspect-square">
                    <img src="../../assets/time_remaining.svg" class="w-6" />
                </span>
                <span class="font-bold">+{{ time_reductions }}%</span>
            </span>
        </div>
    </div>
</template>