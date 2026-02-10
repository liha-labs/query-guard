import { ReactNode } from 'react'
import { ENV } from '../config'
import { useActiveHash } from '../utils'
import styles from './Layout.module.css'

interface LayoutProps {
  hero?: ReactNode
  children: ReactNode
  footer: ReactNode
}

export const Layout = ({ hero, children, footer }: LayoutProps) => {
  const activeHash = useActiveHash([
    'introduction',
    'quickstart',
    'usage',
    'reference',
    'reference-createQueryGuard',
    'reference-adapter',
    'reference-options',
    'reference-guard',
    'reference-types',
    'examples',
    'examples-react',
    'examples-unknown-policy',
    'examples-zod',
    'examples-ssr',
  ])

  const getNavLinkClass = (hash: string) => {
    const isActive = activeHash === hash || activeHash.startsWith(`${hash}-`)
    return isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <a href="/" className={styles.logo}>
            query-guard
          </a>

          <nav className={styles.headerNav}>
            <a
              href={ENV.RESOURCE.GITHUB}
              target="_blank"
              rel="noreferrer"
              className={styles.githubLink}
            >
              <svg height="20" viewBox="0 0 16 16" width="20" fill="currentColor">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
              </svg>
              <span>GitHub</span>
            </a>

            <div className={styles.headerSocials}>
              <a href={ENV.COMMUNITY.X} target="_blank" rel="noreferrer" aria-label="X">
                <svg viewBox="0 0 24 24" className={styles.icon}>
                  <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
                </svg>
              </a>

              <a href={ENV.COMMUNITY.DISCORD} target="_blank" rel="noreferrer" aria-label="Discord">
                <svg viewBox="0 0 24 24" className={styles.icon}>
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037 19.736 19.736 0 0 0-4.885 1.515.069.069 0 0 0-.032.027C.533 9.048-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.086 2.157 2.419 0 1.334-.956 2.419-2.157 2.419zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.086 2.157 2.419 0 1.334-.946 2.419-2.157 2.419z" />
                </svg>
              </a>
            </div>
          </nav>
        </div>
      </header>

      {hero && <div className={styles.heroSection}>{hero}</div>}

      <div className={styles.wrapper}>
        <aside className={styles.sidebar}>
          <nav className={styles.sideNav}>
            <ul>
              <li>
                <a href="#introduction" className={getNavLinkClass('introduction')}>
                  Introduction
                </a>
              </li>
              <li>
                <a href="#quickstart" className={getNavLinkClass('quickstart')}>
                  Quick Start
                </a>
              </li>
              <li>
                <a href="#usage" className={getNavLinkClass('usage')}>
                  Usage
                </a>
              </li>
              <li>
                <a href="#reference" className={getNavLinkClass('reference')}>
                  API Reference
                </a>
                <ul className={styles.subNav}>
                  <li>
                    <a
                      href="#reference-createQueryGuard"
                      className={getNavLinkClass('reference-createQueryGuard')}
                    >
                      createQueryGuard
                    </a>
                  </li>
                  <li>
                    <a href="#reference-adapter" className={getNavLinkClass('reference-adapter')}>
                      createBrowserAdapter
                    </a>
                  </li>
                  <li>
                    <a href="#reference-options" className={getNavLinkClass('reference-options')}>
                      QueryGuardOptions
                    </a>
                  </li>
                  <li>
                    <a href="#reference-guard" className={getNavLinkClass('reference-guard')}>
                      QueryGuard API
                    </a>
                  </li>
                  <li>
                    <a href="#reference-types" className={getNavLinkClass('reference-types')}>
                      QueryResolver / QueryRaw
                    </a>
                  </li>
                </ul>
              </li>
              <li>
                <a href="#examples" className={getNavLinkClass('examples')}>
                  Examples
                </a>
                <ul className={styles.subNav}>
                  <li>
                    <a href="#examples-react" className={getNavLinkClass('examples-react')}>
                      Provider + Hook
                    </a>
                  </li>
                  <li>
                    <a
                      href="#examples-unknown-policy"
                      className={getNavLinkClass('examples-unknown-policy')}
                    >
                      unknownPolicy
                    </a>
                  </li>
                  <li>
                    <a href="#examples-zod" className={getNavLinkClass('examples-zod')}>
                      Zod Resolver
                    </a>
                  </li>
                  <li>
                    <a href="#examples-ssr" className={getNavLinkClass('examples-ssr')}>
                      SSR Adapter
                    </a>
                  </li>
                </ul>
              </li>
            </ul>
          </nav>
        </aside>

        <main className={styles.main}>
          <article className={styles.content}>{children}</article>
        </main>
      </div>

      <div className={styles.footerSection}>{footer}</div>
    </div>
  )
}
