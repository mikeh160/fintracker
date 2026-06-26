# Task 6 Report: Mobile App — Expo + Clerk + Basic Screens

**Status:** Complete

## Files Created

| File | Description |
|------|-------------|
| `packages/mobile/app.json` | Expo config (name, slug, plugins) |
| `packages/mobile/tsconfig.json` | TypeScript config extending base, overrides rootDir/`noUn*` for Expo compat |
| `packages/mobile/types/env.d.ts` | Global `process.env` type declarations for `EXPO_PUBLIC_*` vars |
| `packages/mobile/src/api/token-cache.ts` | SecureStore-backed `TokenCache` for Clerk session persistence |
| `packages/mobile/src/api/client.ts` | API client with `getClerkInstance`-based auth token injection |
| `packages/mobile/app/_layout.tsx` | Root layout with `ClerkProvider` + `SignedIn`/`SignedOut` stacks |
| `packages/mobile/app/index.tsx` | Auth screen (sign in / sign up / Google OAuth) |
| `packages/mobile/app/(tabs)/_layout.tsx` | Tab navigator (Dashboard, Transactions, Add) |
| `packages/mobile/app/(tabs)/index.tsx` | Dashboard (balance card + recent transactions) |
| `packages/mobile/app/(tabs)/transactions.tsx` | Transaction list with date/amount formatting |
| `packages/mobile/app/(tabs)/add.tsx` | Add transaction form (account picker, category picker, amount, description) |
| `packages/mobile/assets/` | Empty directory for app icon reference |

## Adaptations from Brief

- **`token-cache.ts`**: `TokenCache` imported from `@clerk/clerk-expo` (not `/dist/cache` — that subpath isn't in the exports map). Used `clearToken` instead of `deleteToken` to match the actual interface.
- **`client.ts`**: Uses `getClerkInstance()` (`@clerk/clerk-expo`) instead of a non-existent standalone `getToken` import. Clerk v2 does not export `getToken` as a top-level function — it's only available via `useAuth()` hook or `getClerkInstance()`.
- **`tsconfig.json`**: Overrides `rootDir` to `.` (base config sets it to `src`), disables `noUncheckedIndexedAccess` and `noUnused*` to avoid Expo Router file conflicts.
- **`types/env.d.ts`**: Added global `process.env` declaration for Expo public env vars, since no `expo-env.d.ts` is generated outside of an Expo dev server.

## Verification

- `pnpm --filter @fintracker/mobile typecheck`: **Passes** (0 errors)
- `pnpm install`: Already up to date (no new deps needed)
- Commit: `22a685a` — `feat: add expo mobile app with auth, dashboard, transactions`