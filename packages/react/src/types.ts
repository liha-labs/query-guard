import type {
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
