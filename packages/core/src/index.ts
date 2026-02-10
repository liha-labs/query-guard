/** Browser adapter for the core (browser-only). */
export { createBrowserAdapter } from './createBrowserAdapter'
/** Core query state manager. */
export { createQueryGuard } from './createQueryGuard'

export type {
  QueryGuard,
  QueryGuardAdapter,
  QueryGuardOptions,
  QueryHistoryMode,
  QueryPatch,
  QueryRaw,
  QueryRawValue,
  QueryResolver,
  ResetMode,
  ResolveInput,
  ResolveMeta,
  ResolveResult,
  UnknownPolicy,
  UpdateOptions,
} from './types'
