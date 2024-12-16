<script setup lang="ts">
import { Button } from '~/components/ui/button';
import { authClient } from '~/lib/authClient';
</script>

<template>
  <Button @click="() => authClient.signIn.social({ provider: 'google' })">
    Sign in with Google
  </Button>
</template>
