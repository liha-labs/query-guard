import type { QueryRaw, QueryRawValue } from './types'

/**
 * Normalize search string to always start with '?'.
 */
export const normalizeSearch = (search: string): string => {
  if (!search) return '?'
  return search.startsWith('?') ? search : `?${search}`
}

/**
 * Parse a search string into raw query values.
 * Repeated keys are collected as `string[]`.
 */
export const parseSearchToRaw = (search: string): QueryRaw => {
  const s = normalizeSearch(search)
  const params = new URLSearchParams(s.startsWith('?') ? s.slice(1) : s)

  const out: QueryRaw = {}
  // URLSearchParams は同一キー複数を許容
  params.forEach((_value, key) => {
    if (Object.prototype.hasOwnProperty.call(out, key)) return
    const values = params.getAll(key)
    if (values.length === 1) out[key] = values[0]!
    else if (values.length > 1) out[key] = values
  })
  return out
}

/**
 * Convert raw query values to a normalized search string.
 */
export const rawToSearch = (raw: QueryRaw): string => {
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(raw)) {
    if (Array.isArray(value)) {
      for (const v of value) params.append(key, v)
    } else {
      params.set(key, value)
    }
  }
  const qs = params.toString()
  return qs ? `?${qs}` : '?'
}

/**
 * Shallow clone and omit a list of keys.
 */
export const omitKeys = (raw: QueryRaw, keys: string[]): QueryRaw => {
  const next: QueryRaw = { ...raw }
  for (const k of keys) delete next[k]
  return next
}

/**
 * Helper to check if a raw value is "empty" for cleanup decisions.
 */
export const isEmptyRawValue = (v: QueryRawValue): boolean => {
  if (Array.isArray(v)) return v.length === 0
  return false
}
