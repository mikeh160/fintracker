# Task 6: Mobile App — Expo + Clerk + Basic Screens

**Files:**
- Create: `packages/mobile/app.json`
- Create: `packages/mobile/tsconfig.json`
- Create: `packages/mobile/app/_layout.tsx`
- Create: `packages/mobile/app/index.tsx`
- Create: `packages/mobile/app/(tabs)/_layout.tsx`
- Create: `packages/mobile/app/(tabs)/index.tsx` (dashboard)
- Create: `packages/mobile/app/(tabs)/transactions.tsx`
- Create: `packages/mobile/app/(tabs)/add.tsx`
- Create: `packages/mobile/src/api/client.ts`
- Create: `packages/mobile/src/api/token-cache.ts`

**Interfaces:**
- Consumes: API routes from Task 5, shared types from Task 2
- Produces: Mobile app with login, dashboard, transaction list, add transaction
## Step 1: Create packages/mobile/app.json
```json
{
  "expo": {
    "name": "FinTracker",
    "slug": "fintracker",
    "scheme": "fintracker",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "newArchEnabled": true,
    "splash": { "backgroundColor": "#ffffff" },
    "ios": { "supportsTablet": true, "bundleIdentifier": "com.fintracker.app" },
    "android": { "package": "com.fintracker.app" },
    "plugins": [ "expo-router", "expo-secure-store" ]
  }
}
```

## Step 2: Create packages/mobile/tsconfig.json
```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "jsx": "react-jsx",
    "strict": true,
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["**/*.ts", "**/*.tsx", ".expo/types/**/*.ts", "expo-env.d.ts"]
}
```

## Step 3: Create packages/mobile/src/api/token-cache.ts
```typescript
import * as SecureStore from "expo-secure-store";
import type { TokenCache } from "@clerk/clerk-expo/dist/cache";

export const tokenCache: TokenCache = {
  async getToken(key: string) { return SecureStore.getItemAsync(key); },
  async saveToken(key: string, value: string) { return SecureStore.setItemAsync(key, value); },
  async deleteToken(key: string) { return SecureStore.deleteItemAsync(key); },
};
```

## Step 4: Create packages/mobile/src/api/client.ts
```typescript
import { getToken } from "@clerk/clerk-expo";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3001";

async function authFetch(path: string, options: RequestInit = {}) {
  const token = await getToken();
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  if (!res.ok) throw new Error("API error: ${res.status}");
  return res.json();
}

export const api = {
  getAccounts: () => authFetch("/api/accounts"),
  createAccount: (data: any) => authFetch("/api/accounts", { method: "POST", body: JSON.stringify(data) }),
  getTransactions: (page = 1) => authFetch("/api/transactions?page=${page}&limit=50"),
  createTransaction: (data: any) => authFetch("/api/transactions", { method: "POST", body: JSON.stringify(data) }),
  getCategories: () => authFetch("/api/categories"),
};
```
## Step 5: Create packages/mobile/app/_layout.tsx
```tsx
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/clerk-expo";
import { tokenCache } from "../src/api/token-cache";
import { Stack } from "expo-router";

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

export default function RootLayout() {
  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <SignedIn>
        <Stack screenOptions={{ headerShown: false }} />
      </SignedIn>
      <SignedOut>
        <Stack screenOptions={{ headerShown: false }} />
      </SignedOut>
    </ClerkProvider>
  );
}
```

## Step 6: Create packages/mobile/app/index.tsx
```tsx
import { useOAuth, useSignIn, useSignUp } from "@clerk/clerk-expo";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useState } from "react";
import { router } from "expo-router";

export default function AuthScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const { signIn, setActive: s1 } = useSignIn();
  const { signUp, setActive: s2 } = useSignUp();
  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });

  async function handleSubmit() {
    try {
      if (isSignUp) {
        const r = await signUp!.create({ emailAddress: email, password });
        await s2!({ session: r.createdSessionId });
      } else {
        const r = await signIn!.create({ identifier: email, password });
        await s1!({ session: r.createdSessionId });
      }
      router.replace("/(tabs)");
    } catch (err: any) { console.error(err); }
  }

  async function handleGoogle() {
    const { createdSessionId } = await startOAuthFlow();
    if (createdSessionId) router.replace("/(tabs)");
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>FinTracker</Text>
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" />
      <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>{isSignUp ? "Sign Up" : "Sign In"}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.googleButton} onPress={handleGoogle}>
        <Text style={styles.buttonText}>Continue with Google</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)}>
        <Text style={styles.link}>{isSignUp ? "Have an account? Sign In" : "No account? Sign Up"}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 24, backgroundColor: "#f8fafc" },
  title: { fontSize: 32, fontWeight: "700", textAlign: "center", marginBottom: 32, color: "#0f172a" },
  input: { borderWidth: 1, borderColor: "#e2e8f0", borderRadius: 8, padding: 12, marginBottom: 12, backgroundColor: "#fff" },
  button: { backgroundColor: "#6366f1", padding: 14, borderRadius: 8, alignItems: "center", marginBottom: 8 },
  googleButton: { backgroundColor: "#1e293b", padding: 14, borderRadius: 8, alignItems: "center", marginBottom: 16 },
  buttonText: { color: "#fff", fontWeight: "600" },
  link: { color: "#6366f1", textAlign: "center", marginTop: 8 },
});
```
## Step 7: Create packages/mobile/app/(tabs)/_layout.tsx
```tsx
import { Tabs } from "expo-router";
import { Text } from "react-native";

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: true }}>
      <Tabs.Screen name="index" options={{ title: "Dashboard", tabBarIcon: () => <Text>$</Text> }} />
      <Tabs.Screen name="transactions" options={{ title: "Transactions", tabBarIcon: () => <Text>#</Text> }} />
      <Tabs.Screen name="add" options={{ title: "Add", tabBarIcon: () => <Text>+</Text> }} />
    </Tabs>
  );
}
```

## Step 8: Create packages/mobile/app/(tabs)/index.tsx
```tsx
import { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { api } from "../../src/api/client";

export default function Dashboard() {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    api.getAccounts().then(setAccounts);
    api.getTransactions().then(setTransactions);
  }, []);

  const totalBalance = accounts.reduce((s: number, a: any) => s + a.balance, 0);

  return (
    <View style={styles.container}>
      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Total Balance</Text>
        <Text style={styles.balanceAmount}>${(totalBalance / 100).toFixed(2)}</Text>
      </View>
      <Text style={styles.sectionTitle}>Recent Transactions</Text>
      <FlatList
        data={transactions.slice(0, 10)}
        keyExtractor={(t: any) => t.id}
        renderItem={({ item }: { item: any }) => (
          <View style={styles.txItem}>
            <Text>{item.description || "No description"}</Text>
            <Text style={{ color: item.amount > 0 ? "#22c55e" : "#ef4444" }}>
              ${(Math.abs(item.amount) / 100).toFixed(2)}
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f8fafc" },
  balanceCard: { backgroundColor: "#6366f1", padding: 24, borderRadius: 16, marginBottom: 24 },
  balanceLabel: { color: "#c7d2fe", fontSize: 14 },
  balanceAmount: { color: "#fff", fontSize: 36, fontWeight: "700" },
  sectionTitle: { fontSize: 18, fontWeight: "600", marginBottom: 12, color: "#0f172a" },
  txItem: { flexDirection: "row", justifyContent: "space-between", padding: 12, backgroundColor: "#fff", borderRadius: 8, marginBottom: 8 },
});
```

## Step 9: Create packages/mobile/app/(tabs)/transactions.tsx
```tsx
import { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { api } from "../../src/api/client";

export default function TransactionsScreen() {
  const [txns, setTxns] = useState<any[]>([]);
  useEffect(() => { api.getTransactions().then(setTxns); }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={txns}
        keyExtractor={(t: any) => t.id}
        renderItem={({ item }: { item: any }) => (
          <View style={styles.txItem}>
            <View>
              <Text style={styles.txDesc}>{item.description || "No description"}</Text>
              <Text style={styles.txDate}>{new Date(item.date).toLocaleDateString()}</Text>
            </View>
            <Text style={{ ...styles.txAmount, color: item.amount > 0 ? "#22c55e" : "#ef4444" }}>
              {item.amount > 0 ? "+" : ""}{"$"}{(Math.abs(item.amount) / 100).toFixed(2)}
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f8fafc" },
  txItem: { flexDirection: "row", justifyContent: "space-between", padding: 16, backgroundColor: "#fff", borderRadius: 8, marginBottom: 8 },
  txDesc: { fontSize: 16, color: "#0f172a" },
  txDate: { fontSize: 12, color: "#64748b", marginTop: 2 },
  txAmount: { fontSize: 16, fontWeight: "600" },
});
```
## Step 10: Create packages/mobile/app/(tabs)/add.tsx
```tsx
import { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { router } from "expo-router";
import { api } from "../../src/api/client";

export default function AddTransaction() {
  const [accts, setAccts] = useState<any[]>([]);
  const [cats, setCats] = useState<any[]>([]);
  const [accountId, setAccountId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [amount, setAmount] = useState("");
  const [desc, setDesc] = useState("");

  useEffect(() => {
    api.getAccounts().then(setAccts);
    api.getCategories().then(setCats);
  }, []);

  async function handleSave() {
    if (!accountId || !amount) { Alert.alert("Error", "Account and amount required"); return; }
    const cents = Math.round(parseFloat(amount) * 100);
    try {
      await api.createTransaction({
        accountId, categoryId: categoryId || undefined,
        amount: cents, description: desc,
        date: new Date().toISOString(), source: "manual",
      });
      router.back();
    } catch (err: any) { Alert.alert("Error", err.message); }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Account</Text>
      {accts.map((a: any) => (
        <TouchableOpacity key={a.id} style={[styles.option, accountId === a.id && styles.selected]} onPress={() => setAccountId(a.id)}>
          <Text>{a.name}</Text>
        </TouchableOpacity>
      ))}
      <Text style={styles.label}>Amount ($)</Text>
      <TextInput style={styles.input} placeholder="0.00" value={amount} onChangeText={setAmount} keyboardType="decimal-pad" />
      <Text style={styles.label}>Description</Text>
      <TextInput style={styles.input} placeholder="What was this for?" value={desc} onChangeText={setDesc} />
      <Text style={styles.label}>Category</Text>
      {cats.map((c: any) => (
        <TouchableOpacity key={c.id} style={[styles.option, categoryId === c.id && styles.selected]} onPress={() => setCategoryId(c.id)}>
          <Text>{c.name}</Text>
        </TouchableOpacity>
      ))}
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f8fafc" },
  label: { fontSize: 14, fontWeight: "600", color: "#475569", marginTop: 16, marginBottom: 8 },
  input: { borderWidth: 1, borderColor: "#e2e8f0", borderRadius: 8, padding: 12, backgroundColor: "#fff" },
  option: { padding: 12, backgroundColor: "#fff", borderRadius: 8, marginBottom: 4, borderWidth: 1, borderColor: "#e2e8f0" },
  selected: { borderColor: "#6366f1", backgroundColor: "#eef2ff" },
  saveButton: { backgroundColor: "#6366f1", padding: 14, borderRadius: 8, alignItems: "center", marginTop: 24 },
  saveText: { color: "#fff", fontWeight: "600", fontSize: 16 },
});
```

## Step 11: Create assets directory
Run: `New-Item -ItemType Directory -Path "packages/mobile/assets" -Force`
Run: `pnpm --filter @fintracker/mobile typecheck`

## Step 12: Commit
```bash
git add packages/mobile/
git commit -m "feat: add expo mobile app with auth, dashboard, transactions"
```
