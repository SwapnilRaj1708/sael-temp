import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import tseslint from 'typescript-eslint';

/**
 * Guardrails enforced here (see /CLAUDE.md §5, §6 and docs/architecture.md §3):
 *
 *  1. No component or page may import a concrete content repository — only the
 *     `getContentRepository()` factory from `@/lib/content`.
 *  2. Nothing outside `src/lib/config/env.ts` may read `process.env`.
 *
 * Both are asserted by `pnpm verify:guardrails`.
 */

const RESTRICTED_CONTENT_IMPORTS = {
  patterns: [
    {
      group: [
        '@/lib/content/mock',
        '@/lib/content/mock/**',
        '@/lib/content/api',
        '@/lib/content/api/**',
      ],
      message:
        'Import getContentRepository() from "@/lib/content" instead. Components and pages must not know which repository implementation is active — see /CLAUDE.md §6.',
    },
  ],
};

const RESTRICTED_PROCESS_ENV = [
  {
    object: 'process',
    property: 'env',
    message:
      'Read configuration from "@/lib/config/env" instead. process.env is validated in exactly one place — see docs/architecture.md §6.',
  },
];

const eslintConfig = defineConfig([
  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'dist/**',
    'next-env.d.ts',
    // Client handover staging: raw supplied files, gitignored, processed into
    // src/assets/ rather than shipped from here. It holds third-party HTML and
    // bundled JavaScript we neither own nor build. /CLAUDE.md §8.
    'assets/**',
  ]),
  ...nextVitals,
  ...nextTs,
  {
    files: ['src/**/*.{ts,tsx}'],
    extends: [tseslint.configs.strictTypeChecked, tseslint.configs.stylisticTypeChecked],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      'no-restricted-imports': ['error', RESTRICTED_CONTENT_IMPORTS],
      'no-restricted-properties': ['error', ...RESTRICTED_PROCESS_ENV],
    },
  },
  {
    // The data layer is allowed to reference its own implementations.
    files: ['src/lib/content/**'],
    rules: { 'no-restricted-imports': 'off' },
  },
  {
    // The single sanctioned reader of process.env.
    files: ['src/lib/config/env.ts'],
    rules: { 'no-restricted-properties': 'off' },
  },
  {
    // Build and release tooling runs in Node, outside the app's config layer.
    files: ['scripts/**/*.mjs', '*.mjs', '*.ts'],
    rules: { 'no-restricted-properties': 'off' },
  },
]);

export default eslintConfig;
