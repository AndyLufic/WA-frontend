<template>
  <div class="map-page">
    <ScooterMap />
  </div>
</template>

<script>
import ScooterMap from '@/components/ScooterMap.vue';
export default { components: { ScooterMap } };
</script>

<style>
/* allow the map to fill the page area */
.map-page { height: 100%; }
</style>
