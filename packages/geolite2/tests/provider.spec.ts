import { test } from '@japa/runner'
import GeoLite2Manager from '../src/manager.js'
import { setupApp, setupFakeAdonisProject } from './helpers.js'

test.group('Provider', (group) => {
  group.tap((t) => t.timeout(10_000))
  group.each.setup(async ({ context }) => setupFakeAdonisProject(context.fs))

  test('register geolite2 container singleton', async ({ assert }) => {
    const { app } = await setupApp()
    assert.instanceOf(
      await app.container.make(GeoLite2Manager),
      GeoLite2Manager,
    )
  })

  test('register geolite2 container singleton, but config is invalid', async () => {
    await setupApp({ withConfig: false })
  }).throws(
    'Invalid default export from "config/geolite2.ts" file. Make sure to use defineConfig method',
  )
})
