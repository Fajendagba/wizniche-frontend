<script setup lang="ts">
const metadataStore = useMetadataStore()

await callOnce(metadataStore.fetchMetadata)
</script>

<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtPage />
  </div>
</template>
