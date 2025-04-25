<script setup lang="ts">
// components
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';

// icons

// utils

// types
</script>

<template>
  <FormField v-slot="{ componentField }" name="title">
    <FormItem>
      <FormLabel>
        {{ $t(`resource.comment.field.title.label`) }}
      </FormLabel>
      <FormControl>
        <Input v-bind="componentField" />
      </FormControl>
      <FormMessage />
    </FormItem>
  </FormField>
  <FormField v-slot="{ componentField }" name="message">
    <FormItem>
      <FormLabel>{{ $t('resource.comment.field.message.label') }}</FormLabel>
      <FormControl>
        <Textarea v-bind="componentField" />
      </FormControl>
      <FormMessage />
    </FormItem>
  </FormField>
</template>
