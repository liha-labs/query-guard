# @liha-labs/query-guard

Dependency-free core for typed URL query state.

**ESM-only**  
Exports `import` + `types` via `exports`. No CommonJS build.

## What You Can Do
- Parse and serialize query strings.
- Keep typed query state in sync with the URL.
- Control how unknown keys are preserved or dropped.

## Quick Example (Core Only)
```ts
import { createBrowserAdapter, createQueryGuard } from '@liha-labs/query-guard'

const resolver = {
  resolve: ({ raw }) => ({ value: { q: raw.q ?? '' } }),
  serialize: (value) => ({ q: value.q }),
}

const guard = createQueryGuard({
  adapter: createBrowserAdapter(),
  resolver,
  defaultValue: { q: '' },
  unknownPolicy: 'keep',
})

guard.set({ q: 'hello' })
```

## createBrowserAdapter (Important)
- Browser-only. Throws when `window` is undefined.
- Subscribes only to `popstate`.
- External `history.pushState` / `history.replaceState` do not notify.
- Pull-based reads (`getSearch` / `getRaw` / `getQueries`) are safe on demand.

## createQueryGuard API
- `getSearch()` / `getRaw()` / `getQueries()` / `getMeta()`
- `setQueries(next, options?)`
- `set(patch, options?)`
- `reset(options?)`
- `subscribe(listener)`

### unknownPolicy
- `keep`: preserve keys not owned by the guard.
- `drop`: remove unknown keys when writing.

### set(patch)
- `undefined` means deletion.
- Deleted keys are removed from the URL.

### reset(mode)
- `clear`: remove owned keys from the URL.
- `write-defaults`: serialize `defaultValue` into the URL.

## Adapter Interface (QueryGuardAdapter)
Implement these three methods:
- `getSearch(): string`
- `setSearch(nextSearch: string, options?: { history?: 'replace' | 'push' }): void`
- `subscribe(listener: () => void): () => void`

This allows integrations with routers or non-browser environments.

## SSR
Use a custom adapter for SSR/non-browser environments.  
`createBrowserAdapter` throws if `window` is not available.
