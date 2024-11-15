<script setup lang="ts">
const text = defineModel<string>('text');
</script>

<template>
  <div>
    <Textarea v-model="text" placeholder="placeholder ;)" />
    <p class="whitespace-pre-wrap">{{ text }}</p>
  </div>
</template>
