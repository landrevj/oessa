<script setup lang="ts">
import type { InternalApi } from 'nitropack';

// components
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '~/shadcn/components/card';

// icons

// utils

// types

const { comment } = defineProps<{
  comment: InternalApi['/api/commentables/:id/threads']['get'][number];
}>();
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle :class="!comment.title && 'text-white text-opacity-30'">
        <a :href="`/comments/${comment.id}`">
          {{ comment.title || $t('resource.comment.field.title.missing') }}
        </a>
      </CardTitle>
    </CardHeader>
    <CardContent>{{ comment.message }}</CardContent>
  </Card>
</template>
