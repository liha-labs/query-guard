import { CodeEditor, Section } from '../components'
import styles from './QuickStart.module.css'

export const QuickStart = () => {
  const installCoreCode = `pnpm add @liha-labs/query-guard`
  const installReactCode = `pnpm add @liha-labs/query-guard-react react`
  const installZodCode = `pnpm add @liha-labs/query-guard-resolvers zod`

  const minimalCode = `
import { createBrowserAdapter, createQueryGuard } from '@liha-labs/query-guard'

const resolver = {
  resolve: ({ raw }) => ({ value: { q: raw.q ?? '' } }),
  serialize: (value) => ({ q: value.q })
}

const guard = createQueryGuard({
  adapter: createBrowserAdapter(),
  resolver,
  defaultValue: { q: '' }
})

guard.set({ q: 'hello' })
  `.trim()

  const typingCode = `
type Queries = {
  page: number
  q: string
}

const resolver = {
  resolve: ({ raw }) => ({
    value: {
      page: Number(raw.page ?? 1),
      q: raw.q ?? ''
    }
  }),
  serialize: (value: Queries) => ({
    page: String(value.page),
    q: value.q
  })
}
  `.trim()

  const policyCode = `
const guard = createQueryGuard({
  adapter: createBrowserAdapter(),
  resolver,
  defaultValue: { page: 1 },
  unknownPolicy: 'drop'
})

// URL上の未知キーを落として保存
guard.set({ page: 2 })
  `.trim()

  const reactCode = `
import { QueryGuardProvider, useQueryGuard } from '@liha-labs/query-guard-react'
import { createBrowserAdapter } from '@liha-labs/query-guard'

const adapter = createBrowserAdapter()
const resolver = {
  resolve: ({ raw }) => ({ value: { page: Number(raw.page ?? 1) } }),
  serialize: (value) => ({ page: String(value.page) })
}

function App() {
  return (
    <QueryGuardProvider adapter={adapter} resolver={resolver} defaultValue={{ page: 1 }}>
      <Pager />
    </QueryGuardProvider>
  )
}

function Pager() {
  const { queries, set } = useQueryGuard<{ page: number }>()
  return <button onClick={() => set({ page: queries.page + 1 })}>Next</button>
}
  `.trim()

  const zodCode = `
import { z } from 'zod'
import { createBrowserAdapter, createQueryGuard } from '@liha-labs/query-guard'
import { zodResolver } from '@liha-labs/query-guard-resolvers'

const schema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  q: z.string().default('')
})

const resolver = zodResolver(schema)

const guard = createQueryGuard({
  adapter: createBrowserAdapter(),
  resolver,
  defaultValue: { page: 1, q: '' }
})
  `.trim()

  return (
    <Section
      id="quickstart"
      number="02"
      title="Quick Start"
      subTitle="Adapter と Resolver を組み合わせて、URL クエリを型安全な状態に。"
    >
      <div className={styles.step}>
        <div className={styles.stepInfo}>
          <span className={styles.stepNumber}>STEP 01</span>
          <h4>Install Core</h4>
          <p>
            まずコアパッケージを追加します。
          </p>
        </div>
        <CodeEditor
          code={`$ ${installCoreCode}`}
          lang="bash"
          withHeader={false}
          filename="install-core"
        />
      </div>

      <div className={styles.step}>
        <div className={styles.stepInfo}>
          <span className={styles.stepNumber}>STEP 02</span>
          <h4>Minimal Usage</h4>
          <p>Adapter と Resolver を渡して guard を作成します。</p>
        </div>
        <CodeEditor code={minimalCode} filename="guard.ts" />
      </div>

      <div className={styles.step}>
        <div className={styles.stepInfo}>
          <span className={styles.stepNumber}>STEP 03</span>
          <h4>Typed Resolver</h4>
          <p>型付き Resolver で raw ↔ typed を明確化します。</p>
        </div>
        <CodeEditor code={typingCode} filename="resolver.ts" />
      </div>

      <div className={styles.step}>
        <div className={styles.stepInfo}>
          <span className={styles.stepNumber}>STEP 04</span>
          <h4>unknownPolicy</h4>
          <p>未知のキーを保持するか、落とすかを選択できます。</p>
        </div>
        <CodeEditor code={policyCode} filename="policy.ts" />
      </div>

      <div className={styles.step}>
        <div className={styles.stepInfo}>
          <span className={styles.stepNumber}>STEP 05</span>
          <h4>React Integration</h4>
          <p>
            React では <code>@liha-labs/query-guard-react</code> を追加し、Provider + Hook で使います。
          </p>
        </div>
        <CodeEditor
          code={`$ ${installReactCode}`}
          lang="bash"
          withHeader={false}
          filename="install-react"
        />
        <CodeEditor code={reactCode} filename="react.tsx" />
      </div>

      <div className={styles.step}>
        <div className={styles.stepInfo}>
          <span className={styles.stepNumber}>STEP 06</span>
          <h4>Zod Resolver</h4>
          <p>
            検証や型変換を入れる場合は <code>@liha-labs/query-guard-resolvers</code> を利用します。
          </p>
        </div>
        <CodeEditor
          code={`$ ${installZodCode}`}
          lang="bash"
          withHeader={false}
          filename="install-zod"
        />
        <CodeEditor code={zodCode} filename="zod.ts" />
      </div>
    </Section>
  )
}
