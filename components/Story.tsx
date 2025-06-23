import { styles } from "@/styles/feed.styles";
import { Image } from "expo-image";
import { Text, TouchableOpacity, View } from "react-native";

type StoryProp = {
  id: string;
  username: string;
  avatar: string;
  hasStory: boolean;
};
const Story = ({ story }: { story: StoryProp }) => {
  return (
    <TouchableOpacity style={styles.storyWrapper}>
      <View style={[styles.storyRing, !story.hasStory && styles.noStory]}>
        <Image source={{ uri: story.avatar }} style={styles.storyAvatar} />
      </View>
      <Text style={styles.storyUsername}>{story.username}</Text>
    </TouchableOpacity>
  );
};

export default Story;
