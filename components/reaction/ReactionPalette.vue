<script setup lang="ts">
import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { ref } from 'vue';
import { toast } from 'vue-sonner';
import { useI18n } from '#imports';

// components
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '~/shadcn/components/popover';
import { Button } from '~/shadcn/components/button';

// icons

// utils
import { createReaction } from '~/utils/api/comments/[id]/reactions/index.post';

// types

const { t } = useI18n();
const { commentId } = defineProps<{ commentId: string }>();
const isPaletteOpen = ref(false);

const queryClient = useQueryClient();
const { mutate } = useMutation({
  mutationFn: createReaction,
  onSuccess: () => {
    queryClient.invalidateQueries({
      queryKey: ['comments', commentId, 'reactions'],
    });
    isPaletteOpen.value = false;
  },
  onError: ({ message }) => {
    toast.error(t('resource.reaction.create.error'), { description: message });
  },
});
</script>

<template>
  <Popover v-model:open="isPaletteOpen">
    <PopoverTrigger as-child>
      <slot />
    </PopoverTrigger>
    <PopoverContent class="w-auto p-1">
      <Button
        v-for="emoji in ['👍', '❤️', '😆', '😮', '😢', '😡']"
        :key="emoji"
        variant="ghost"
        class="p-2 text-xl"
        @click="() => mutate({ id: commentId, body: { reaction: emoji } })"
      >
        {{ emoji }}
      </Button>
    </PopoverContent>
  </Popover>
</template>
