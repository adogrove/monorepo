import type { Config } from 'automd'
import packageReadme from './tooling/automd-generator/package-readme'
import packagesTable from './tooling/automd-generator/packages-table'

export default {
  input: ['packages/*/README.md'],
  generators: {
    packagesTable,
    packageReadme,
  },
} satisfies Config
