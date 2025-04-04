<script setup lang="ts">
import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { toTypedSchema } from '@vee-validate/zod';
import { toast } from 'vue-sonner';
import { useForm } from 'vee-validate';
import { useI18n } from '#imports';

// components
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

// utils
import {
  createGroup,
  groupsPostBodySchema,
} from '~/utils/api/groups/index.post';

const { t } = useI18n();

const form = useForm({
  validationSchema: toTypedSchema(groupsPostBodySchema),
});

const queryClient = useQueryClient();
const { error, isPending, mutate } = useMutation({
  mutationFn: createGroup,
  onSuccess: (_, variables) => {
    form.resetForm();
    toast.success(t('resources.groups.create.success', variables));
    queryClient.invalidateQueries({ queryKey: ['groups'] });
  },
  onError: ({ message }) => {
    toast.error(t('resources.groups.create.error'), {
      description: message,
    });
  },
});

const handleSubmit = form.handleSubmit((values) => mutate({ body: values }));
</script>

<template>
  <form class="contents" @submit="handleSubmit">
    <FormField v-slot="{ componentField }" name="name">
      <FormItem>
        <FormLabel>{{ $t('resources.groups.fields.name') }}</FormLabel>
        <FormControl>
          <Input id="name" v-bind="componentField" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>
    <FormField v-slot="{ componentField }" name="image">
      <FormItem>
        <FormLabel>{{ $t('resources.groups.fields.image') }}</FormLabel>
        <FormControl>
          <Input id="image" v-bind="componentField" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>
    <Button type="submit" :disabled="isPending">
      {{ $t('common.save') }}
    </Button>
    {{ error }}
  </form>
</template>
