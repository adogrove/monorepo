# Service
You can use the Cap service in your controllers or services:
```ts
import cap from '@adogrove/adonis-cap/service'

// Create a challenge
const challenge = await cap.createChallenge()

// Redeem a challenge
const result = await cap.redeemChallenge({ token, solutions })
```