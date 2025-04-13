<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query';

// components
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form';
import { Input } from '../ui/input';
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
      <FormLabel>{{ $t('resources.groups.fields.name.label') }}</FormLabel>
      <FormControl>
        <Input id="name" v-bind="componentField" />
      </FormControl>
      <FormMessage />
    </FormItem>
  </FormField>
  <FormField v-slot="{ componentField }" name="image">
    <FormItem>
      <FormLabel>{{ $t('resources.groups.fields.image.label') }}</FormLabel>
      <FormControl>
        <Input id="image" v-bind="componentField" />
      </FormControl>
      <FormMessage />
    </FormItem>
  </FormField>
  <FormField v-slot="{ componentField }" name="users">
    <FormItem>
      <FormLabel>{{ $t('resources.groups.fields.users.label') }}</FormLabel>
      <FormControl>
        <UserCombobox v-bind="componentField" :users />
      </FormControl>
      <FormMessage />
    </FormItem>
  </FormField>
</template>
