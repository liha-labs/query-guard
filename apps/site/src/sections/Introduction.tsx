import { Section } from '../components'
import styles from './Introduction.module.css'

export const Introduction = () => {
  return (
    <Section
      id="introduction"
      number="01"
      title="Introduction"
      subTitle="URL クエリを型安全に扱うための、依存ゼロコア + 追加パッケージ構成。"
    >
      <div className={styles.leadBlock}>
        <h3>What is query-guard?</h3>
        <p>
          query-guard は URL クエリ（search params）をアプリの状態として扱うための
          TypeScript ライブラリです。<code>URLSearchParams</code> を基盤にしつつ、
          Resolver によって型を保証します。
        </p>
      </div>

      <div className={styles.philosophyGrid}>
        <div className={styles.philosophyColumn}>
          <h4 className={styles.label}>Design goals</h4>
          <ul className={styles.list}>
            <li>
              <span className={styles.itemTitle}>dependency-free</span>
              <span className={styles.itemDesc}>コアは依存ゼロ。必要に応じて拡張。</span>
            </li>
            <li>
              <span className={styles.itemTitle}>standards</span>
              <span className={styles.itemDesc}>URLSearchParams など Web 標準に準拠。</span>
            </li>
            <li>
              <span className={styles.itemTitle}>TS-friendly</span>
              <span className={styles.itemDesc}>型推論と明確な API で事故を減らす。</span>
            </li>
            <li>
              <span className={styles.itemTitle}>adapter-based</span>
              <span className={styles.itemDesc}>環境に合わせた Adapter で拡張可能。</span>
            </li>
          </ul>
        </div>

        <div className={styles.philosophyColumn}>
          <h4 className={`${styles.label} ${styles.danger}`}>Non-goals</h4>
          <ul className={styles.list}>
            <li>
              <span className={styles.itemTitle}>router-specific</span>
              <span className={styles.itemDesc}>特定ルーターへの深い統合は行いません。</span>
            </li>
            <li>
              <span className={styles.itemTitle}>implicit coercion</span>
              <span className={styles.itemDesc}>型変換は Resolver に委譲します。</span>
            </li>
            <li>
              <span className={styles.itemTitle}>nested params</span>
              <span className={styles.itemDesc}>
                <code>{`{ a: { b: 1 } }`}</code> のような深い構造は対象外。
              </span>
            </li>
          </ul>
        </div>
      </div>

      <div className={styles.featureSection}>
        <div className={styles.sectionHeader}>
          <h3 className={styles.subTitle}>Features</h3>
          <p className={styles.subLead}>シンプルなコアと、必要に応じて追加できる拡張。</p>
        </div>
        <div className={styles.featureTable}>
          {[
            { name: 'Resolver', desc: 'raw ↔ typed の変換を明示化。' },
            { name: 'unknownPolicy', desc: '未知キーの保持/除外を制御。' },
            { name: 'reset modes', desc: 'clear / write-defaults を選択。' },
            { name: 'Adapter', desc: '環境ごとの検索文字列の読み書きを分離。' },
            { name: 'React hook', desc: 'Provider で共通設定を共有。' },
            { name: 'Zod resolver', desc: 'zod で検証・型変換を追加。' },
          ].map((f) => (
            <div key={f.name} className={styles.featureItem}>
              <span className={styles.featureName}>{f.name}</span>
              <span className={styles.featureDesc}>{f.desc}</span>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.compSection}>
        <h3 className={styles.subTitle}>Compatibility</h3>
        <div className={styles.compRows}>
          <div className={styles.compRow}>
            <div className={styles.compLabel}>Environment</div>
            <div className={styles.compValues}>
              <span className={styles.compTag}>Browser (createBrowserAdapter)</span>
              <span className={styles.compTag}>SSR (custom adapter)</span>
            </div>
          </div>
          <div className={styles.compRow}>
            <div className={styles.compLabel}>Integration</div>
            <div className={styles.compValues}>
              <span className={styles.compTag}>React</span>
              <span className={styles.compTag}>Next.js</span>
              <span className={styles.compTag}>Custom Routers</span>
            </div>
          </div>
        </div>
      </div>
    </Section>
  )
}
