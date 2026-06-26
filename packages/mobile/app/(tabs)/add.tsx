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
