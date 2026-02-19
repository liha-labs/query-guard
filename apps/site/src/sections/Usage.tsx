import { CodeEditor, Section } from '../components'
import styles from './Usage.module.css'

export const Usage = () => {
  return (
    <Section
      id="usage"
      number="03"
      title="Usage"
      subTitle="実務の「困った」を解決する、逆引きリファレンス。"
    >
      <div className={styles.subSection}>
        <h3 className={styles.subTitle}>Create a guard</h3>
        <p className={styles.desc}>
          <code>createQueryGuard</code> に Adapter と Resolver を渡して作成します。
        </p>
        <CodeEditor
          filename="guard.ts"
          code={`
import { createBrowserAdapter, createQueryGuard } from '@liha-labs/query-guard'

const resolver = {
  resolve: ({ raw }) => ({ value: { q: raw.q ?? '' } }),
  serialize: (value) => ({ q: value.q })
}

const guard = createQueryGuard({
  adapter: createBrowserAdapter(),
  resolver,
  defaultValue: { q: '' }
})`}
        />
      </div>

      <div className={styles.subSection}>
        <h3 className={styles.subTitle}>Update & Delete</h3>
        <p className={styles.desc}>
          <code>set</code> の <code>undefined</code> は削除として扱われます。
        </p>
        <CodeEditor
          filename="update.ts"
          code={`
// setQueries: 完全な置き換え（serialize結果）
guard.setQueries({ q: 'hello' })

// set: patch（undefinedは削除）
guard.set({ q: undefined }) // URLから削除
          `}
        />
      </div>

      <div className={styles.subSection}>
        <h3 className={styles.subTitle}>Reset</h3>
        <p className={styles.desc}>
          <code>clear</code> は管轄キーを削除、<code>write-defaults</code> は既定値をURLへ書き込みます。
        </p>
        <CodeEditor
          filename="reset.ts"
          code={`
// clear: 管轄キーを削除
guard.reset({ mode: 'clear' })

// write-defaults: defaultValue を書き込み
guard.reset({ mode: 'write-defaults' })
          `}
        />
      </div>

      <div className={styles.subSection}>
        <h3 className={styles.subTitle}>History & unknownPolicy</h3>
        <p className={styles.desc}>
          History 更新方法と未知キーの扱いを制御できます。
        </p>
        <CodeEditor
          filename="policy.ts"
          code={`
const guard = createQueryGuard({
  adapter: createBrowserAdapter(),
  resolver,
  defaultValue: { page: 1 },
  history: 'push',
  unknownPolicy: 'drop'
})
          `}
        />
      </div>

      <div className={styles.subSection}>
        <h3 className={styles.subTitle}>React Hook</h3>
        <p className={styles.desc}>
          実運用では Provider に共通設定を集約し、画面ごとの差分だけ hook 側で上書きするのが分かりやすいです。
        </p>
        <CodeEditor
          filename="react-provider.tsx"
          code={`
import { QueryGuardProvider, useQueryGuard } from '@liha-labs/query-guard-react'
import { createBrowserAdapter } from '@liha-labs/query-guard'

const adapter = createBrowserAdapter()
const resolver = {
  resolve: ({ raw }) => ({
    value: { page: Number(raw.page ?? 1), q: String(raw.q ?? '') }
  }),
  serialize: (value) => ({
    page: String(value.page),
    q: value.q
  })
}

function App() {
  return (
    <QueryGuardProvider
      adapter={adapter}
      resolver={resolver}
      defaultValue={{ page: 1, q: '' }}
      history="replace"
      unknownPolicy="keep"
    >
      <Pager />
    </QueryGuardProvider>
  )
}

function Pager() {
  // Provider から resolver/defaultValue を引き継ぐ
  const { queries, set } = useQueryGuard<{ page: number; q: string }>()
  return <button onClick={() => set({ page: queries.page + 1 })}>Next</button>
}
          `}
        />
      </div>

      <div className={styles.subSection}>
        <h3 className={styles.subTitle}>React: Hook options で部分上書き</h3>
        <p className={styles.desc}>
          Provider の設定をベースにしつつ、1画面だけ history を変えたい場合の例です。
        </p>
        <CodeEditor
          filename="react-override.tsx"
          code={`
import { useQueryGuard } from '@liha-labs/query-guard-react'

function SearchPage() {
  const { queries, set } = useQueryGuard<{ page: number; q: string }>({
    history: 'push' // Provider の history をこの hook だけ上書き
  })

  const onSubmit = (nextQ: string) => set({ q: nextQ, page: 1 })
  return <button onClick={() => onSubmit('react')}>Search</button>
}
          `}
        />
      </div>

      <div className={styles.subSection}>
        <h3 className={styles.subTitle}>React: options なしで使う場合</h3>
        <p className={styles.desc}>
          何も渡さない場合は fallback が使われます。プロトタイピング向けで、実運用では Resolver の明示を推奨します。
        </p>
        <CodeEditor
          filename="react-minimal.tsx"
          code={`
function Prototype() {
  const { queries, set } = useQueryGuard()
  // fallback resolver: raw 値をそのまま扱う
  // fallback defaultValue: {}
  return <button onClick={() => set({ page: '2' })}>{String(queries.page ?? '1')}</button>
}
          `}
        />
      </div>

      <div className={styles.subSection}>
        <h3 className={styles.subTitle}>Zod Resolver</h3>
        <p className={styles.desc}>
          型変換は Zod 側に任せる構成です（<code>z.coerce</code> を利用）。
        </p>
        <CodeEditor
          filename="zod.ts"
          code={`
import { z } from 'zod'
import { zodResolver } from '@liha-labs/query-guard-resolvers'

const resolver = zodResolver(
  z.object({ page: z.coerce.number().int().min(1).default(1) })
)
          `}
        />
      </div>
    </Section>
  )
}
