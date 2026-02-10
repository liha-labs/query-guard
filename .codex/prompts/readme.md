# Generate README files for query-guard monorepo

You are a TypeScript OSS documentation author. Create or update README files by reading the repository code (do not guess). Keep docs consistent with current behavior.

## Repo structure
pnpm workspace monorepo with:

- packages/core: **@liha-labs/query-guard**
- packages/react: **@liha-labs/query-guard-react**
- packages/resolvers: **@liha-labs/query-guard-resolvers**

## Deliverables
Create/update:
1) Root `README.md`
2) `packages/core/README.md`
3) `packages/react/README.md`
4) `packages/resolvers/README.md`

## Requirements (must include)
### Root README.md
- What is query-guard (1–2 paragraphs)
- Packages overview (what each package is for)
- Install commands (pnpm/npm/yarn examples are fine)
- Quick Start example using:
  - `createBrowserAdapter` (core)
  - `useQueryGuard` (react)
  - `zodResolver` (resolvers)
- Concepts section: Adapter / Resolver / typed `queries` vs raw querystring
- **History API notification policy** (explicit):
  - `createBrowserAdapter` listens to `popstate`
  - external `history.pushState/replaceState` does not notify
  - realtime needs a router/framework-aware adapter
  - pull-based reads (`getQueries/getRaw`) are safe for non-realtime usage
- **SSR** policy:
  - `createBrowserAdapter` is browser-only (throws when `window` is undefined)
  - SSR/non-browser must inject a custom adapter
- API surface (bullet list, link to package READMEs)
- Contributing + scripts (`pnpm -r typecheck`, `pnpm -r build`)
- License

### packages/core/README.md
- What the core package provides
- Minimal non-React usage example (createQueryGuard + adapter)
- Adapter interface explanation (what `getSearch/setSearch/subscribe` mean)
- `unknownPolicy`, `reset(mode)`, and `set(patch)` semantics (undefined deletes)

### packages/react/README.md
- `useQueryGuard` usage and return shape
- Peer deps note (React, core)
- Note about stabilizing `adapter/resolver/defaultValue` references (useMemo recommended)

### packages/resolvers/README.md
- `zodResolver` purpose and usage
- Coercion guidance (e.g., `z.coerce.number()`) since URL params are strings
- Serialization caveats (match current implementation)

## Process
1. Read the relevant code before writing.
2. Ensure examples compile against current exports.
3. Keep language concise and developer-facing.
4. Do not change runtime logic to match the docs; update docs to match runtime.

## Output
- List of files created/updated
- Brief note of key policies (History/SSR) included
