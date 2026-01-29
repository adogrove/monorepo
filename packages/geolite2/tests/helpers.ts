import Configure from '@adonisjs/core/commands/configure'
import { IgnitorFactory } from '@adonisjs/core/factories'
import type { FileSystem } from '@japa/file-system'
import { getActiveTestOrFail } from '@japa/runner'
import { defineConfig } from '../src/define_config.js'

export const BASE_URL = new URL('./tmp/', import.meta.url)

export const IMPORTER = (filePath: string) => {
  if (filePath.startsWith('./') || filePath.startsWith('../')) {
    return import(new URL(filePath, BASE_URL).href)
  }
  return import(filePath)
}

export async function setupFakeAdonisProject(fs: FileSystem) {
  await Promise.all([
    fs.mkdir('.'),
    fs.create('.env', ''),
    fs.createJson('tsconfig.json', {}),
    fs.create('adonisrc.ts', `export default defineConfig({})`),
  ])
}

export async function setupApp({ withConfig = true } = {}) {
  const { context } = getActiveTestOrFail()
  const ignitor = new IgnitorFactory()
    .withCoreConfig()
    .withCoreProviders()
    .merge({
      config: withConfig
        ? {
            geolite2: defineConfig({
              cache: 10000,
              downloadDirectory: `${BASE_URL.pathname}databases/`,
            }),
          }
        : {},
      rcFileContents: {
        providers: [
          {
            file: () => import('../providers/geolite2_provider.js'),
            environment: ['test', 'web'],
          },
        ],
      },
    })
    .create(BASE_URL, {
      importer: IMPORTER,
    })

  const app = ignitor.createApp('web')
  await app.init()
  await app.boot()
  context.cleanup(() => app.terminate())

  const ace = await app.container.make('ace')
  ace.ui.switchMode('raw')

  const command = await ace.create(Configure, ['../../index.js'])
  await command.exec()

  return { ace, app }
}
