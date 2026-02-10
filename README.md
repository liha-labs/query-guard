# Query Guard Monorepo

Packages:
- `@liha-labs/query-guard` (core): dependency-free core for URL query state
- `@liha-labs/query-guard-react`: React hook `useQueryGuard`
- `@liha-labs/query-guard-resolvers`: resolver utilities (e.g. `zodResolver`)

## Browser Adapter Notes
- `createBrowserAdapter` subscribes only to the `popstate` event.
- External `history.pushState` / `history.replaceState` calls do not trigger notifications.
- If you need real-time updates in frameworks like React/Next.js, provide a router-aware adapter that emits on your framework's navigation events.
- `getQueries` / `getRaw` / `getSearch` are pull-based, so reading on demand is still safe for non-realtime use.
