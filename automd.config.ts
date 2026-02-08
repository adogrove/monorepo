import type { Config } from 'automd'
import packages from './tooling/automd-generator/package'

/** @type {import("automd").Config} */
export default {
  input: ['README.md', 'packages/*/README.md'],
  generators: {
    packages,
  },
} satisfies Config
