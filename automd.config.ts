import type { Config } from 'automd'
import installGroup from './tooling/automd-generator/install-group'
import packageReadme from './tooling/automd-generator/package-readme'
import packagesTable from './tooling/automd-generator/packages-table'

export default {
  input: ['packages/*/README.md', 'docs/**/*.md'],
  generators: {
    packagesTable,
    packageReadme,
    installGroup,
  },
} satisfies Config
