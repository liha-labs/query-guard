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
import { createBrowserAdapter, createQueryGuard } from 'query-guard'

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
          Provider で Adapter を共有すれば、<code>useQueryGuard</code> は最小オプションで使えます。
        </p>
        <CodeEditor
          filename="react.tsx"
          code={`
import { QueryGuardProvider, useQueryGuard } from '@liha-labs/query-guard-react'
import { createBrowserAdapter } from 'query-guard'

const adapter = createBrowserAdapter()

function App() {
  return (
    <QueryGuardProvider adapter={adapter} history="replace" unknownPolicy="keep">
      <Pager />
    </QueryGuardProvider>
  )
}

function Pager() {
  const { queries, set } = useQueryGuard({ resolver, defaultValue })
  return <button onClick={() => set({ page: queries.page + 1 })}>Next</button>
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
  z.object({ page: z.coerce.number().int().min(1).default(1) }),
  { defaultValue: { page: 1 } }
)
          `}
        />
      </div>
    </Section>
  )
}
