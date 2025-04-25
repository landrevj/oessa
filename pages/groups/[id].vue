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
import CommentFormInputs from '~/components/comment/CommentFormInputs.vue';
import Thread from '~/components/thread/Thread.vue';
import UserAvatar from '~/components/user/UserAvatar.vue';

// icons

// utils
import {
  createThread,
  threadPostBodySchema,
} from '~/utils/api/commentables/[id]/threads.post';
import { readGroup } from '~/utils/api/groups/[id].get';
import { readThreads } from '~/utils/api/commentables/[id]/threads.get';

// types

definePageMeta({
  title: 'page.group.id.title',
});

const { t } = useI18n();
const {
  params: { id },
} = useRoute();

const { data: group, suspense } = useQuery({
  queryKey: ['groups', id],
  queryFn: () => readGroup({ id: Array.isArray(id) ? id[0] : id }),
});

const { data: threads } = useQuery({
  queryKey: ['groups', id, 'threads'],
  queryFn: () => readThreads({ id: Array.isArray(id) ? id[0] : id }),
});

useHead({
  title: group.value?.name,
});

onServerPrefetch(async () => {
  await suspense();
});

const form = useForm({
  validationSchema: toTypedSchema(threadPostBodySchema),
});

const queryClient = useQueryClient();
const { mutate } = useMutation({
  mutationFn: createThread,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['groups', id, 'threads'] });
    form.resetForm();
  },
  onError: ({ message }) => {
    toast.error(t('resource.thread.create.error'), { description: message });
  },
});

const handleSubmit = form.handleSubmit(
  (values) => group.value && mutate({ id: group.value.id, body: values }),
);
</script>

<template>
  <div v-if="!group">loading</div>
  <div v-else class="container gap-4 flex flex-col">
    <h1>{{ group.name }}</h1>
    <div>
      <ul class="flex gap-1">
        <li v-for="user in group.users" :key="user.id">
          <UserAvatar :name="user.name" :image="user.image" />
        </li>
      </ul>
    </div>
    <Card as-child>
      <form @submit.prevent="handleSubmit">
        <CardHeader>
          <CardTitle>{{ $t('resource.thread.create.formTitle') }}</CardTitle>
        </CardHeader>
        <CardContent class="flex flex-col gap-4">
          <CommentFormInputs />
        </CardContent>
        <CardFooter>
          <Button>{{ $t('common.save') }}</Button>
        </CardFooter>
      </form>
    </Card>
    <ol class="flex flex-col gap-4">
      <li v-for="comment in threads" :key="comment.id">
        <Thread :comment />
      </li>
    </ol>
  </div>
</template>
