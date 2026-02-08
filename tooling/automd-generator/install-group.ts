import { readdir } from 'node:fs/promises'
import { defineGenerator } from 'automd'
import dedent from 'dedent'
import { md as mdbox } from 'mdbox'
import { readPackageJSON } from 'pkg-types'

const INSTALL_COMMANDS = [
  { packageManager: 'npm', command: 'install' },
  { packageManager: 'yarn', command: 'add' },
  { packageManager: 'pnpm', command: 'add' },
] as const

export default defineGenerator({
  name: 'package-readme',
  async generate({ url }) {
    const packagePath = url.toString()

    const match = packagePath.match(/\/packages\/([a-z0-9]+)\//)
    if (!match) {
      return {
        contents: '',
        issues: [`Could not find package name in ${packagePath}.`],
      }
    }
    const packageName = `@adogrove/adonis-${match[1]}`

    const configureCommand = `node ace configure ${packageName}`

    const contents = dedent`
    ::: code-group
    ${INSTALL_COMMANDS.map(({ packageManager, command }) =>
      mdbox.codeBlock(
        [`${packageManager} ${command} ${packageName}`, configureCommand].join(
          '\n',
        ),
        `sh [${packageManager}]`,
      ),
    ).join('\n')}
      :::
    `
    return {
      contents,
    }
  },
})
