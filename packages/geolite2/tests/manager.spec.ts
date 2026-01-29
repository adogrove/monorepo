import { resolve } from 'node:path'
import { test } from '@japa/runner'
import GeoLite2Manager from '../src/manager.js'
import { BASE_URL } from './helpers.js'

declare module '@japa/runner/core' {
  interface TestContext {
    manager: GeoLite2Manager
  }
}

test.group('Geolite2 Manager', (group) => {
  group.tap((t) => t.timeout(20_000))

  group.each.setup(async ({ context }) => {
    await context.fs.mkdir('.')

    context.manager = new GeoLite2Manager({
      cache: 200,
      downloadDirectory: resolve(`${BASE_URL.pathname}databases/`),
    })
  })

  group.each.teardown(async ({ context }) => context.manager.close())

  test('getReaders before initialization should throw', async ({
    assert,
    manager,
  }) => {
    assert.throws(
      () => manager.getReaders(),
      'GeoLite2 readers are not initialized',
    )
  })

  test('getReaders after initialization should not throw', async ({
    assert,
    manager,
  }) => {
    await manager.init()

    assert.doesNotThrow(() => manager.getReaders())
  })

  test('multiple init should be idempotent', async ({ assert, manager }) => {
    await manager.init()
    const expectedReaders = manager.getReaders()
    await manager.init()
    const actualReaders = manager.getReaders()

    assert.strictEqual(actualReaders, expectedReaders)
  })
})
