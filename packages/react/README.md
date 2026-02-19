# @liha-labs/query-guard-react

React hook for `@liha-labs/query-guard`.

**ESM-only**  
Exports `import` + `types` via `exports`. No CommonJS build.

## Dependencies
- Peer: `react`
- Dependency: `@liha-labs/query-guard`

## How It Resolves Options
`useQueryGuard` resolves each option in this order:

1. Hook options (`useQueryGuard({...})`)
2. Provider defaults (`<QueryGuardProvider ...>`)
3. Built-in fallback

Built-in fallbacks:
- `adapter`: browser only (`createBrowserAdapter()`). In non-browser, throws.
- `resolver`: passthrough resolver (`raw` as-is, serialize via `String(...)`).
- `defaultValue`: `{}`
- `unknownPolicy`: if `defaultValue` is missing and requested policy is `drop`, it falls back to `keep` to avoid dropping everything.

## Usage
### 1) Provider-driven (recommended)
```tsx
import { QueryGuardProvider, useQueryGuard } from '@liha-labs/query-guard-react'
import { createBrowserAdapter } from '@liha-labs/query-guard'

const resolver = {
  resolve: ({ raw }) => ({
    value: { page: Number(raw.page ?? 1) },
  }),
  serialize: (value) => ({ page: String(value.page) }),
}

const adapter = createBrowserAdapter()

function App() {
  return (
    <QueryGuardProvider
      adapter={adapter}
      resolver={resolver}
      defaultValue={{ page: 1 }}
      history="replace"
      unknownPolicy="keep"
    >
      <Pager />
    </QueryGuardProvider>
  )
}

function Pager() {
  const { queries, set } = useQueryGuard<{ page: number }>()

  return (
    <button onClick={() => set({ page: queries.page + 1 })}>
      Next
    </button>
  )
}
```

### 2) Per-hook options (without Provider)
```tsx
import { useQueryGuard } from '@liha-labs/query-guard-react'

function Pager() {
  const { queries, set } = useQueryGuard({
    resolver,
    defaultValue: { page: 1 },
    history: 'replace',
    unknownPolicy: 'keep',
  })

  return <button onClick={() => set({ page: queries.page + 1 })}>Next</button>
}
```

### 3) Override Provider defaults in one place
```tsx
const { set } = useQueryGuard<{ page: number }>({
  history: 'push', // overrides Provider history only for this hook
})
```

### 4) Minimal mode (no options)
```tsx
const guard = useQueryGuard()
```
- Useful for quick prototyping.
- For production, define at least `resolver` and `defaultValue` (Provider or hook) for predictable typed behavior.

## Notes
- `useQueryGuard` recreates the guard when resolved `adapter`/`resolver`/`defaultValue`/`history`/`unknownPolicy` references change.
- For stable behavior, memoize Provider values and hook inputs (e.g. `useMemo`) when appropriate.
- Realtime updates depend on the adapter implementation.
- For SSR, do not use `createBrowserAdapter`; provide a custom adapter via Provider or hook options.
