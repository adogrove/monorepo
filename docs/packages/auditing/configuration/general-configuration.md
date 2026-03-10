# General configuration

Auditing configuration is located in the `config/auditing.ts` file. By default, the file looks like this:

```typescript
import { defineConfig } from '@adogrove/adonis-auditing/setup'

export default defineConfig({
  warnOnMissingContext: true,
  userResolver: () => import('#audit_resolvers/user_resolver'),
  resolvers: {
    ip_address: () => import('#audit_resolvers/ip_address_resolver'),
    user_agent: () => import('#audit_resolvers/user_agent_resolver'),
    url: () => import('#audit_resolvers/url_resolver'),
  },
})
```

## `warnOnMissingContext`
When set to `true` (default), the auditing manager will log a warning when it cannot get the current context. This can happen if `asyncLocalStorage` is not enabled.

## `userResolver`
User resolver, under the `userResolver` key, is a special resolver that is used to resolve the user who is responsible for the action. By default, it is set to `() => import('#audit_resolvers/user_resolver')`. You can change it to your custom resolver if needed.

## `resolvers`
Resolvers, under the `resolvers` key, are used to resolve complementary metadata for the audit log. By default, there are three resolvers: `ip_address`, `user_agent`, and `url`. You can add your custom resolvers if needed. 
