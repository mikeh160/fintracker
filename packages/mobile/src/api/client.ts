import { getClerkInstance } from "@clerk/clerk-expo";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3001";

async function authFetch(path: string, options: RequestInit = {}) {
  const clerk = getClerkInstance();
  const token = await clerk.session?.getToken();
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export const api = {
  getAccounts: () => authFetch("/api/accounts"),
  createAccount: (data: any) => authFetch("/api/accounts", { method: "POST", body: JSON.stringify(data) }),
  getTransactions: (page = 1) => authFetch(`/api/transactions?page=${page}&limit=50`),
  createTransaction: (data: any) => authFetch("/api/transactions", { method: "POST", body: JSON.stringify(data) }),
  getCategories: () => authFetch("/api/categories"),
};
