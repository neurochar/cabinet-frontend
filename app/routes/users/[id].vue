<script setup lang="ts">
    const route = useRoute();
    const rawId = route.params.id as string;
</script>
<template><LazyPageUsersEdit :id="rawId" /></template>
