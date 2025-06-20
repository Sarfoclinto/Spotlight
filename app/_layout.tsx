import InitialLayout from "@/components/InitialLayout";
import { ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

// const key = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;
// if (!key) {
//   throw new Error(
//     "Missing Publishable Key. Please set Expo public clerk publishable key in you .env"
//   );
// }

export default function RootLayout() {
  return (
    <ClerkProvider tokenCache={tokenCache}>
      <SafeAreaProvider>
        <SafeAreaView
          style={{
            flex: 1,
            backgroundColor: "black",
          }}
        >
          <InitialLayout />
        </SafeAreaView>
      </SafeAreaProvider>
    </ClerkProvider>
  );
}
