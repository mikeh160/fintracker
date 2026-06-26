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
