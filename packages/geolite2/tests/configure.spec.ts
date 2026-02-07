import { test } from '@japa/runner'
import { setupApp, setupFakeAdonisProject } from './helpers.js'

test.group('Configure', (group) => {
  group.tap((t) => t.timeout(20_000))
  group.each.setup(async ({ context }) => setupFakeAdonisProject(context.fs))

  test('add provider, config file, and middleware', async ({ assert }) => {
    await setupApp()

    await assert.fileExists('config/geolite2.ts')
    await assert.fileContains(
      'adonisrc.ts',
      '@adogrove/adonis-geolite2/geolite2_provider',
    )
  })
})
