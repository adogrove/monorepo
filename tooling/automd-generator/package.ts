import { readdir } from 'node:fs/promises'
import { defineGenerator } from 'automd'
import { md as mdbox } from 'mdbox'
import { readPackageJSON } from 'pkg-types'

export default defineGenerator({
  name: 'packages',
  async generate() {
    const dirs = await readdir('./packages')
    const columns = ['Package', 'Version', 'Description', 'Useful links']

    const rows = await Promise.all(
      dirs.map(async (dir) => {
        const packageJson = await readPackageJSON(
          `./packages/${dir}/package.json`,
        )
        return [
          packageJson.name ?? 'N/A',
          mdbox.link(
            `https://npmjs.com/package/${packageJson.name}`,
            mdbox.image(
              `https://img.shields.io/npm/v/${packageJson.name}?color=brightgreen&style=for-the-badge`,
              `npm version of ${packageJson.name}`,
            ),
          ),
          packageJson.description ?? '',
          `${mdbox.link(`https://npmjs.com/${packageJson.name}`, 'NPM')} • ${
            packageJson.homepage
              ? mdbox.link(packageJson.homepage, 'Documentation')
              : 'Missing documentation'
          } • ${mdbox.link(
            `https://github.com/adogrove/monorepo/tree/main/packages/${dir}`,
            'Source',
          )}`,
        ]
      }),
    )

    return {
      contents: mdbox.table({
        columns,
        rows,
      }),
    }
  },
})
