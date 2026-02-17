import type {
  QueryGuardOptions,
  QueryGuardAdapter,
  QueryHistoryMode,
  UnknownPolicy,
} from '@liha-labs/query-guard'
import type { ReactNode } from 'react'

export type QueryGuardConfig = {
  adapter?: QueryGuardAdapter
  history?: QueryHistoryMode
  unknownPolicy?: UnknownPolicy
}

export type QueryGuardProviderProps = QueryGuardConfig & {
  children: ReactNode
}

export type UseQueryGuardOptions<T extends Record<string, unknown>> =
  Partial<QueryGuardOptions<T>>
