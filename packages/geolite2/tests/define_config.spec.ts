import { resolve } from 'node:path'
import { test } from '@japa/runner'
import { defineConfig } from '../src/define_config.js'
import { setupApp, setupFakeAdonisProject } from './helpers.js'

test.group('Define Config', (group) => {
  group.tap((t) => t.timeout(20_000))
  group.each.setup(async ({ context }) => setupFakeAdonisProject(context.fs))

  test('download directory is resolved', async ({ assert }) => {
    const downloadDirectoryRelative = './storage/geolite2'

    const { app } = await setupApp({ withConfig: true })
    const { downloadDirectory } = await defineConfig({
      cache: 200,
      downloadDirectory: downloadDirectoryRelative,
    }).resolver(app)

    const expected = resolve(downloadDirectoryRelative)

    assert.strictEqual(downloadDirectory, expected)
  })
})
