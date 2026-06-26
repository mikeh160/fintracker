import { ClerkProvider, SignedIn, SignedOut } from "@clerk/clerk-expo";
import { tokenCache } from "../src/api/token-cache";
import { Stack } from "expo-router";
import { Text, View } from "react-native";

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

function MissingConfig() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 24 }}>
      <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 8 }}>Clerk Not Configured</Text>
      <Text style={{ textAlign: "center", color: "#64748b" }}>
        Set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in packages/mobile/.env
      </Text>
    </View>
  );
}

export default function RootLayout() {
  if (!publishableKey) return <MissingConfig />;
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
