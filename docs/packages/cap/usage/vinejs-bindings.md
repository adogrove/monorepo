# VineJS bindings

If your application uses VineJS for validation, the package automatically registers a capToken rule on the Vine instance. You can use it to validate that a Cap token is legitimate:

```ts
import vine from '@vinejs/vine'

const schema = vine.compile(
  vine.object({
    capToken: vine.capToken().valid(),
  })
)
```