<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query';
import { computed } from 'vue';
import { Button } from '~/components/ui/button';
import { fetchTodos } from '~/queries/test/test.queries';
import { getTodoStrings } from '~/queries/test/test.selectors';

const { isFetching, status, data, error, refetch } = useQuery(fetchTodos());
const todoStrings = computed(() => getTodoStrings(data.value || []));
const text = defineModel<string>('text');
</script>

<template>
  <div>
    <Textarea v-model="text" placeholder="placeholder ;)" />
    <p class="whitespace-pre-wrap">{{ text }}</p>
    <div>
      <span>
        {{ $t('one.two') }}
      </span>
      <Button @click="refetch">refetch</Button>
      <div v-if="status === 'error'">
        {{ error }}
      </div>
      <div v-else>
        {{ isFetching }}
        {{ status }}
        <p v-for="todoStr in todoStrings" :key="todoStr">{{ todoStr }}</p>
      </div>
    </div>
  </div>
</template>
