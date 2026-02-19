import type {
  QueryGuardOptions,
  QueryGuardAdapter,
  QueryHistoryMode,
  QueryResolver,
  UnknownPolicy,
} from '@liha-labs/query-guard'
import type { ReactNode } from 'react'

export type QueryGuardConfig = {
  adapter?: QueryGuardAdapter
  resolver?: QueryResolver<Record<string, unknown>>
  defaultValue?: Record<string, unknown>
  history?: QueryHistoryMode
  unknownPolicy?: UnknownPolicy
}

export type QueryGuardProviderProps = QueryGuardConfig & {
  children: ReactNode
}

export type UseQueryGuardOptions<T extends Record<string, unknown>> =
  Partial<QueryGuardOptions<T>>
