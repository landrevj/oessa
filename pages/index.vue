<script setup>
import { Button } from '~/components/ui/button';

const slug = 'Here is some text!';
</script>

<template>
  <div>
    <span>
      {{ slug }}
    </span>
    <Button href="/test" as="a">Go to test</Button>
  </div>
</template>
