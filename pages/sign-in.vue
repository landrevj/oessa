<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod';
import { toast } from 'vue-sonner';
import { useForm } from 'vee-validate';
import { useI18n } from '#imports';
import { z } from 'zod';

// components
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '~/shadcn/components/card';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/shadcn/components/form';
import { Button } from '~/shadcn/components/button';
import { CheckboxLabeled } from '~/components/ui/checkbox';
import { Input } from '~/shadcn/components/input';
import { Separator } from '~/shadcn/components/separator';

// utils
import { authClient } from '~/lib/authClient';

// icons
import LogosApple from '~icons/logos/apple';
import LogosGoogleIcon from '~icons/logos/google-icon';

const { t } = useI18n();

const form = useForm({
  validationSchema: toTypedSchema(
    z.object({
      email: z.string().email(),
      password: z.string().min(8).max(128),
      rememberMe: z.boolean().optional(),
    }),
  ),
});

const onSubmit = form.handleSubmit(({ email, password, rememberMe }) =>
  authClient.signIn.email({
    email,
    password,
    rememberMe,
    callbackURL: '/',
    fetchOptions: {
      onError: (ctx) => {
        toast.error(t('auth.error.signIn'), {
          description: ctx.error.message || t('auth.error.signInFailure'),
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
        <CardTitle>{{ $t('auth.signIn') }}</CardTitle>
      </CardHeader>
      <CardContent>
        <div class="flex flex-col gap-2">
          <form class="flex flex-col gap-4" @submit.prevent="onSubmit">
            <FormField v-slot="{ componentField }" name="email">
              <FormItem>
                <FormLabel>{{ $t('common.email') }}</FormLabel>
                <FormControl>
                  <Input v-bind="componentField" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField v-slot="{ componentField }" name="password">
              <FormItem>
                <FormLabel>{{ $t('auth.password') }}</FormLabel>
                <FormControl>
                  <Input type="password" v-bind="componentField" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField v-slot="{ value, handleChange }" name="rememberMe">
              <FormItem>
                <FormControl>
                  <CheckboxLabeled
                    :checked="value"
                    @update:checked="handleChange"
                  >
                    {{ $t('auth.rememberMe') }}
                  </CheckboxLabeled>
                </FormControl>
              </FormItem>
            </FormField>
            <Button type="submit">
              {{ $t('auth.signIn') }}
            </Button>
          </form>
          <Separator :label="$t('common.or')" class="my-4" />
          <Button
            disabled
            variant="outline"
            @click="() => authClient.signIn.social({ provider: 'apple' })"
          >
            <LogosApple fill="currentColor" />
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
