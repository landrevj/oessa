// @ts-check
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import pluginQuery from '@tanstack/eslint-plugin-query';
// import eslintPluginTailwindCSS from 'eslint-plugin-tailwindcss';
import withNuxt from './.nuxt/eslint.config.mjs';

export default withNuxt([
  eslintPluginPrettierRecommended,
  // ...eslintPluginTailwindCSS.configs['flat/recommended'],
  ...pluginQuery.configs['flat/recommended'],
  {
    rules: {
      // javascript
      'no-useless-return': 'error',
      'require-await': 'error',
      'sort-imports': [
        'error',
        {
          allowSeparatedGroups: true,
        },
      ],
      // vue
      'vue/multi-word-component-names': 'warn',
      'vue/no-undef-components': 'error',
    },
  },
]);
