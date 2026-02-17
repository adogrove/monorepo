import Configure from '@adonisjs/core/commands/configure'
import { IgnitorFactory } from '@adonisjs/core/factories'
import { test } from '@japa/runner'
import { KNOWN_STORES } from '../../configure.js'
import { IMPORTER } from '../helpers.js'

test.group('configure', (group) => {
  group.each.timeout(0)

  test('register provider', async ({ assert, fs }) => {
    const ignitor = new IgnitorFactory()
      .withCoreProviders()
      .withCoreConfig()
      .create(fs.baseUrl, {
        importer: IMPORTER,
      })

    const app = ignitor.createApp('console')
    await app.init()
    await app.boot()

    await fs.create('.env', '')
    await fs.createJson('tsconfig.json', {})
    await fs.create(
      'start/env.ts',
      `export default Env.create(new URL('./'), {})`,
    )
    await fs.create('adonisrc.ts', `export default defineConfig({})`)

    const ace = await app.container.make('ace')
    ace.ui.switchMode('raw')
    ace.prompt
      .trap('Select the storage layer you want to use')
      .assertFails('', 'Please select a store')
      .assertPasses('memory')
      .chooseOption(0)

    const command = await ace.create(Configure, ['../../index.ts'])
    await command.exec()

    await assert.fileContains(
      'adonisrc.ts',
      '@adogrove/adonis-cap/cap_provider',
    )
  })

  test('select invalid store', async ({ fs }) => {
    const ignitor = new IgnitorFactory()
      .withCoreProviders()
      .withCoreConfig()
      .create(fs.baseUrl, {
        importer: IMPORTER,
      })

    const app = ignitor.createApp('console')
    await app.init()
    await app.boot()

    await fs.create('.env', '')
    await fs.createJson('tsconfig.json', {})
    await fs.create(
      'start/env.ts',
      `export default Env.create(new URL('./'), {})`,
    )
    await fs.create('adonisrc.ts', `export default defineConfig({})`)

    const ace = await app.container.make('ace')
    ace.ui.switchMode('raw')
    const command = await ace.create(Configure, [
      '../../index.ts',
      `--store=idonotexist`,
    ])
    await command.exec()

    command.assertFailed()
    command.assertLog(
      'Invalid Cap store "idonotexist". Supported stores are: memory',
    )
  })

  test('select store, using ace')
    .with(['memory'])
    .run(async ({ assert, fs }, store) => {
      const ignitor = new IgnitorFactory()
        .withCoreProviders()
        .withCoreConfig()
        .create(fs.baseUrl, {
          importer: IMPORTER,
        })

      const app = ignitor.createApp('console')
      await app.init()
      await app.boot()

      await fs.create('.env', '')
      await fs.createJson('tsconfig.json', {})
      await fs.create(
        'start/env.ts',
        `export default Env.create(new URL('./'), {})`,
      )
      await fs.create('adonisrc.ts', `export default defineConfig({})`)

      const ace = await app.container.make('ace')
      ace.ui.switchMode('raw')
      ace.prompt
        .trap('Select the storage layer you want to use')
        .assertFails('', 'Please select a store')
        .assertPasses('memory')
        .chooseOption(KNOWN_STORES.indexOf(store))

      const command = await ace.create(Configure, ['../../index.ts'])
      await command.exec()

      await assert.fileExists('config/cap.ts')
      await assert.fileContains('config/cap.ts', [`store: stores.memory()`])
    })

  test('select store, using flag')
    .with(['memory'])
    .run(async ({ assert, fs }, store) => {
      const ignitor = new IgnitorFactory()
        .withCoreProviders()
        .withCoreConfig()
        .create(fs.baseUrl, {
          importer: IMPORTER,
        })

      const app = ignitor.createApp('console')
      await app.init()
      await app.boot()

      await fs.create('.env', '')
      await fs.createJson('tsconfig.json', {})
      await fs.create(
        'start/env.ts',
        `export default Env.create(new URL('./'), {})`,
      )
      await fs.create('adonisrc.ts', `export default defineConfig({})`)

      const ace = await app.container.make('ace')
      ace.ui.switchMode('raw')

      const command = await ace.create(Configure, [
        '../../index.ts',
        `--store=${store}`,
      ])
      await command.exec()

      await assert.fileExists('config/cap.ts')
      await assert.fileContains('config/cap.ts', [`store: stores.memory()`])
    })
})
