<script setup lang="ts">
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import { toast } from 'vue-sonner';
import { useI18n } from '#imports';

// components
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '~/shadcn/components/tooltip';
import { Button } from '~/shadcn/components/button';

// icons

// utils
import { authClient } from '~/lib/authClient';
import { cn } from '~/shadcn/lib/utils';
import { createReaction } from '~/utils/api/comments/[id]/reactions/index.post';
import { deleteReaction } from '~/utils/api/comments/[id]/reactions/index.delete';
import { readReactions } from '~/utils/api/comments/[id]/reactions/index.get';

// types
import type { InternalApi } from 'nitropack';

const { commentId, reactions } = defineProps<{
  reactions: InternalApi['/api/comments/:id/reactions']['get'];
  commentId: string;
}>();

const { t } = useI18n();
const session = authClient.useSession();

const { data: fetchedReactions } = useQuery({
  queryKey: ['comments', commentId, 'reactions'],
  queryFn: () => readReactions(commentId),
  initialData: reactions,
  staleTime: Infinity,
});

const queryClient = useQueryClient();
const { mutate: mutateCreate } = useMutation({
  mutationFn: createReaction,
  onSuccess: () => {
    queryClient.invalidateQueries({
      queryKey: ['comments', commentId, 'reactions'],
    });
  },
  onError: ({ message }) => {
    toast.error(t('resource.reaction.create.error'), { description: message });
  },
});

const { mutate: mutateDelete } = useMutation({
  mutationFn: deleteReaction,
  onSuccess: () => {
    queryClient.invalidateQueries({
      queryKey: ['comments', commentId, 'reactions'],
    });
  },
  onError: ({ message }) => {
    toast.error(t('resource.reaction.delete.error'), { description: message });
  },
});

const handleClick = (reaction: string, shouldCreateReaction: boolean) => {
  if (shouldCreateReaction) {
    mutateCreate({ id: commentId, body: { reaction } });
  } else {
    mutateDelete({ id: commentId, body: { reaction } });
  }
};
console.log(reactions);
</script>

<template>
  <div v-if="fetchedReactions?.length" class="flex flex-row items-center gap-1">
    <TooltipProvider
      v-for="reaction in fetchedReactions"
      :key="reaction.reaction"
    >
      <Tooltip>
        <TooltipTrigger as-child>
          <Button
            :class="
              cn(
                'flex h-8 flex-row gap-3 rounded-full px-2',
                reaction.didUserReact &&
                  'border-1 border-blue-500! bg-blue-500/20!',
              )
            "
            variant="outline"
            @click="
              () =>
                session?.data &&
                handleClick(reaction.reaction, !reaction.didUserReact)
            "
          >
            <span>{{ reaction.reaction }}</span>
            <span>{{ reaction.count }}</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <span>
            {{ reaction.users.slice(0, 5).join(', ') }}
          </span>
          <span v-if="reaction.users.length > 5">
            {{ `, and ${reaction.users.length - 5} more` }}
          </span>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  </div>
</template>
