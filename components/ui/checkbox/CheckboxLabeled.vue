<script setup lang="ts">
import { Checkbox } from '~/shadcn/components/checkbox';
import type { CheckboxRootProps } from 'radix-vue';
import { Label } from '~/shadcn/components/label';

defineProps<CheckboxRootProps>();
defineOptions({
  inheritAttrs: false,
});
</script>

<template>
  <div class="flex items-center gap-2">
    <Checkbox :id v-bind="$attrs" />
    <Label :for="id">
      <slot />
    </Label>
  </div>
</template>
