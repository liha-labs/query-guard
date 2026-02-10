import type {
  QueryGuard,
  QueryGuardOptions,
  QueryPatch,
  QueryRaw,
  ResolveMeta,
  UpdateOptions,
} from './types'
import {
  normalizeSearch,
  omitKeys,
  parseSearchToRaw,
  rawToSearch,
} from './utils'

const applyUnknownPolicy = (
  raw: QueryRaw,
  allowedKeys: string[],
  policy: 'keep' | 'drop'
): QueryRaw => {
  if (policy === 'keep') return raw
  // drop: allowedKeys 以外を落とす
  const set = new Set(allowedKeys)
  const next: QueryRaw = {}
  for (const [k, v] of Object.entries(raw)) {
    if (set.has(k)) next[k] = v
  }
  return next
}

/**
 * Core query state manager.
 *
 * @remarks
 * - T is constrained to object-like types because updates are key-based.
 * - `unknownPolicy` controls how non-owned keys are handled on write.
 * - `set()` treats `undefined` as deletion and removes the key from the URL.
 * - `reset()` supports `clear` (remove owned keys) or `write-defaults`.
 *
 * @example
 * ```ts
 * import { createBrowserAdapter, createQueryGuard } from '@liha-labs/query-guard'
 *
 * const guard = createQueryGuard({
 *   adapter: createBrowserAdapter(),
 *   resolver,
 *   defaultValue: { page: 1, q: '' },
 *   unknownPolicy: 'keep',
 * })
 *
 * guard.set({ page: 2 })
 * ```
 */
export const createQueryGuard = <T extends Record<string, unknown>>(
  options: QueryGuardOptions<T>
): QueryGuard<T> => {
  const {
    adapter,
    resolver,
    defaultValue,
    unknownPolicy = 'keep',
    history: defaultHistory = 'replace',
  } = options

  const listeners = new Set<() => void>()

  let cacheSearch = normalizeSearch(adapter.getSearch())
  let cacheRaw = parseSearchToRaw(cacheSearch)
  let cacheQueries: T = defaultValue
  let cacheMeta: ResolveMeta = { usedDefault: true }

  const recompute = () => {
    const nextSearch = normalizeSearch(adapter.getSearch())
    if (nextSearch === cacheSearch) return

    cacheSearch = nextSearch
    cacheRaw = parseSearchToRaw(nextSearch)

    const resolved = resolver.resolve({ search: cacheSearch, raw: cacheRaw })
    cacheQueries = resolved.value
    cacheMeta = resolved.meta ?? {}
  }

  const notify = () => {
    for (const l of listeners) l()
  }

  // adapter からの変更を拾う
  const unsubscribeAdapter = adapter.subscribe(() => {
    recompute()
    notify()
  })

  const writeRaw = (nextRaw: QueryRaw, uopts?: UpdateOptions) => {
    const nextSearch = rawToSearch(nextRaw)
    adapter.setSearch(nextSearch, { history: uopts?.history ?? defaultHistory })
    // adapter 側 setSearch が通知してくれるが、環境によっては無い可能性もあるので保険
    recompute()
    notify()
  }

  const patchQueriesToRaw = (
    prev: T,
    patch: QueryPatch<T>
  ): { nextQueries: T; deletedKeys: string[] } => {
    const basePatch = typeof patch === 'function' ? patch(prev) : patch
    const deletedKeys: string[] = []
    const nextQueries = { ...(prev as any) } as any

    for (const [k, v] of Object.entries(basePatch as Record<string, unknown>)) {
      if (v === undefined) {
        delete nextQueries[k]
        deletedKeys.push(k)
      } else {
        nextQueries[k] = v
      }
    }
    return { nextQueries: nextQueries as T, deletedKeys }
  }

  const getAllowedKeysFromDefault = (): string[] => {
    // defaultValue のキーを管轄キーとして扱う（MVPの決め打ち）
    // schema にあるが default に無いキーがあるケースは、後で resolver 側から keys を供給する設計に拡張できる
    if (defaultValue && typeof defaultValue === 'object') {
      return Object.keys(defaultValue as any)
    }
    return []
  }

  const allowedKeys = getAllowedKeysFromDefault()

  // 初期計算
  {
    const resolved = resolver.resolve({ search: cacheSearch, raw: cacheRaw })
    cacheQueries = resolved.value
    cacheMeta = resolved.meta ?? {}
  }

  return {
    getSearch() {
      recompute()
      return cacheSearch
    },
    getRaw() {
      recompute()
      return cacheRaw
    },
    getQueries() {
      recompute()
      return cacheQueries
    },
    getMeta() {
      recompute()
      return cacheMeta
    },

    setQueries(next, uopts) {
      recompute()
      const nextRawTyped = resolver.serialize(next)
      const baseRaw = unknownPolicy === 'keep' ? cacheRaw : {}
      const nextRaw =
        unknownPolicy === 'keep'
          ? { ...baseRaw, ...nextRawTyped }
          : applyUnknownPolicy(nextRawTyped, allowedKeys, 'drop')
      writeRaw(nextRaw, uopts)
    },

    set(patch, uopts) {
      recompute()
      const { nextQueries, deletedKeys } = patchQueriesToRaw(
        cacheQueries,
        patch
      )
      const nextRawTyped = resolver.serialize(nextQueries)

      let baseRaw: QueryRaw = cacheRaw
      if (unknownPolicy === 'drop')
        baseRaw = applyUnknownPolicy(cacheRaw, allowedKeys, 'drop')

      // deletedKeys は URL からも消す（typed serialize に任せず確実に）
      const rawWithoutDeleted = omitKeys(baseRaw, deletedKeys)

      // typed を反映
      const merged = { ...rawWithoutDeleted, ...nextRawTyped }
      writeRaw(merged, uopts)
    },

    reset(uopts) {
      recompute()
      const mode = uopts?.mode ?? 'clear'
      const history = uopts?.history

      if (mode === 'write-defaults') {
        const nextRawTyped = resolver.serialize(defaultValue)
        const baseRaw = unknownPolicy === 'keep' ? cacheRaw : {}
        const nextRaw =
          unknownPolicy === 'keep'
            ? { ...baseRaw, ...nextRawTyped }
            : nextRawTyped
        writeRaw(nextRaw, { history })
        return
      }

      // clear: 管轄キーを URL から消す（MVP: defaultValueのキーを管轄と見なす）
      const nextRaw = omitKeys(cacheRaw, allowedKeys)
      writeRaw(nextRaw, { history })
    },

    subscribe(listener) {
      listeners.add(listener)
      return () => {
        listeners.delete(listener)
        // 全部いなくなったら adapter unsubscribe するのもできるが MVP では省略
        // （必要なら後で QueryGuard.destroy() 追加）
      }
    },
  }
}
