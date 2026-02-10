import { CodeEditor, Section } from '../components'
import styles from './Examples.module.css'

export const Examples = () => {
  return (
    <Section
      id="examples"
      number="05"
      title="Examples"
      subTitle="最小構成のまま、実務に合わせて拡張していく例。"
    >
      <div className={styles.exampleBlock} id="examples-react">
        <header className={styles.exampleHeader}>
          <div className={styles.titleArea}>
            <h3 className={styles.exampleTitle}>Provider + Hook</h3>
            <div className={styles.chips}>
              <span>react</span>
              <span>provider</span>
            </div>
          </div>
          <p className={styles.exampleDesc}>
            Adapter / policy を Provider で共有し、hook 側は最小オプションに。
          </p>
        </header>
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

      <div className={styles.exampleBlock} id="examples-unknown-policy">
        <header className={styles.exampleHeader}>
          <div className={styles.titleArea}>
            <h3 className={styles.exampleTitle}>unknownPolicy</h3>
            <div className={styles.chips}>
              <span>drop</span>
              <span>keep</span>
            </div>
          </div>
          <p className={styles.exampleDesc}>
            URL に混在する未知キーを保持するか、落とすかを選べます。
          </p>
        </header>
        <CodeEditor
          filename="policy.ts"
          code={`
const guard = createQueryGuard({
  adapter: createBrowserAdapter(),
  resolver,
  defaultValue: { page: 1 },
  unknownPolicy: 'drop'
})

// URL から未知キーを除去して保存
guard.set({ page: 2 })
          `}
        />
      </div>

      <div className={styles.exampleBlock} id="examples-zod">
        <header className={styles.exampleHeader}>
          <div className={styles.titleArea}>
            <h3 className={styles.exampleTitle}>Zod Resolver</h3>
            <div className={styles.chips}>
              <span>zod</span>
              <span>coerce</span>
            </div>
          </div>
          <p className={styles.exampleDesc}>
            型変換は Zod に任せる構成。<code>z.coerce</code> を使います。
          </p>
        </header>
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

      <div className={styles.exampleBlock} id="examples-ssr">
        <header className={styles.exampleHeader}>
          <div className={styles.titleArea}>
            <h3 className={styles.exampleTitle}>SSR Adapter</h3>
            <div className={styles.chips}>
              <span>ssr</span>
              <span>custom</span>
            </div>
          </div>
          <p className={styles.exampleDesc}>
            非ブラウザ環境では Adapter を自作して注入します。
          </p>
        </header>
        <CodeEditor
          filename="adapter.ts"
          code={`
const adapter = {
  getSearch: () => '?page=1',
  setSearch: () => {},
  subscribe: () => () => {}
}

const guard = createQueryGuard({
  adapter,
  resolver,
  defaultValue: { page: 1 }
})
          `}
        />
      </div>
    </Section>
  )
}
