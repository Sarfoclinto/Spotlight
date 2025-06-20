import broImage from "@/assets/images/bro.png";
import { COLORS } from "@/constants/theme";
import { styles } from "@/styles/auth.style";
import { useSSO } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";
const LogIn = () => {
  const { startSSOFlow } = useSSO();
  const router = useRouter();

  const handleGoogleSigin = async () => {
    try {
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy: "oauth_google",
      });
      if (setActive && createdSessionId) {
        setActive({ session: createdSessionId });
        router.replace("/(tabs)");
      }
    } catch (error) {
      console.error("0Auth error: ", error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Brand section */}
      <View style={styles.brandSection}>
        <View style={styles.logoContainer}>
          <Ionicons name="leaf" size={32} color={COLORS.primary} />
        </View>
        <Text style={styles.appName}>spotlight</Text>
        <Text style={styles.tagline}>don&apos;t miss anything</Text>
      </View>
      {/* Illustration */}
      <View style={styles.illustrationContainer}>
        <Image
          source={broImage}
          style={styles.illustration}
          resizeMode="cover"
        />
      </View>

      {/* login section */}
      <View style={styles.loginSection}>
        <TouchableOpacity
          onPress={handleGoogleSigin}
          style={styles.googleButton}
          activeOpacity={0.9}
        >
          <View style={styles.googleIconContainer}>
            <Ionicons name="logo-google" size={20} color={COLORS.surface} />
          </View>
          <Text style={styles.googleButtonText}>Continue with Google</Text>
        </TouchableOpacity>

        <Text style={styles.termsText}>
          By Continuing, you agree to our Terms and Privacy Policy
        </Text>
      </View>
    </View>
  );
};
export default LogIn;
