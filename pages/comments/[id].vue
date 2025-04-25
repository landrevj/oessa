<script setup lang="ts">
import { definePageMeta, onServerPrefetch, useHead, useI18n } from '#imports';
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import { toTypedSchema } from '@vee-validate/zod';
import { toast } from 'vue-sonner';
import { useForm } from 'vee-validate';
import { useRoute } from 'vue-router';

// components
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import Comment from '~/components/comment/Comment.vue';
import CommentFormInputs from '~/components/comment/CommentFormInputs.vue';

// icons

// utils
import {
  commentPostBodySchema,
  createComment,
} from '~/utils/api/comments/[id]/comments.post';
import { readComment } from '~/utils/api/comments/[id]/index.get';
import { readCommentComments } from '~/utils/api/comments/[id]/comments.get';

// types

definePageMeta({
  title: 'page.group.id.title',
});

const { t } = useI18n();
const {
  params: { id },
} = useRoute();

const { data: comment, suspense } = useQuery({
  queryKey: ['groups', id, 'comments'],
  queryFn: () => readComment({ id: Array.isArray(id) ? id[0] : id }),
});

const { data: commentComments } = useQuery({
  enabled: !!comment.value?.id,
  queryKey: ['comments', comment.value?.id, 'comments'],
  queryFn: () =>
    comment.value ? readCommentComments({ id: comment.value.id }) : [],
});

useHead({
  title: comment.value?.title,
});

onServerPrefetch(async () => {
  await suspense();
});

const form = useForm({
  validationSchema: toTypedSchema(commentPostBodySchema),
});

const queryClient = useQueryClient();
const { mutate } = useMutation({
  mutationFn: createComment,
  onSuccess: (response) => {
    console.log(response);
    queryClient.invalidateQueries({
      queryKey: ['comments', comment.value?.id, 'comments'],
    });
    form.resetForm();
    toast.success(t('resource.comment.reply.success'));
    // isReplyDialogOpen.value = false;
  },
  onError: ({ message }) => {
    toast.error(t('resource.comment.reply.error'), { description: message });
  },
});

const handleSubmit = form.handleSubmit(
  (values) => comment.value && mutate({ id: comment.value.id, body: values }),
);
</script>

<template>
  <div v-if="!comment">loading</div>
  <div v-else class="container gap-4 flex flex-col">
    <!-- <Comment :comment /> -->

    <div class="flex flex-col gap-4">
      <Comment
        v-for="reply in commentComments"
        :key="reply.id"
        :comment="reply"
        :root-id="comment.id"
      />
    </div>
    <Card as-child>
      <form @submit.prevent="handleSubmit">
        <CardHeader>
          <CardTitle>{{ $t('resource.comment.create.formTitle') }}</CardTitle>
        </CardHeader>
        <CardContent class="flex flex-col gap-4">
          <CommentFormInputs />
        </CardContent>
        <CardFooter>
          <Button type="submit">{{ $t('common.save') }}</Button>
        </CardFooter>
      </form>
    </Card>
  </div>
</template>
