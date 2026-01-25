<script setup lang="ts">
import { type HTMLAttributes, computed } from 'vue';
import {
  SelectScrollDownButton,
  type SelectScrollDownButtonProps,
  useForwardProps,
} from 'reka-ui';
import IcRoundKeyboardArrowDown from '~icons/ic/round-keyboard-arrow-down';
import { cn } from '~/shadcn/lib/utils';

const props = defineProps<
  SelectScrollDownButtonProps & { class?: HTMLAttributes['class'] }
>();

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;

  return delegated;
});

const forwardedProps = useForwardProps(delegatedProps);
</script>

<template>
  <SelectScrollDownButton
    data-slot="select-scroll-down-button"
    v-bind="forwardedProps"
    :class="
      cn('flex cursor-default items-center justify-center py-1', props.class)
    "
  >
    <slot>
      <IcRoundKeyboardArrowDown class="size-4" />
    </slot>
  </SelectScrollDownButton>
</template>
