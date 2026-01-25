<script setup lang="ts">
import { type HTMLAttributes, computed } from 'vue';
import {
  TagsInputItemText,
  type TagsInputItemTextProps,
  useForwardProps,
} from 'reka-ui';
import { cn } from '~/shadcn/lib/utils';

const props = defineProps<
  TagsInputItemTextProps & { class?: HTMLAttributes['class'] }
>();

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;

  return delegated;
});

const forwardedProps = useForwardProps(delegatedProps);
</script>

<template>
  <TagsInputItemText
    v-bind="forwardedProps"
    :class="cn('rounded bg-transparent px-2 py-0.5 text-sm', props.class)"
  />
</template>
