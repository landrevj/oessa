<script setup lang="ts">
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import GroupCard from '~/components/group/GroupCard.vue';
import GroupForm from '~/components/group/GroupForm.vue';
import { authClient } from '~/lib/authClient';
import { readGroups } from '~/utils/api/groups/index.get';
import { useQuery } from '@tanstack/vue-query';

const session = authClient.useSession();

const { data, isError } = useQuery({
  queryKey: ['groups'],
  queryFn: readGroups,
});
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
    <div v-if="session?.data" class="container gap-4 flex flex-col">
      <Card class="flex items-center gap-2 p-2">
        <Avatar>
          <AvatarImage :src="session?.data?.user.image || ''" />
          <AvatarFallback>
            {{
              session?.data?.user.name
                .split(' ')
                .map((str) => str[0])
                .join('')
            }}
          </AvatarFallback>
        </Avatar>
        {{ session?.data?.user.name }}
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>{{ $t('resources.groups.create.formTitle') }}</CardTitle>
        </CardHeader>
        <CardContent class="flex flex-col gap-4">
          <GroupForm class="m-4" />
        </CardContent>
      </Card>
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        <GroupCard v-for="group in data" :key="group.id" :group />
      </div>
    </div>
  </div>
</template>
