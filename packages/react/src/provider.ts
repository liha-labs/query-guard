import type { QueryGuardConfig, QueryGuardProviderProps } from './types'
import { createContext, createElement, useMemo } from 'react'

export const QueryGuardConfigContext =
  createContext<QueryGuardConfig | null>(null)

/**
 * Provider for default query-guard config in React.
 *
 * @remarks
 * - Use this to avoid passing `adapter`/`resolver`/`defaultValue`/`history`/`unknownPolicy` on every hook.
 * - For SSR, provide a custom adapter via this provider or hook options.
 *
 * @example
 * ```tsx
 * import { QueryGuardProvider } from '@liha-labs/query-guard-react'
 * import { createBrowserAdapter } from '@liha-labs/query-guard'
 *
 * const adapter = createBrowserAdapter()
 *
 * function App() {
 *   return (
 *     <QueryGuardProvider adapter={adapter} history="replace" unknownPolicy="keep">
 *       <Routes />
 *     </QueryGuardProvider>
 *   )
 * }
 * ```
 */
export const QueryGuardProvider = ({
  adapter,
  resolver,
  defaultValue,
  history,
  unknownPolicy,
  children,
}: QueryGuardProviderProps) => {
  const value = useMemo(
    () => ({ adapter, resolver, defaultValue, history, unknownPolicy }),
    [adapter, resolver, defaultValue, history, unknownPolicy]
  )
  return createElement(QueryGuardConfigContext.Provider, { value }, children)
}
