# Task 1: Monorepo Scaffolding

**Files:**
- Create: `package.json` (root)
- Create: `pnpm-workspace.yaml`
- Create: `tsconfig.base.json`
- Create: `.env.example`
- Create: `.gitignore`
- Create: `packages/shared/package.json`
- Create: `packages/shared/tsconfig.json`
- Create: `packages/api/package.json`
- Create: `packages/api/tsconfig.json`
- Create: `packages/mobile/package.json`

**Interfaces:**
- Consumes: nothing (first task)
- Produces: workspace root with pnpm workspaces, three package skeletons

## Steps

### Step 1: Create root package.json
```json
{
  "name": "fintracker",
  "private": true,
  "scripts": {
    "dev": "pnpm --filter @fintracker/api dev",
    "typecheck": "pnpm -r typecheck",
    "lint": "pnpm -r lint"
  }
}
```

### Step 2: Create pnpm-workspace.yaml
```yaml
packages:
  - "packages/*"
```

### Step 3: Create tsconfig.base.json
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "skipLibCheck": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "outDir": "dist",
    "rootDir": "src",
    "esModuleInterop": true
  }
}
```

### Step 4: Create .env.example
```
DATABASE_URL=postgres://user:password@localhost:5432/fintracker
CLERK_SECRET_KEY=sk_test_xxx
CLERK_PUBLISHABLE_KEY=pk_test_xxx
PORT=3001
```

### Step 5: Create .gitignore
```
node_modules/
dist/
.env
*.tsbuildinfo
.expo/
```

### Step 6: Create packages/shared/package.json
```json
{
  "name": "@fintracker/shared",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "scripts": {
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "zod": "^3.23.0"
  },
  "devDependencies": {
    "typescript": "^5.5.0"
  }
}
```

### Step 7: Create packages/shared/tsconfig.json
```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src"
  },
  "include": ["src"]
}
```

### Step 8: Create packages/api/package.json
```json
{
  "name": "@fintracker/api",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "start": "node dist/index.js",
    "build": "tsc",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "@clerk/backend": "^1.0.0",
    "@fintracker/shared": "workspace:*",
    "cors": "^2.8.5",
    "dotenv": "^16.4.0",
    "drizzle-orm": "^0.33.0",
    "express": "^4.21.0",
    "postgres": "^3.4.0",
    "zod": "^3.23.0"
  },
  "devDependencies": {
    "@types/cors": "^2.8.17",
    "@types/express": "^4.17.21",
    "@types/node": "^20.14.0",
    "drizzle-kit": "^0.24.0",
    "tsx": "^4.16.0",
    "typescript": "^5.5.0",
    "vitest": "^1.6.0"
  }
}
```

### Step 9: Create packages/api/tsconfig.json
```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "types": ["node"]
  },
  "include": ["src"]
}
```

### Step 10: Create packages/mobile/package.json
```json
{
  "name": "@fintracker/mobile",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "@clerk/clerk-expo": "^2.0.0",
    "@fintracker/shared": "workspace:*",
    "expo": "~52.0.0",
    "expo-secure-store": "~14.0.0",
    "expo-status-bar": "~2.0.0",
    "react": "18.3.1",
    "react-native": "0.76.0",
    "react-native-safe-area-context": "4.12.0",
    "expo-router": "~4.0.0",
    "expo-linking": "~7.0.0",
    "react-native-gesture-handler": "~2.20.0",
    "react-native-reanimated": "~3.16.0"
  },
  "devDependencies": {
    "@types/react": "~18.3.0",
    "typescript": "^5.5.0"
  }
}
```

### Step 11: Initialize pnpm and install
Run: `pnpm install`
Expected: node_modules created, workspace linked

### Step 12: Commit
```bash
git init
git add .
git commit -m "feat: scaffold monorepo with shared, api, mobile packages"
```

## Verification
- `pnpm install` completes without errors
- `git log` shows the initial commit
- Directory structure exists with packages/shared, packages/api, packages/mobile
