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
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import GroupFormInputs from './GroupFormInputs.vue';
import UserAvatar from '~/components/user/UserAvatar.vue';

// icons
import IcBaselineDelete from '~icons/ic/baseline-delete';
import IcRoundClose from '~icons/ic/round-close';
import IcRoundEdit from '~icons/ic/round-edit';
import IcRoundSave from '~icons/ic/round-save';

// utils
import {
  groupsPatchBodySchema,
  updateGroup,
} from '~/utils/api/groups/[id].patch';
import { deleteGroup } from '~/utils/api/groups/[id].delete';

// types

const queryClient = useQueryClient();
const { t } = useI18n();

const isEditing = ref(false);

const { group } = defineProps<{
  group: InternalApi['/api/groups']['get'][number];
}>();
const { mutate } = useMutation({
  mutationFn: updateGroup,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['groups'] });
    isEditing.value = false;
  },
  onError: ({ message }) => {
    toast.error(t('resources.groups.update.error'), { description: message });
  },
});

const form = useForm({
  validationSchema: toTypedSchema(groupsPatchBodySchema),
  initialValues: group,
});

const handleSubmit = form.handleSubmit((values) =>
  mutate({ id: group.id, body: values }),
);

const handleEdit = () => {
  isEditing.value = true;
  form.setValues(group);
};

const { mutate: deleteGroupMutation } = useMutation({
  mutationFn: deleteGroup,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['groups'] });
  },
  onError: ({ message }) => {
    toast.error(t('resources.groups.delete.error'), { description: message });
  },
});
</script>

<template>
  <Card v-if="!isEditing">
    <CardHeader>
      <CardTitle>{{ group.name }}</CardTitle>
    </CardHeader>
    <CardContent>
      <ul>
        <li>
          <ul class="flex gap-1">
            <li v-for="user in group.users" :key="user.id">
              <UserAvatar :name="user.name" :image="user.image" />
            </li>
          </ul>
        </li>
        <li>{{ group.id }}</li>
        <li>{{ DateTime.fromISO(group.createdAt).toRelative() }}</li>
        <li>{{ DateTime.fromISO(group.updatedAt).toRelative() }}</li>
        <li>{{ group.image }}</li>
      </ul>
    </CardContent>
    <CardFooter>
      <Button variant="outline" size="icon" @click="handleEdit">
        <IcRoundEdit />
      </Button>
      <Button
        variant="destructive"
        size="icon"
        @click="() => deleteGroupMutation({ id: group.id })"
      >
        <IcBaselineDelete />
      </Button>
    </CardFooter>
  </Card>
  <Card v-else>
    <form class="contents" @submit.prevent="handleSubmit">
      <CardHeader>
        <CardTitle>{{ $t('resources.groups.update.formTitle') }}</CardTitle>
      </CardHeader>
      <CardContent>
        <GroupFormInputs />
      </CardContent>
      <CardFooter>
        <Button type="submit" size="icon">
          <IcRoundSave />
        </Button>
        <Button variant="destructive" size="icon" @click="isEditing = false">
          <IcRoundClose />
        </Button>
      </CardFooter>
    </form>
  </Card>
</template>
