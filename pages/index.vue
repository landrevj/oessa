<script setup lang="ts">
import { Button } from '~/components/ui/button';
import { authClient } from '~/lib/authClient';

const session = authClient.useSession();
console.log(session);
</script>

<template>
  <div>
    <Button href="/test" as="a">Go to test</Button>
    <Button v-if="!session?.data" href="/login" as="a">login</Button>
    <Button v-else @click="authClient.signOut()">logout</Button>

    <div>
      {{ session?.data?.user.name }}
    </div>
  </div>
</template>
