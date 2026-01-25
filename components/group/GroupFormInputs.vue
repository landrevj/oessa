<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query';

// components
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/shadcn/components/form';
import { Input } from '~/shadcn/components/input';
import UserCombobox from '../user/UserCombobox.vue';

// utils
import { readUsers } from '~/utils/api/users/index.get';

const { data: users } = useQuery({
  queryKey: ['users'],
  queryFn: readUsers,
});
</script>

<template>
  <FormField v-slot="{ componentField }" name="name">
    <FormItem>
      <FormLabel>{{ $t('resource.group.field.name.label') }}</FormLabel>
      <FormControl>
        <Input v-bind="componentField" />
      </FormControl>
      <FormMessage />
    </FormItem>
  </FormField>
  <FormField v-slot="{ componentField }" name="image">
    <FormItem>
      <FormLabel>{{ $t('resource.group.field.image.label') }}</FormLabel>
      <FormControl>
        <Input v-bind="componentField" />
      </FormControl>
      <FormMessage />
    </FormItem>
  </FormField>
  <FormField v-slot="{ componentField }" name="users">
    <FormItem>
      <FormLabel>{{ $t('resource.group.field.users.label') }}</FormLabel>
      <FormControl>
        <UserCombobox v-bind="componentField" :users />
      </FormControl>
      <FormMessage />
    </FormItem>
  </FormField>
</template>
