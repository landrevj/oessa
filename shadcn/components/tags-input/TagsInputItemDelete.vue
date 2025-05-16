<script setup lang="ts">
import { type HTMLAttributes, computed } from 'vue';
import {
  TagsInputItemDelete,
  type TagsInputItemDeleteProps,
  useForwardProps,
} from 'reka-ui';
import IcRoundClose from '~icons/ic/round-close';
import { cn } from '~/shadcn/lib/utils';

const props = defineProps<
  TagsInputItemDeleteProps & { class?: HTMLAttributes['class'] }
>();

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;

  return delegated;
});

const forwardedProps = useForwardProps(delegatedProps);
</script>

<template>
  <TagsInputItemDelete
    v-bind="forwardedProps"
    :class="cn('mr-1 flex rounded bg-transparent', props.class)"
  >
    <slot>
      <IcRoundClose class="h-4 w-4" />
    </slot>
  </TagsInputItemDelete>
</template>
