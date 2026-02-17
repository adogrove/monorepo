import type { ChallengeData } from '@cap.js/server'
import { test } from '@japa/runner'
import { defineConfig } from '../../src/define_config.js'
import { stores } from '../../src/stores/index.js'
import type Store from '../../src/stores/store.js'

test.group('define_config', () => {
  test('do not alter', async ({ assert }) => {
    const expected = {
      disableAutoCleanup: true,
      challengeConfig: {
        challengeCount: 50,
        challengeSize: 32,
        challengeDifficulty: 4,
        expiresMs: 600000,
      },
      store: stores.memory(),
    }

    const actual = defineConfig(expected)

    assert.deepEqual(actual, expected)
  })

  test('store through config provider', async ({ assert }) => {
    const expected = {
      disableAutoCleanup: true,
      challengeConfig: {
        challengeCount: 50,
        challengeSize: 32,
        challengeDifficulty: 4,
        expiresMs: 600000,
      },
      store: stores.memory(),
    }

    const actual = defineConfig(expected)

    assert.deepEqual(actual, expected)
  })

  test('store directly', async ({ assert }) => {
    class FakeCapStore implements Store {
      challenges = {
        store: async (_token: string, _challengeData: ChallengeData) => {},
        read: async (_token: string) => {
          return null
        },
        delete: async (_token: string) => {},
        deleteExpired: async () => {},
      }
      tokens = {
        store: async (_token: string, _expires: number) => {},
        get: async (_token: string) => {
          return null
        },
        delete: async (_token: string) => {},
        deleteExpired: async () => {},
      }
    }
    const expected = {
      disableAutoCleanup: true,
      challengeConfig: {
        challengeCount: 50,
        challengeSize: 32,
        challengeDifficulty: 4,
        expiresMs: 600000,
      },
      store: () => new FakeCapStore(),
    }

    const actual = defineConfig(expected)

    assert.deepEqual(actual, expected)
  })
})
