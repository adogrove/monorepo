# Custom Stores

If the built-in stores does not meet your needs, you can create and register your own store by extending the `Store` abstract class.


## Creating a custom store
```ts
import Store from '@adogrove/adonis-cap/store'
import type { ChallengeData } from '@cap.js/server'

export default class RedisStore extends Store {
  challenges = {
    store: async (token: string, challengeData: ChallengeData) => {
      // Store the challenge data in Redis
    },
    read: async (token: string) => {
      // Read challenge data from Redis, return null if not found
    },
    delete: async (token: string) => {
      // Delete the challenge from Redis
    },
    deleteExpired: async () => {
      // Delete all expired challenges
    },
  }

  tokens = {
    store: async (tokenKey: string, expires: number) => {
      // Store the token with its expiry timestamp
    },
    get: async (tokenKey: string) => {
      // Get the expiry timestamp for a token, return null if not found
    },
    delete: async (tokenKey: string) => {
      // Delete the token
    },
    deleteExpired: async () => {
      // Delete all expired tokens
    },
  }
}
```

## Registering the custom store
Use `configProvider` from AdonisJS to register your custom store in `config/cap.ts`:
```ts
import { configProvider } from '@adonisjs/core'
import { defineConfig } from '@adogrove/adonis-cap'

export default defineConfig({
  disableAutoCleanup: false,
  challengeConfig: {
      challengeCount: 50,
      challengeSize: 32,
      challengeDifficulty: 4,
      expiresMs: 600000
  },
  store: configProvider.create(async () => {
    const { default: RedisStore } = await import('#cap_stores/redis')
    return new RedisStore()
  }),
})
```