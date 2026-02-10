# query-guard (alias)

This is a convenience alias of `@liha-labs/query-guard`.  
It re-exports the **core-only** API (no React or Zod dependencies).

**ESM-only**  
Exports `import` + `types` via `exports`. No CommonJS build.

## Install
```sh
pnpm add query-guard
```

## Usage (Core)
```ts
import { createBrowserAdapter, createQueryGuard } from 'query-guard'

const resolver = {
  resolve: ({ raw }) => ({ value: { q: raw.q ?? '' } }),
  serialize: (value) => ({ q: value.q }),
}

const guard = createQueryGuard({
  adapter: createBrowserAdapter(),
  resolver,
  defaultValue: { q: '' },
})

guard.set({ q: 'hello' })
```

## React Usage
Use the dedicated React package:
```sh
pnpm add @liha-labs/query-guard-react react
```
See the root README for a Provider + hook example.

## Zod Usage
Use the dedicated resolver package:
```sh
pnpm add @liha-labs/query-guard-resolvers zod
```

## SSR / History Notes
- `createBrowserAdapter` is browser-only and throws when `window` is undefined.
- `createBrowserAdapter` subscribes only to `popstate` (external `pushState/replaceState` does not notify).
See the root README for full details.
