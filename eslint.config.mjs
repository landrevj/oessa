// @ts-check
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import withNuxt from './.nuxt/eslint.config.mjs';

export default withNuxt(eslintPluginPrettierRecommended, {
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
});
