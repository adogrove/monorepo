import { readdir } from 'node:fs/promises'
import { defineGenerator } from 'automd'
import dedent from 'dedent'
import { md as mdbox } from 'mdbox'
import { readPackageJSON } from 'pkg-types'

function repositoryUrl(
  repository?: string | { url: string; directory?: string },
) {
  if (repository === undefined) {
    return 'N/A'
  }

  if (typeof repository === 'string') {
    return repository
  }

  const { url, directory } = repository
  return `${url}${directory ? `/${directory}` : ''}`
}

function bugsUrl(bugs?: string | { url?: string; email?: string }) {
  if (bugs === undefined) {
    return 'N/A'
  }
  if (typeof bugs === 'string') {
    return bugs
  }
  if (bugs.url !== undefined) {
    return bugs.url
  }
  if (bugs.email !== undefined) {
    return `mailto:${bugs.email}`
  }
  return 'N/A'
}

export default defineGenerator({
  name: 'package-readme',
  async generate({ url, ...context }) {
    const packageJsonPath = new URL('./package.json', url)
    const packageJson = await readPackageJSON(packageJsonPath.toString())

    const packageName = packageJson.name ?? 'N/A'
    const packageDescription = packageJson.description ?? 'N/A'
    const packageHomepage = packageJson.homepage ?? 'N/A'
    const packageRepository = repositoryUrl(packageJson.repository)
    const packageLicense = packageJson.license ?? 'N/A'
    const packageBugs = bugsUrl(packageJson.bugs)

    const contents = dedent`
      <div align="center">

        # ${packageName}
        ### ${packageDescription}
        #### [📚 Documentation](${packageHomepage}) • [✍🏻 Source](${packageRepository}) • [✍🏻 Issues](${packageBugs})
        
        <a href="https://www.npmjs.com/package/${packageName}">
          <img src="https://img.shields.io/npm/v/${packageName}.svg?style=for-the-badge&logo=npm"  alt="npm version of ${packageName}"/>
        </a>
        <img src="https://img.shields.io/npm/l/${packageName}?color=blueviolet&style=for-the-badge" alt="license of ${packageName} is ${packageLicense}" />
        <img src="https://img.shields.io/npm/dt/${packageName}?style=for-the-badge" alt="npm downloads of ${packageName}">
        <img src="https://img.shields.io/bundlephobia/minzip/${packageName}?style=for-the-badge" alt="npm bundle size of ${packageName}" />
        
        This project is part of [adogrove](https://adogrove.stouder.io/) and licensed under [AGPL-3.0-or-later](LICENSE).
      </div>
    `
    return {
      contents,
    }
  },
})
