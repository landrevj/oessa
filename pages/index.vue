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
  <div>
    <Button href="/test" as="a">Go to test</Button>
    <Button v-if="!session?.data" href="/sign-in" as="a">
      {{ $t('auth.signIn') }}
    </Button>
    <Button v-if="!session?.data" href="/sign-up" as="a">
      {{ $t('auth.signUp') }}
    </Button>
    <Button v-else @click="authClient.signOut()">
      {{ $t('auth.signOut') }}
    </Button>
    <select v-model="$colorMode.preference">
      <option value="system">System</option>
      <option value="light">Light</option>
      <option value="dark">Dark</option>
    </select>
    <div v-if="session?.data" class="container gap-4 flex flex-col">
      <Card class="flex flex-row items-center gap-2 p-2">
        <UserAvatar
          :name="session.data.user.name"
          :image="session.data.user.image"
        />
        {{ session?.data?.user.name }}
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
  </div>
</template>
