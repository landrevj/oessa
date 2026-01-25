<script setup lang="ts">
// components
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '~/shadcn/components/avatar';

const { image, name } = defineProps<{
  image: string | null | undefined;
  name: string;
}>();
</script>

<template>
  <Avatar>
    <AvatarImage :src="image || ''" />
    <AvatarFallback>
      {{
        name
          .split(' ')
          .map((str) => str[0])
          .join('')
      }}
    </AvatarFallback>
  </Avatar>
</template>
