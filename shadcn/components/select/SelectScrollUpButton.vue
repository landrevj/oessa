<script setup lang="ts">
import { type HTMLAttributes, computed } from 'vue';
import {
  SelectScrollUpButton,
  type SelectScrollUpButtonProps,
  useForwardProps,
} from 'reka-ui';
import IcRoundKeyboardArrowUp from '~icons/ic/round-keyboard-arrow-up';
import { cn } from '~/shadcn/lib/utils';

const props = defineProps<
  SelectScrollUpButtonProps & { class?: HTMLAttributes['class'] }
>();

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;

  return delegated;
});

const forwardedProps = useForwardProps(delegatedProps);
</script>

<template>
  <SelectScrollUpButton
    data-slot="select-scroll-up-button"
    v-bind="forwardedProps"
    :class="
      cn('flex cursor-default items-center justify-center py-1', props.class)
    "
  >
    <slot>
      <IcRoundKeyboardArrowUp class="size-4" />
    </slot>
  </SelectScrollUpButton>
</template>
