<script setup lang="ts">
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Button } from '~/components/ui/button';
import { Card } from '~/components/ui/card';
import { authClient } from '~/lib/authClient';

const session = authClient.useSession();
</script>

<template>
  <div>
    <Button href="/test" as="a">Go to test</Button>
    <Button v-if="!session?.data" href="/login" as="a">login</Button>
    <Button v-else @click="authClient.signOut()">logout</Button>

    <div v-if="session?.data" class="container">
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
    </div>
  </div>
</template>
