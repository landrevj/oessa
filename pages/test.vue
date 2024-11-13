<script setup lang="ts">
const text = defineModel<string>('asdfasdf');
</script>

<template>
  <div>
    <Textarea v-model="text" />
    <p class="whitespace-pre-wrap">{{ text }}</p>
  </div>
</template>
