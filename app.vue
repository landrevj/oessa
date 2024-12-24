<script setup lang="ts">
import { Toaster } from './components/ui/sonner';
</script>

<template>
  <NuxtLayout>
    <NuxtRouteAnnouncer />
    <NuxtPage />
    <Toaster class="pointer-events-auto" rich-colors position="bottom-center" />
  </NuxtLayout>
</template>

<style>
body {
  font-family: 'Public Sans', 'Noto Sans', 'Apple Color Emoji', 'Segoe UI Emoji',
    'Segoe UI Symbol', 'Noto Color Emoji', sans-serif;
}
</style>
