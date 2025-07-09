import InitialLayout from "@/components/InitialLayout";
import ClerkAndConvexProviders from "@/providers/ClerkAndConvexProviders";
import * as NavigationBar from "expo-navigation-bar";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { Platform } from "react-native";
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

  // update the native navigation bar on Android.
  useEffect(() => {
    if (Platform.OS === "android") {
      NavigationBar.setBackgroundColorAsync("#000000");
      NavigationBar.setButtonStyleAsync("light");
    }
  }, []);

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
      <StatusBar style="light" />
    </ClerkAndConvexProviders>
  );
}
