<script setup lang="ts">
import { useRoute, useI18n, useLocaleHead, computed } from '#imports';
const { t } = useI18n();
const route = useRoute();
const head = useLocaleHead();
const title = computed(() => t(route.meta.title ?? 'TBD', t('layouts.title')));
</script>

<template>
  <Html :lang="head.htmlAttrs?.lang" :dir="head.htmlAttrs?.dir">
    <Head>
      <Title>{{ title }}</Title>
      <template v-for="link in head.link" :key="link.id">
        <Link
          :id="link.id"
          :rel="link.rel"
          :href="link.href"
          :hreflang="link.hreflang"
        />
      </template>
      <template v-for="meta in head.meta" :key="meta.id">
        <Meta :id="meta.id" :property="meta.property" :content="meta.content" />
      </template>
    </Head>
    <Body>
      <slot />
    </Body>
  </Html>
</template>
