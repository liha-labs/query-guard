/**
 * Raw query value used by the core.
 * `URLSearchParams` yields only strings, and repeated keys become `string[]`.
 */
export type QueryRawValue = string | string[]
/**
 * Raw query map keyed by parameter name.
 */
export type QueryRaw = Record<string, QueryRawValue>

/**
 * History update mode for writing to the URL.
 */
export type QueryHistoryMode = 'replace' | 'push'
/**
 * Unknown key policy for query updates.
 * - `keep`: preserve keys not owned by the guard
 * - `drop`: remove unknown keys when writing
 */
export type UnknownPolicy = 'keep' | 'drop'
/**
 * Reset behavior.
 * - `clear`: remove owned keys from the URL
 * - `write-defaults`: serialize `defaultValue` into the URL
 */
export type ResetMode = 'clear' | 'write-defaults'

/**
 * Options for URL updates.
 */
export type UpdateOptions = {
  history?: QueryHistoryMode
}

/**
 * Adapter interface to read/write and subscribe to URL changes.
 * Core does not depend on browser APIs; adapters provide that behavior.
 */
export type QueryGuardAdapter = {
  getSearch(): string
  setSearch(nextSearch: string, options?: UpdateOptions): void
  subscribe(listener: () => void): () => void
}

/**
 * Input passed to a resolver.
 */
export type ResolveInput = {
  search: string
  raw: QueryRaw
}

/**
 * Validation or coercion issue returned by a resolver.
 */
export type ResolveIssue = {
  path?: string
  message: string
  code?: string
}

/**
 * Metadata for resolver output.
 */
export type ResolveMeta = {
  usedDefault?: boolean
  issues?: ResolveIssue[]
  coercedKeys?: string[]
  cleanedKeys?: string[]
}

/**
 * Resolver result.
 */
export type ResolveResult<T> = {
  value: T
  meta?: ResolveMeta
}

/**
 * Query resolver contract.
 * - `resolve` maps raw URL data to typed value
 * - `serialize` maps typed value back to raw data
 */
export type QueryResolver<T> = {
  resolve(input: ResolveInput): ResolveResult<T>
  serialize(value: T): QueryRaw
}

/**
 * Patch update for `set()`.
 * `undefined` means delete the key from the typed state and URL.
 */
export type QueryPatch<T extends Record<string, unknown>> =
  | Partial<{ [K in keyof T]: T[K] | undefined }>
  | ((prev: T) => Partial<{ [K in keyof T]: T[K] | undefined }>)

/**
 * Options for `createQueryGuard`.
 * T is constrained to object-like types because updates are key-based.
 */
export type QueryGuardOptions<T extends Record<string, unknown>> = {
  adapter: QueryGuardAdapter
  resolver: QueryResolver<T>
  defaultValue: T
  unknownPolicy?: UnknownPolicy
  history?: QueryHistoryMode
}

/**
 * Core API for query state.
 * T is constrained to object-like types because updates are key-based.
 */
export type QueryGuard<T extends Record<string, unknown>> = {
  getSearch(): string
  getRaw(): QueryRaw
  getQueries(): T
  getMeta(): ResolveMeta

  setQueries(next: T, options?: UpdateOptions): void
  set(patch: QueryPatch<T>, options?: UpdateOptions): void
  reset(options?: UpdateOptions & { mode?: ResetMode }): void

  subscribe(listener: () => void): () => void
}
