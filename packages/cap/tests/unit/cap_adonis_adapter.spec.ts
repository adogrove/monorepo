// biome-ignore-all lint/suspicious/noExplicitAny: tests
import { test } from '@japa/runner'
import CapAdonisAdapter from '../../src/cap_adonis_adapter.js'

test.group('cap_adonis_adapter', () => {
  test('should register routes and apply modifier', ({ assert }) => {
    const calls: {
      method: 'post'
      path: string
      handler: unknown
      route: { path: string; method: string; modified?: boolean }
    }[] = []

    const router = {
      post(path: string, handler: unknown) {
        const route = { path, method: 'POST' }
        calls.push({
          method: 'post',
          path,
          handler,
          route,
        })
        return route
      },
    }

    const config = {
      disableAutoCleanup: false,
      challengeConfig: {
        ttl: 60000,
      },
    }

    const store = {}

    const adapter = new CapAdonisAdapter(
      config as any,
      router as any,
      store as any,
    )

    const modified: Array<{
      path: string
      method: string
      modified?: boolean
    }> = []

    adapter.registerRoutes((route) => {
      // @ts-expect-error test property
      route.modified = true
      modified.push(route as any)
    })

    // assert routes registered
    assert.equal(calls.length, 2)

    assert.deepEqual(
      calls.map((call) => call.path),
      ['/cap/challenge', '/cap/redeem'],
    )

    assert.deepEqual(
      calls.map((call) => call.method),
      ['post', 'post'],
    )

    // assert handler format
    assert.isTrue(
      calls.every(
        (call) => Array.isArray(call.handler) && call.handler.length === 2,
      ),
    )

    // assert modifier applied
    assert.equal(modified.length, 2)
    assert.isTrue(modified.every((route) => route.modified))
  })

  test('createChallenge delegates to Cap', async ({ assert }) => {
    const router = {
      post() {
        return {}
      },
    }

    const config = {
      disableAutoCleanup: true,
      challengeConfig: {
        ttl: 12345,
      },
    }

    const store = {}

    const adapter = new CapAdonisAdapter(
      config as any,
      router as any,
      store as any,
    )

    const result = await adapter.createChallenge()

    assert.exists(result.challenge)
    assert.exists(result.expires)
  })

  test('redeemChallenge delegates to Cap', async ({ assert }) => {
    const router = {
      post() {
        return {}
      },
    }

    const config = {
      disableAutoCleanup: true,
      challengeConfig: {},
    }

    const store = {}

    const adapter = new CapAdonisAdapter(
      config as any,
      router as any,
      store as any,
    )

    const result = await adapter.redeemChallenge({
      token: 'test',
      solutions: [],
    })

    assert.exists(result.success)
  })
})
