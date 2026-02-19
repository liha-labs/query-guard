# @liha-labs/query-guard-resolvers

Resolver utilities for `@liha-labs/query-guard`.

**ESM-only**  
Exports `import` + `types` via `exports`. No CommonJS build.

## zodResolver
Uses Zod to parse raw query values into typed objects.

### Behavior
- Raw values (`string` / `string[]`) are passed to Zod as-is.
- Use `z.coerce` for number/boolean conversions.
- If schema defaults are defined, the second argument is optional.
- `object -> raw` conversion stringifies non-primitive objects via `JSON.stringify`.
- If `JSON.stringify` returns `undefined`, the key is skipped.

## Usage
```ts
import { z } from 'zod'
import { zodResolver } from '@liha-labs/query-guard-resolvers'

const resolver = zodResolver(
  z.object({
    page: z.coerce.number().int().min(1).default(1),
    q: z.string().default(''),
    tags: z.array(z.string()).default([]),
  })
)
```
