# query-guard

Type-safe URL query state for TypeScript apps.  
Core is dependency-free, with optional React hook and Zod resolver packages.

**ESM-only**  
All packages are ESM-only and ship `exports` with `import` + `types`.

## Packages
- `query-guard`  
Core-only alias of `@liha-labs/query-guard` (convenience package).
- `@liha-labs/query-guard`  
Core: `createQueryGuard`, `createBrowserAdapter`, and types. No dependencies.
- `@liha-labs/query-guard-react`  
React hook: `useQueryGuard`. React is a peer dependency.
- `@liha-labs/query-guard-resolvers`  
Resolvers: `zodResolver` (this package is the only one that depends on `zod`).

Install (pnpm):
```sh
pnpm add query-guard
pnpm add @liha-labs/query-guard
pnpm add @liha-labs/query-guard-react react
pnpm add @liha-labs/query-guard-resolvers zod
```

## Quick Start
```tsx
import { QueryGuardProvider, useQueryGuard } from '@liha-labs/query-guard-react'
import { createBrowserAdapter } from 'query-guard'
import { zodResolver } from '@liha-labs/query-guard-resolvers'
import { z } from 'zod'

const adapter = createBrowserAdapter()
const schema = z.object({ page: z.coerce.number().int().min(1).catch(1) })
const defaultValue = { page: 1 }
const resolver = zodResolver(schema, { defaultValue })

function App() {
  return (
    <QueryGuardProvider adapter={adapter} history="replace" unknownPolicy="keep">
      <Pager />
    </QueryGuardProvider>
  )
}

function Pager() {
  const { queries, set } = useQueryGuard({ resolver, defaultValue })
  return <button onClick={() => set({ page: queries.page + 1 })}>Next</button>
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
- In SSR/non-browser environments, provide a custom adapter via Provider or hook options.

## API (Overview)
- Core: `createQueryGuard`, `createBrowserAdapter`, `QueryGuardAdapter`, `QueryResolver`, `QueryRaw`, `QueryGuardOptions`
- React: `QueryGuardProvider`, `useQueryGuard`
- Resolvers: `zodResolver`

Details are in TypeScript types and JSDoc for each package.

## Monorepo Scripts
- `pnpm -r typecheck`
- `pnpm -r build`
- `pnpm -r lint`

## License / Contributing
MIT. Contributions welcome via issues and PRs.
