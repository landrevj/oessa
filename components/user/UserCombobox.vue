<script setup lang="ts">
import { computed, ref } from 'vue';
import { useFilter } from 'reka-ui';

// components
import {
  Combobox,
  ComboboxAnchor,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '~/components/ui/combobox';
import {
  TagsInput,
  TagsInputInput,
  TagsInputItem,
  TagsInputItemDelete,
} from '~/components/ui/tags-input';

// icons

// utils
import { isUser } from '~/utils/api/users/index.get';

// types
import type { ComponentFieldBindingObject } from 'vee-validate';
import type { InternalApi } from 'nitropack';

const { users = [], ...componentField } = defineProps<
  {
    users?: InternalApi['/api/users']['get'];
  } & ComponentFieldBindingObject<InternalApi['/api/users']['get']>
>();

const isOpen = ref();
const searchTerm = ref('');

const { contains } = useFilter({ sensitivity: 'base' });
const filteredUsers = computed(() => {
  const unpickedUsers = users.filter(
    (user) =>
      !componentField.modelValue?.some(
        (pickedUser) => user.id === pickedUser.id,
      ),
  );
  return searchTerm.value
    ? unpickedUsers.filter((user) => contains(user.name, searchTerm.value))
    : unpickedUsers;
});
</script>

<template>
  <Combobox
    v-model:open="isOpen"
    :ignore-filter="true"
    :model-value="componentField.modelValue"
    @update:model-value="componentField['onUpdate:modelValue']"
  >
    <ComboboxAnchor as-child>
      <TagsInput
        class="px-2 gap-2 w-full"
        :model-value="componentField.modelValue"
        @update:model-value="componentField['onUpdate:modelValue']"
      >
        <div class="flex gap-2 flex-wrap items-center">
          <TagsInputItem
            v-for="item in componentField.modelValue"
            :key="item.id"
            :value="item"
          >
            <!-- <TagsInputItemText /> -->
            <span class="py-1 px-2 text-sm rounded bg-transparent">
              {{ item.name }}
            </span>
            <TagsInputItemDelete />
          </TagsInputItem>
        </div>

        <ComboboxInput
          v-model="searchTerm"
          as-child
          :display-value="(user) => user.name"
        >
          <TagsInputInput
            class="min-w-[200px] w-full p-0 border-none focus-visible:ring-0 h-auto"
            :placeholder="$t('resources.groups.fields.users.placeholder')"
            @keydown.enter.prevent
            @click="isOpen = true"
          />
        </ComboboxInput>
      </TagsInput>

      <ComboboxList class="w-[--reka-popper-anchor-width]">
        <ComboboxEmpty />
        <ComboboxGroup>
          <ComboboxItem
            v-for="user in filteredUsers"
            :key="user.id"
            :value="user"
            @select.prevent="
              (event) => {
                if (
                  isUser(event.detail.value) &&
                  componentField.modelValue &&
                  componentField['onUpdate:modelValue']
                ) {
                  searchTerm = '';
                  componentField['onUpdate:modelValue']([
                    ...componentField.modelValue,
                    event.detail.value,
                  ]);
                }

                if (filteredUsers.length === 0) {
                  isOpen = false;
                }
              }
            "
          >
            {{ user.name }}
          </ComboboxItem>
        </ComboboxGroup>
      </ComboboxList>
    </ComboboxAnchor>
  </Combobox>
</template>
