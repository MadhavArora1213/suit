import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
  },
  {
    // Server-side code (Vercel functions, vite plugins, scripts) runs in Node
    files: ['api/**/*.js', 'vite-plugins/**/*.js', 'scripts/**/*.{js,mjs}', '*.js'],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
  },
])
