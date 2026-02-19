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
  const { queries, set } = useQueryGuard<{ page: number; q: string }>()
  return <button onClick={() => set({ page: queries.page + 1 })}>Next</button>
}
          `}
        />
      </div>

      <div className={styles.exampleBlock} id="examples-react-override">
        <header className={styles.exampleHeader}>
          <div className={styles.titleArea}>
            <h3 className={styles.exampleTitle}>Hook Override</h3>
            <div className={styles.chips}>
              <span>react</span>
              <span>override</span>
            </div>
          </div>
          <p className={styles.exampleDesc}>
            Provider をベースにしつつ、一部オプションだけ hook 側で上書きできます。
          </p>
        </header>
        <CodeEditor
          filename="react-override.tsx"
          code={`
import { useQueryGuard } from '@liha-labs/query-guard-react'

function SearchPage() {
  const { queries, set } = useQueryGuard<{ page: number; q: string }>({
    history: 'push'
  })

  const goNext = () => set({ page: queries.page + 1 })
  return <button onClick={goNext}>Next</button>
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
import { createBrowserAdapter, createQueryGuard } from '@liha-labs/query-guard'

const resolver = {
  resolve: ({ raw }) => ({ value: { page: Number(raw.page ?? 1) } }),
  serialize: (value) => ({ page: String(value.page) })
}

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
  z.object({ page: z.coerce.number().int().min(1).default(1) })
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
          filename="ssr-react.tsx"
          code={`
import { QueryGuardProvider, useQueryGuard } from '@liha-labs/query-guard-react'

const adapter = {
  getSearch: () => '?page=1',
  setSearch: () => {},
  subscribe: () => () => {}
}

const resolver = {
  resolve: ({ raw }) => ({ value: { page: Number(raw.page ?? 1) } }),
  serialize: (value) => ({ page: String(value.page) })
}

function Page() {
  return (
    <QueryGuardProvider adapter={adapter} resolver={resolver} defaultValue={{ page: 1 }}>
      <Inner />
    </QueryGuardProvider>
  )
}

function Inner() {
  const { queries } = useQueryGuard<{ page: number }>()
  return <p>{queries.page}</p>
}
          `}
        />
      </div>
    </Section>
  )
}
