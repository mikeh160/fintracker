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
