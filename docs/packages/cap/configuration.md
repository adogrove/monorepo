# Configuration

```ts
import { defineConfig, stores } from '@adogrove/adonis-cap'

const capConfig = defineConfig({
    disableAutoCleanup: false,
    challengeConfig: {
        challengeCount: 50,
        challengeSize: 32,
        challengeDifficulty: 4,
        expiresMs: 600000
    },
    store: stores.memory()
})

export default capConfig

```

## Reference
### disableAutoCleanup
When set to `false` (default), expired challenges and tokens are automatically cleaned up. Set to `true` if you want to handle cleanup yourself.

### challengeConfig
Configuration passed to the underlying Cap server for challenge generation.

- **challengeCount**: The number of challenges to generate.
- **challengeSize**: The size of each challenge in bytes.
- **challengeDifficulty**: The difficulty of the proof-of-work challenge. Higher values require more computational effort from the client.
- **expiresMs**: How long (in seconds) a challenge remains valid before it expires.

### store
The storage backend used to persist challenges and tokens. Use one of the built-in stores or provide your own.


#### Built-in stores
- `stores.memory()` — In-memory store. Fast and simple, but challenges are lost on server restart and not shared across instances.
