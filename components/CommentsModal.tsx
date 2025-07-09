import { COLORS } from "@/constants/theme";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { styles } from "@/styles/feed.styles";
import Ionicons from "@expo/vector-icons/build/Ionicons";
import { useMutation, useQuery } from "convex/react";
import { useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Comment from "./Comment";
import Loader from "./Loader";

type CommentsModalProps = {
  postId: Id<"posts">;
  visible: boolean;
  onClose: () => void;
};

const CommentsModal = ({ onClose, postId, visible }: CommentsModalProps) => {
  const [comment, setComment] = useState("");

  const comments = useQuery(api.comments.getComments, { postId });
  const addComment = useMutation(api.comments.addComment);

  const handleAddComment = async () => {
    if (!comment.trim()) return;

    try {
      await addComment({ postId, content: comment });
      setComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
      // Optionally, you can show an error message to the user
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
      transparent={true}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.modalContainer}
      >
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color={COLORS.white} />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Comments</Text>
          <View style={{ width: 24 }} />
        </View>

        {comments === undefined ? (
          <Loader />
        ) : (
          <FlatList
            data={comments}
            keyExtractor={(item) => item._id.toString()}
            contentContainerStyle={styles.commentsList}
            renderItem={({ item }) => <Comment comment={item} />}
          />
        )}

        <View style={styles.commentInput}>
          <TextInput
            style={styles.input}
            placeholder="Add a comment..."
            placeholderTextColor={COLORS.grey}
            value={comment}
            onChangeText={setComment}
            multiline
          />

          <TouchableOpacity
            onPress={handleAddComment}
            disabled={!comment.trim()}
          >
            <Text
              style={[
                styles.postButton,
                !comment.trim() && styles.postButtonDisabled,
              ]}
            >
              Post
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};
export default CommentsModal;
