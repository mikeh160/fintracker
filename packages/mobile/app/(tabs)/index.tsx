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
