<script setup>

const nftImages = [
  'https://api.captainsbay.xyz/storage/v1/object/public/NFTs/epic/Captain.png?t=2024-09-09T12%3A04%3A38.887Z',
  'https://api.captainsbay.xyz/storage/v1/object/public/NFTs/scarce/Achor.png?t=2024-09-09T12%3A05%3A14.213Z',
  'https://api.captainsbay.xyz/storage/v1/object/public/NFTs/epic/CaptainsTable.png?t=2024-09-09T12%3A04%3A46.635Z',
  'https://api.captainsbay.xyz/storage/v1/object/public/NFTs/epic/Chest.png?t=2024-09-09T12%3A05%3A40.673Z',
  'https://api.captainsbay.xyz/storage/v1/object/public/NFTs/scarce/Astrolabe.png?t=2024-09-09T12%3A06%3A11.388Z',
  'https://api.captainsbay.xyz/storage/v1/object/public/NFTs/epic/DiamondSword.png?t=2024-09-09T12%3A05%3A50.480Z',
  'https://api.captainsbay.xyz/storage/v1/object/public/NFTs/plain/Boatswain.png?t=2024-09-09T12%3A05%3A01.033Z',
  'https://api.captainsbay.xyz/storage/v1/object/public/NFTs/scarce/Cauldron.png?t=2024-09-09T12%3A06%3A19.859Z',
  'https://api.captainsbay.xyz/storage/v1/object/public/NFTs/epic/Heart.png?t=2024-09-09T12%3A05%3A56.785Z',
  'https://api.captainsbay.xyz/storage/v1/object/public/NFTs/plain/CabinBoy.png?t=2024-09-09T12%3A05%3A07.042Z',
  'https://api.captainsbay.xyz/storage/v1/object/public/NFTs/scarce/Chef.png?t=2024-09-09T12%3A06%3A26.930Z',
  'https://api.captainsbay.xyz/storage/v1/object/public/NFTs/scarce/Flag.png?t=2024-09-09T12%3A06%3A33.883Z',
  'https://api.captainsbay.xyz/storage/v1/object/public/NFTs/epic/MasterGunner.png?t=2024-09-09T12%3A06%3A03.201Z'
]

</script>

<template>
    <div class="flex flex-col items-center gap-y-2 bg-secondary_bg_color pb-4">
        <h2 class="text-xl font-bold text-center p-4">Get your NFT!<br />Yo-Ho-Ho and a Chest Full of NFTs</h2>
        
        <div class="w-full overflow-hidden">
        <div class="flex animate-carousel gap-x-2">
            <img v-for="(nft, index) in nftImages" :key="index" :src="nft" class="w-20 h-20 rounded-2xl object-cover" :alt="`NFT ${index + 1}`">
            <img v-for="(nft, index) in nftImages" :key="`duplicate-${index}`" :src="nft" class="w-20 h-20 rounded-2xl object-cover" :alt="`NFT ${index + 1}`">
        </div>
        </div>
        
        <a href="https://getgems.io/collection/EQBwTEjlCCJzAX-sS4lawB1xLBv6Dg-yO95Qb8Jvn5YLNWHn#items" target="_blank" class="px-6 mt-4 h-[40px] bg-button_color flex justify-center items-center border-r-2 border-b-2 border-text_color font-medium text-white rounded-full transform transition-all duration-200 active:opacity-75">
            {{ $t('open_gg') }}
        </a>
    </div>
</template>

<style scoped>
@keyframes carousel {
  0% { transform: translateX(0); }
  100% { transform: translateX(calc(-50% - 1rem)); }
}

.animate-carousel {
  animation: carousel 20s linear infinite;
  width: calc(200% + 2rem);
}

</style>