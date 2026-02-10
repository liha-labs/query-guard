# @liha-labs/query-guard-react

React hook for `@liha-labs/query-guard`.

**ESM-only**  
Exports `import` + `types` via `exports`. No CommonJS build.

## Dependencies
- Peer: `react`
- Dependency: `@liha-labs/query-guard`

## Usage
```tsx
import { createBrowserAdapter } from '@liha-labs/query-guard'
import { useQueryGuard } from '@liha-labs/query-guard-react'

const resolver = {
  resolve: ({ raw }) => ({
    value: { page: Number(raw.page ?? 1) },
  }),
  serialize: (value) => ({ page: String(value.page) }),
}

function Pager() {
  const { queries, set } = useQueryGuard({
    adapter: createBrowserAdapter(),
    resolver,
    defaultValue: { page: 1 },
  })

  return (
    <button onClick={() => set({ page: queries.page + 1 })}>
      Next
    </button>
  )
}
```

## Notes
- `useQueryGuard` recreates the guard when `adapter`/`resolver`/`defaultValue` references change.
- For stable behavior, memoize those inputs (e.g. `useMemo`) when appropriate.
- Realtime updates depend on the adapter implementation.
- For SSR, do not use `createBrowserAdapter`; provide a custom adapter.
