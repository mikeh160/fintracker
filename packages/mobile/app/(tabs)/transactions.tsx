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
