import { styles } from "@/styles/auth.style";
import { useAuth } from "@clerk/clerk-expo";
import { Text, TouchableOpacity, View } from "react-native";
const Index = () => {
  const { signOut } = useAuth();
  return (
    <View style={styles.container}>
      <Text>Index</Text>
      <TouchableOpacity
        style={{ backgroundColor: "white" }}
        onPress={() => signOut()}
      >
        <Text style={{ padding: 4, color: "black" }}>SignOut</Text>
      </TouchableOpacity>
    </View>
  );
};
export default Index;
