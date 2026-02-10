import type { QueryGuard, QueryGuardOptions } from '@liha-labs/query-guard'
import { createBrowserAdapter, createQueryGuard } from '@liha-labs/query-guard'
import { useContext, useMemo, useRef, useSyncExternalStore } from 'react'
import { QueryGuardConfigContext } from './provider'

type Snapshot<T extends Record<string, unknown>> = {
  queries: T
  raw: ReturnType<QueryGuard<T>['getRaw']>
  meta: ReturnType<QueryGuard<T>['getMeta']>
  search: ReturnType<QueryGuard<T>['getSearch']>
}

/**
 * React hook wrapper for the core `createQueryGuard`.
 *
 * @remarks
 * - T is constrained to object-like types because updates are key-based.
 * - Realtime updates depend on the adapter implementation.
 * - For SSR, do not use `createBrowserAdapter`. Provide a custom adapter instead.
 * - If no adapter is provided and no Provider exists:
 *   - browser: `createBrowserAdapter()` is used
 *   - non-browser: throws to avoid SSR misuse
 *
 * @example
 * ```tsx
 * import { createBrowserAdapter } from '@liha-labs/query-guard'
 * import { useQueryGuard } from '@liha-labs/query-guard-react'
 *
 * const guard = useQueryGuard({
 *   adapter: createBrowserAdapter(),
 *   resolver,
 *   defaultValue: { page: 1 },
 * })
 * ```
 */
export const useQueryGuard = <T extends Record<string, unknown>>(
  options: QueryGuardOptions<T>
) => {
  const config = useContext(QueryGuardConfigContext)

  const resolvedAdapter = useMemo(() => {
    if (options.adapter) return options.adapter
    if (config?.adapter) return config.adapter
    if (typeof window === 'undefined') {
      throw new Error(
        'useQueryGuard: adapter is required in non-browser environments.'
      )
    }
    return createBrowserAdapter()
  }, [options.adapter, config?.adapter])

  const resolvedHistory = options.history ?? config?.history
  const resolvedUnknownPolicy = options.unknownPolicy ?? config?.unknownPolicy

  const guard: QueryGuard<T> = useMemo(
    () =>
      createQueryGuard({
        adapter: resolvedAdapter,
        resolver: options.resolver,
        defaultValue: options.defaultValue,
        history: resolvedHistory,
        unknownPolicy: resolvedUnknownPolicy,
      }),
    [
      // adapter/resolver/defaultValue の参照が変わると作り直す（MVP）
      resolvedAdapter,
      options.resolver,
      options.defaultValue,
      resolvedUnknownPolicy,
      resolvedHistory,
    ]
  )

  const snapshotRef = useRef<{ search: string; snapshot: Snapshot<T> } | null>(
    null
  )

  const getSnapshot = (): Snapshot<T> => {
    const search = guard.getSearch()
    const cached = snapshotRef.current
    if (cached && cached.search === search) return cached.snapshot

    const next: Snapshot<T> = {
      queries: guard.getQueries(),
      raw: guard.getRaw(),
      meta: guard.getMeta(),
      search,
    }
    snapshotRef.current = { search, snapshot: next }
    return next
  }

  const snapshot = useSyncExternalStore(guard.subscribe, getSnapshot, getSnapshot)

  return {
    queries: snapshot.queries,
    raw: snapshot.raw,
    meta: snapshot.meta,
    search: snapshot.search,

    setQueries: guard.setQueries,
    set: guard.set,
    reset: guard.reset,
  }
}
