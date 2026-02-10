import { CodeEditor, Section } from '../components'
import styles from './QuickStart.module.css'

export const QuickStart = () => {
  const installCode = `pnpm add query-guard`

  const minimalCode = `
import { createBrowserAdapter, createQueryGuard } from 'query-guard'

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
await guard.set({ page: 2 })
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
          <h4>Install</h4>
          <p>
            標準として <code>pnpm</code> を推奨します。
          </p>
        </div>
        <CodeEditor
          code={`$ ${installCode}`}
          lang="bash"
          withHeader={false}
          filename="install"
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
    </Section>
  )
}
