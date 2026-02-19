import type {
  QueryRaw,
  QueryResolver,
  ResolveResult,
} from '@liha-labs/query-guard'
import { z } from 'zod'

type Options<T> = {
  defaultValue?: T
}

/**
 * Zod-based resolver for the core.
 *
 * @remarks
 * - raw(string|string[]) is passed into Zod as-is.
 * - Use `z.coerce` to handle number/boolean conversions.
 * - URLSearchParams yields only strings, so schema is responsible for coercion.
 *
 * @example
 * ```ts
 * import { z } from 'zod'
 * import { zodResolver } from '@liha-labs/query-guard-resolvers'
 *
 * const resolver = zodResolver(
 *   z.object({
 *     page: z.coerce.number().int().min(1).default(1),
 *     q: z.string().default(''),
 *   })
 * )
 * ```
 */
export const zodResolver = <TSchema extends z.ZodTypeAny>(
  schema: TSchema,
  options?: Options<z.infer<TSchema>>
): QueryResolver<z.infer<TSchema>> => {
  const parsedDefault = schema.safeParse({})
  const inferredDefault = parsedDefault.success
    ? parsedDefault.data
    : undefined

  return {
    resolve(input): ResolveResult<z.infer<TSchema>> {
      const parsed = schema.safeParse(rawToObject(input.raw))
      if (!parsed.success) {
        const fallback = options?.defaultValue ?? inferredDefault
        if (fallback === undefined) {
          throw new Error(
            'zodResolver: defaultValue is required when schema has no defaults.'
          )
        }
        return {
          value: fallback,
          meta: {
            usedDefault: true,
            issues: parsed.error.issues.map((i) => ({
              path: i.path.join('.'),
              message: i.message,
              code: i.code,
            })),
          },
        }
      }
      return { value: parsed.data, meta: { usedDefault: false } }
    },

    serialize(value) {
      // zod の型を信じて raw にする（MVP: object -> raw の単純変換）
      return objectToRaw(value as Record<string, unknown>)
    },
  }
}

/**
 * raw -> object
 * - string[] はそのまま配列として渡す
 * - string は string
 */
const rawToObject = (raw: QueryRaw): Record<string, unknown> => {
  const obj: Record<string, unknown> = {}
  for (const [k, v] of Object.entries(raw)) obj[k] = v
  return obj
}

/**
 * object -> raw
 * - string/number/boolean は string 化
 * - array は string[] 化
 * - null/undefined は “削除扱い” (ここでは出力しない)
 * - object は JSON 文字列化（MVPの決め打ち。必要なら後で禁止/カスタム化）
 */
const objectToRaw = (obj: Record<string, unknown>): QueryRaw => {
  const raw: QueryRaw = {}

  for (const [k, v] of Object.entries(obj)) {
    if (v === undefined || v === null) continue

    if (Array.isArray(v)) {
      raw[k] = v.map((x) => String(x))
      continue
    }

    const t = typeof v
    if (t === 'string' || t === 'number' || t === 'boolean' || t === 'bigint') {
      raw[k] = String(v)
      continue
    }

    // object/function/symbol は JSON で押し込む（MVP）
    const json = JSON.stringify(v)
    if (json === undefined) continue
    raw[k] = json
  }

  return raw
}
