<script setup lang="ts">
import { definePageMeta, useI18n } from '#imports';
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import { toTypedSchema } from '@vee-validate/zod';
import { toast } from 'vue-sonner';
import { useForm } from 'vee-validate';

// components
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/shadcn/components/card';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '~/shadcn/components/select';
import { Button } from '~/shadcn/components/button';
import GroupCard from '~/components/group/GroupCard.vue';
import GroupFormInputs from '~/components/group/GroupFormInputs.vue';
import UserAvatar from '~/components/user/UserAvatar.vue';

// utils
import {
  createGroup,
  groupsPostBodySchema,
} from '~/utils/api/groups/index.post';
import { authClient } from '~/lib/authClient';
import { readGroups } from '~/utils/api/groups/index.get';

definePageMeta({
  title: 'pages.index.title',
});

const { t } = useI18n();
const session = authClient.useSession();

const { data } = useQuery({
  queryKey: ['groups'],
  queryFn: readGroups,
});

const createGroupForm = useForm({
  validationSchema: toTypedSchema(groupsPostBodySchema),
  initialValues: {
    users: [],
  },
});

const queryClient = useQueryClient();
const { isPending, mutate } = useMutation({
  mutationFn: createGroup,
  onSuccess: (_, variables) => {
    createGroupForm.resetForm();
    toast.success(t('resource.group.create.success', variables));
    queryClient.invalidateQueries({ queryKey: ['groups'] });
  },
  onError: ({ message }) => {
    toast.error(t('resource.group.create.error'), {
      description: message,
    });
  },
});

const handleSubmit = createGroupForm.handleSubmit((values) =>
  mutate({ body: values }),
);
</script>

<template>
  <div v-if="!session?.data">
    <Button href="/sign-in" as="a">
      {{ $t('auth.signIn') }}
    </Button>
    <Button href="/sign-up" as="a">
      {{ $t('auth.signUp') }}
    </Button>
  </div>
  <div v-else class="container mx-auto gap-4 flex flex-col">
    <Card class="flex flex-row items-center gap-2 p-2">
      <UserAvatar
        :name="session.data.user.name"
        :image="session.data.user.image"
      />
      {{ session?.data?.user.name }}
      <div class="flex-grow" />
      <Select v-model="$colorMode.preference">
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="system">System</SelectItem>
          <SelectItem value="light">Light</SelectItem>
          <SelectItem value="dark">Dark</SelectItem>
        </SelectContent>
      </Select>
      <Button @click="authClient.signOut()">
        {{ $t('auth.signOut') }}
      </Button>
    </Card>
    <Card>
      <form @submit.prevent="handleSubmit">
        <CardHeader>
          <CardTitle>{{ $t('resource.group.create.formTitle') }}</CardTitle>
        </CardHeader>
        <CardContent class="flex flex-col gap-4">
          <GroupFormInputs />
        </CardContent>
        <CardFooter>
          <Button type="submit" :disabled="isPending">
            {{ $t('common.save') }}
          </Button>
        </CardFooter>
      </form>
    </Card>
    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      <GroupCard v-for="group in data" :key="group.id" :group />
    </div>
  </div>
</template>
