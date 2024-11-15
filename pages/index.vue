<script setup>
import { Button } from '~/components/ui/button';
</script>

<template>
  <div>
    <span>
      {{ $t('one.two') }}
    </span>
    <Button href="/test" as="a">Go to test</Button>
  </div>
</template>
