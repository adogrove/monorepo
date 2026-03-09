## Register routes

After the provider boots, you can register the Cap challenge and redeem routes in your `start/routes.ts` file:

```ts
import cap from '@adogrove/adonis-cap/service'
cap.registerRoutes()
```

This registers two `POST` endpoints:
- `POST /cap/challenge` — generates a new challenge for the client
- `POST /cap/redeem` — verifies the client's solutions and returns a token

You can optionally modify the registered routes (e.g., to apply middleware):

```ts
import cap from '@adogrove/adonis-cap/service'

cap.registerRoutes((route) => {
  route.use(middleware.throttle())
})
```