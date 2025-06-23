import InitialLayout from "@/components/InitialLayout";
import ClerkAndConvexProviders from "@/providers/ClerkAndConvexProviders";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

// const key = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;
// if (!key) {
//   throw new Error(
//     "Missing Publishable Key. Please set Expo public clerk publishable key in you .env"
//   );
// }
// SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // const [fontsLoaded] = useFonts({
  //   "JetBrainsMono-Medium": require("@/assets/fonts/JetBrainsMono-Medium.ttf"),
  // });

  // const onLayoutRootView = useCallback(async () => {
  //   if (fontsLoaded) SplashScreen.hideAsync();
  // }, [fontsLoaded]);

  return (
    <ClerkAndConvexProviders>
      <SafeAreaProvider>
        <SafeAreaView
          style={{
            flex: 1,
            backgroundColor: "black",
          }}
          // onLayout={onLayoutRootView}
        >
          <InitialLayout />
        </SafeAreaView>
      </SafeAreaProvider>
    </ClerkAndConvexProviders>
  );
}
