import { Section } from '../components'
import styles from './ApiReference.module.css'

export const ApiReference = () => {
  return (
    <Section
      id="reference"
      number="04"
      title="API Reference"
      subTitle="query-guard の主要 API と基本仕様。"
    >
      <div className={styles.refBlock} id="reference-createQueryGuard">
        <h3 className={styles.refTitle}>createQueryGuard(options)</h3>
        <p className={styles.refDesc}>URL クエリの状態管理を行う QueryGuard を生成します。</p>
        <div className={styles.signature}>
          <code>createQueryGuard&lt;T&gt;(options: QueryGuardOptions&lt;T&gt;): QueryGuard&lt;T&gt;</code>
        </div>
      </div>

      <div className={styles.refBlock} id="reference-adapter">
        <h3 className={styles.refTitle}>createBrowserAdapter()</h3>
        <p className={styles.refDesc}>ブラウザ用 Adapter。popstate のみ購読します。</p>
        <div className={styles.signature}>
          <code>createBrowserAdapter(): QueryGuardAdapter</code>
        </div>
      </div>

      <div className={styles.refBlock} id="reference-options">
        <h3 className={styles.refTitle}>QueryGuardOptions</h3>
        <div className={styles.propGrid}>
          <div className={styles.propRow}>
            <div className={styles.propName}>adapter</div>
            <div className={styles.propDetail}>
              <code>QueryGuardAdapter</code>
              <p>検索文字列の読み書きと変更通知を提供します。</p>
            </div>
          </div>
          <div className={styles.propRow}>
            <div className={styles.propName}>resolver</div>
            <div className={styles.propDetail}>
              <code>QueryResolver&lt;T&gt;</code>
              <p>raw ↔ typed 変換の責務を持ちます。</p>
            </div>
          </div>
          <div className={styles.propRow}>
            <div className={styles.propName}>defaultValue</div>
            <div className={styles.propDetail}>
              <code>T</code>
              <p>初期値。reset の write-defaults でも利用されます。</p>
            </div>
          </div>
          <div className={styles.propRow}>
            <div className={styles.propName}>unknownPolicy</div>
            <div className={styles.propDetail}>
              <code>'keep' | 'drop'</code>
              <p>未知キーの保持/除外を制御します。</p>
            </div>
          </div>
          <div className={styles.propRow}>
            <div className={styles.propName}>history</div>
            <div className={styles.propDetail}>
              <code>'replace' | 'push'</code>
              <p>History API の更新方法を指定します。</p>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.refBlock} id="reference-guard">
        <h3 className={styles.refTitle}>QueryGuard API</h3>
        <div className={styles.methodList}>
          <code>getSearch()</code>
          <code>getRaw()</code>
          <code>getQueries()</code>
          <code>getMeta()</code>
          <code>setQueries(next, options?)</code>
          <code>set(patch, options?)</code>
          <code>reset(options?)</code>
          <code>subscribe(listener)</code>
        </div>
        <div className={styles.note}>
          <strong>Notes:</strong>
          <ul>
            <li><code>set()</code> の <code>undefined</code> は削除扱い。</li>
            <li><code>reset()</code> は <code>clear</code> / <code>write-defaults</code> を選択。</li>
          </ul>
        </div>
      </div>

      <div className={styles.refBlock} id="reference-types">
        <h3 className={styles.refTitle}>QueryResolver / QueryRaw</h3>
        <div className={styles.propGrid}>
          <div className={styles.propRow}>
            <div className={styles.propName}>QueryResolver</div>
            <div className={styles.propDetail}>
              <p>Resolver は raw → typed / typed → raw を定義します。</p>
            </div>
          </div>
          <div className={styles.propRow}>
            <div className={styles.propName}>QueryRaw</div>
            <div className={styles.propDetail}>
              <code>Record&lt;string, string | string[]&gt;</code>
              <p>URLSearchParams から得られる raw データ形式です。</p>
            </div>
          </div>
        </div>
      </div>
    </Section>
  )
}
