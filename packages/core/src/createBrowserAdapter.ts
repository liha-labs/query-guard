import type { QueryGuardAdapter, UpdateOptions } from './types'
import { normalizeSearch } from './utils'

/**
 * Browser adapter for the core.
 *
 * @remarks
 * - Browser-only. This function throws on SSR/non-browser environments.
 * - Subscribes only to `popstate`. External `pushState/replaceState` does not notify.
 * - If you need realtime updates, provide a router/framework-aware adapter.
 * - Pull-based reads (`getSearch`/`getRaw`/`getQueries`) are safe when called on demand.
 *
 * @throws Error when called outside of a browser environment.
 *
 * @example
 * ```ts
 * import { createBrowserAdapter, createQueryGuard } from '@liha-labs/query-guard'
 *
 * const guard = createQueryGuard({
 *   adapter: createBrowserAdapter(),
 *   resolver,
 *   defaultValue,
 * })
 * ```
 */
export const createBrowserAdapter = (): QueryGuardAdapter => {
  if (typeof window === 'undefined') {
    throw new Error('createBrowserAdapter is browser-only.')
  }

  // pushState/replaceState はイベントが出ないので adapter 内部で通知する
  const listeners = new Set<() => void>()
  const notify = () => {
    for (const l of listeners) l()
  }

  const setWithHistory = (nextSearch: string, options?: UpdateOptions) => {
    const historyMode = options?.history ?? 'replace'
    const url = new URL(window.location.href)
    url.search = normalizeSearch(nextSearch)

    if (historyMode === 'push') window.history.pushState({}, '', url)
    else window.history.replaceState({}, '', url)

    notify()
  }

  const onPopState = () => notify()
  const attachPopState = () => {
    window.addEventListener('popstate', onPopState)
  }
  const detachPopState = () => {
    window.removeEventListener('popstate', onPopState)
  }

  return {
    getSearch() {
      return window.location.search || '?'
    },
    setSearch(nextSearch, options) {
      setWithHistory(nextSearch, options)
    },
    subscribe(listener) {
      if (listeners.size === 0) attachPopState()
      listeners.add(listener)
      return () => {
        listeners.delete(listener)
        if (listeners.size === 0) detachPopState()
      }
    },
  }
}
