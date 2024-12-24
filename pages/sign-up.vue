<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod';
import { z } from 'zod';
import { useForm } from 'vee-validate';
import { navigateTo, useI18n } from '#imports';

// utils
import { authClient } from '~/lib/authClient';

// components
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Input } from '~/components/ui/input';
import { Separator } from '~/components/ui/separator';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form';

// icons
import LogosApple from '~icons/logos/apple';
import LogosGoogleIcon from '~icons/logos/google-icon';
import { toast } from 'vue-sonner';

const { t } = useI18n();

const form = useForm({
  validationSchema: toTypedSchema(
    z
      .object({
        email: z.string().email(),
        name: z.string(),
        password: z.string().min(8).max(128),
        confirmPassword: z.string().min(8).max(128),
      })
      .superRefine(({ confirmPassword, password }, ctx) => {
        if (confirmPassword !== password) {
          ctx.addIssue({
            code: 'custom',
            message: t('auth.error.passwordsMustMatch'),
            path: ['confirmPassword'],
          });
        }
      }),
  ),
});

const onSubmit = form.handleSubmit(({ email, name, password }) =>
  authClient.signUp.email({
    email,
    name,
    password,
    fetchOptions: {
      onSuccess: () => {
        navigateTo('/');
      },
      onError: (ctx) => {
        toast.error(t('auth.error.signup'), {
          description: ctx.error.message || t('auth.error.signupFailure'),
          dismissible: true,
        });
      },
    },
  }),
);
</script>

<template>
  <div class="w-screen h-screen flex justify-center">
    <Card class="w-full md:w-[500px] border-none shadow-none my-auto">
      <CardHeader>
        <CardTitle>{{ $t('auth.signup') }}</CardTitle>
      </CardHeader>
      <CardContent>
        <div class="flex flex-col gap-2">
          <form class="flex flex-col gap-4" @submit="onSubmit">
            <FormField v-slot="{ componentField }" name="name">
              <FormItem>
                <FormLabel>{{ $t('common.name') }}</FormLabel>
                <FormControl>
                  <Input id="name" v-bind="componentField" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField v-slot="{ componentField }" name="email">
              <FormItem>
                <FormLabel>{{ $t('common.email') }}</FormLabel>
                <FormControl>
                  <Input id="email" v-bind="componentField" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField v-slot="{ componentField }" name="password">
              <FormItem>
                <FormLabel>{{ $t('auth.password') }}</FormLabel>
                <FormControl>
                  <Input
                    id="password"
                    type="password"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField v-slot="{ componentField }" name="confirmPassword">
              <FormItem>
                <FormLabel>{{ $t('auth.confirmPassword') }}</FormLabel>
                <FormControl>
                  <Input
                    id="confirmPassword"
                    type="password"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <Button type="submit">
              {{ $t('auth.createAccount') }}
            </Button>
          </form>
          <Separator :label="$t('common.or')" class="my-4" />
          <Button
            disabled
            variant="outline"
            @click="() => authClient.signIn.social({ provider: 'apple' })"
          >
            <LogosApple />
            {{ $t('auth.with.apple') }}
          </Button>
          <Button
            variant="outline"
            @click="() => authClient.signIn.social({ provider: 'google' })"
          >
            <LogosGoogleIcon />
            {{ $t('auth.with.google') }}
          </Button>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
