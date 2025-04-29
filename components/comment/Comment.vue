<script setup lang="ts">
import { ref, useI18n } from '#imports';
import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { DateTime } from 'luxon';
import type { InternalApi } from 'nitropack';
import { toTypedSchema } from '@vee-validate/zod';
import { toast } from 'vue-sonner';
import { useForm } from 'vee-validate';

// components
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/shadcn/components/dialog';
import { Button } from '~/shadcn/components/button';
import CommentFormInputs from './CommentFormInputs.vue';
import DialogFooter from '~/shadcn/components/dialog/DialogFooter.vue';
import UserAvatar from '../user/UserAvatar.vue';

// icons
import IcRoundAddReaction from '~icons/ic/round-add-reaction';

// utils
import {
  commentPostBodySchema,
  createComment,
} from '~/utils/api/comments/[id]/comments.post';
import { cn } from '~/shadcn/lib/utils';

// types

const { t } = useI18n();
const { path, comment, rootId } = defineProps<{
  path: (string | null)[];
  comment: InternalApi['/api/comments/:id/comments']['get'][number];
  rootId: string;
}>();
const isReplyDialogOpen = ref(false);

const form = useForm({
  validationSchema: toTypedSchema(commentPostBodySchema),
});

const queryClient = useQueryClient();
const { mutate } = useMutation({
  mutationFn: createComment,
  onSuccess: () => {
    queryClient.invalidateQueries({
      queryKey: ['comments', rootId, 'comments'],
    });
    form.resetForm();
    toast.success(t('resource.comment.reply.success'));
    isReplyDialogOpen.value = false;
  },
  onError: ({ message }) => {
    toast.error(t('resource.comment.reply.error'), { description: message });
  },
});

const handleSubmit = form.handleSubmit((values) =>
  mutate({ id: comment.id, body: values }),
);
</script>

<template>
  <div
    :class="
      cn(
        comment.id === rootId && 'border-l-2 border-blue-600 pl-6',
        'bg-opacity-20 flex flex-col gap-4',
      )
    "
  >
    <div class="flex flex-col gap-2">
      <div class="flex gap-2 items-center">
        <UserAvatar :name="comment.user.name" :image="comment.user.image" />
        <span>{{ comment.user.name }}</span>
        <span
          class="text-black/50 dark:text-white/50"
          :title="
            DateTime.fromISO(comment.createdAt as unknown as string)
              .toLocal()
              .toLocaleString(DateTime.DATETIME_FULL)
          "
        >
          {{
            DateTime.fromISO(
              comment.createdAt as unknown as string,
            ).toRelative()
          }}
        </span>
      </div>
      <p>{{ comment.message }}</p>
      <div
        class="flex flex-row text-opacity-50 text-black dark:text-white dark:text-opacity-50"
      >
        <Button class="text-current/50" variant="ghost" size="icon">
          <IcRoundAddReaction />
        </Button>
        <Dialog v-model:open="isReplyDialogOpen">
          <DialogTrigger as-child>
            <Button
              class="text-current/50"
              variant="ghost"
              @click="() => (isReplyDialogOpen = true)"
            >
              {{ $t('resource.comment.reply.action') }}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <form @submit.prevent="handleSubmit">
              <DialogHeader>
                <DialogTitle>
                  {{ $t('resource.comment.reply.formTitle') }}
                </DialogTitle>
                <DialogDescription>
                  {{ comment.title || comment.message }}
                </DialogDescription>
              </DialogHeader>
              <CommentFormInputs />
              <DialogFooter>
                <Button>{{ $t('common.save') }}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
    <ol
      v-if="comment.comments.length"
      class="flex flex-col gap-6 pl-6 border-l-neutral-500 border-l-2"
    >
      <li
        v-for="reply in comment.comments"
        :key="reply.id as unknown as string"
      >
        <Comment :path="[...path, comment.id]" :comment="reply" :root-id />
      </li>
    </ol>
  </div>
</template>
