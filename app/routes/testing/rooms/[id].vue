<script setup lang="ts">
    const route = useRoute();
    const rawId = route.params.id as string;
    const id = String(rawId);
</script>
<template><LazyTestingPageRoomEdit :id="id" /></template>
