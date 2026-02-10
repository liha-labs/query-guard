# query-guard

Type-safe URL query state for TypeScript apps.  
Core is dependency-free, with optional React hook and Zod resolver packages.

**ESM-only**  
All packages are ESM-only and ship `exports` with `import` + `types`.

## Packages
- `@liha-labs/query-guard`  
Core: `createQueryGuard`, `createBrowserAdapter`, and types. No dependencies.
- `@liha-labs/query-guard-react`  
React hook: `useQueryGuard`. React is a peer dependency.
- `@liha-labs/query-guard-resolvers`  
Resolvers: `zodResolver` (this package is the only one that depends on `zod`).

Install (pnpm):
```sh
pnpm add @liha-labs/query-guard
pnpm add @liha-labs/query-guard-react react
pnpm add @liha-labs/query-guard-resolvers zod
```

## Quick Start
```tsx
import { createBrowserAdapter, createQueryGuard } from '@liha-labs/query-guard'
import { useQueryGuard } from '@liha-labs/query-guard-react'
import { z } from 'zod'
import { zodResolver } from '@liha-labs/query-guard-resolvers'

const resolver = zodResolver(
  z.object({
    page: z.coerce.number().int().min(1).default(1),
    q: z.string().default(''),
  }),
  { defaultValue: { page: 1, q: '' } }
)

const guard = createQueryGuard({
  adapter: createBrowserAdapter(),
  resolver,
  defaultValue: { page: 1, q: '' },
  unknownPolicy: 'keep',
})

function App() {
  const { queries, set } = useQueryGuard({
    adapter: createBrowserAdapter(),
    resolver,
    defaultValue: { page: 1, q: '' },
  })

  return (
    <button onClick={() => set({ page: queries.page + 1 })}>
      Next page
    </button>
  )
}
```

## Concepts
- Adapter  
Provides `getSearch`, `setSearch`, and `subscribe`. Core does not depend on browser APIs.
- Resolver  
Converts between raw query values and typed state.
- Queries (typed)  
Your app-facing, typed object state.
- Raw (querystring)  
`QueryRaw` is `Record<string, string | string[]>` derived from `URLSearchParams`.

## History API Notification Policy
- `createBrowserAdapter` subscribes only to `popstate`.
- External `history.pushState` / `history.replaceState` do not trigger notifications.
- If you need realtime updates, use a router-aware adapter for your framework.
- `getQueries` / `getRaw` / `getSearch` are pull-based, so reading on demand is safe.

## SSR
- `createBrowserAdapter` is browser-only and throws when `window` is undefined.
- In SSR/non-browser environments, provide a custom adapter.

## API (Overview)
- Core: `createQueryGuard`, `createBrowserAdapter`, `QueryGuardAdapter`, `QueryResolver`, `QueryRaw`, `QueryGuardOptions`
- React: `useQueryGuard`
- Resolvers: `zodResolver`

Details are in TypeScript types and JSDoc for each package.

## Monorepo Scripts
- `pnpm -r typecheck`
- `pnpm -r build`
- `pnpm -r lint`

## License / Contributing
MIT. Contributions welcome via issues and PRs.
