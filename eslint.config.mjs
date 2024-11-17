// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

export default withNuxt(eslintPluginPrettierRecommended, {
  rules: {
    // javascript
    'no-useless-return': 'error',
    'require-await': 'error',
    // vue
    'vue/multi-word-component-names': 'warn',
  },
});
