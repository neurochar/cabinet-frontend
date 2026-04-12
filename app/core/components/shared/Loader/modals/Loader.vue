<script setup lang="ts">
    defineProps<{ text?: string }>();
</script>

<template>
    <UModal
        :dismissible="false"
        :close-on-esc="false"
        :close="false"
        class="w-auto"
    >
        <template #body>
            <div style="text-align: center">
                <UIcon
                    name="i-lucide-loader-circle"
                    class="size-12 animate-spin"
                />
            </div>
            <div v-if="text">{{ text }}</div>
        </template>
    </UModal>
</template>
