
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const ChatInput = ({ onSend, disabled }) => {
  const [input, setInput] = useState("");
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const router = useRouter();

  // Detect keyboard open/close
  useEffect(() => {
    const showSub = Keyboard.addListener("keyboardDidShow", () =>
      setKeyboardVisible(true)
    );
    const hideSub = Keyboard.addListener("keyboardDidHide", () =>
      setKeyboardVisible(false)
    );
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const handleSend = () => {
    if (!input.trim()) return;
    onSend(input.trim());
    setInput("");
    Keyboard.dismiss();
  };

  const handlePlusPress = () => {
    console.log("Plus icon pressed");
    // Add attachment modal or other logic here
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 25}
      style={{ width: "100%" }}
    >
      <View style={styles.wrapper}>
        <View
          style={{
            borderRadius: 30,
            overflow: "hidden",
            flex: 1,
            backgroundColor: "rgba(255,255,255,0.2)",
          }}
        >
          <BlurView
            intensity={90}
            tint="light"
            experimentalBlurMethod="dimezisBlurView"
            style={[
              styles.glassContainer,
              isKeyboardVisible && {
                flexDirection: "row",
                justifyContent: "space-between",
              },
            ]}
          >
            {/* Left + Icon (only when keyboard closed) */}
            {!isKeyboardVisible && (
              <TouchableOpacity
                onPress={handlePlusPress}
                disabled={disabled}
                activeOpacity={0.7}
                style={styles.iconContainer}
              >
                <LinearGradient
                  colors={["#d9c4fb", "#a9d3fd"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.iconGradient}
                >
                  <Ionicons name="add" size={22} color="#fff" />
                </LinearGradient>
              </TouchableOpacity>
            )}

            {/* Text Input Field */}
            <View
              style={[
                styles.inputWrapper,
                isKeyboardVisible && { marginLeft: 0 },
              ]}
            >
              <TextInput
                value={input}
                onChangeText={setInput}
                placeholder="Ask me anything..."
                placeholderTextColor="#5b4b8a"
                style={[
                  styles.input,
                  isKeyboardVisible ? { paddingLeft: 16 } : { paddingLeft: 12 },
                ]}
                editable={!disabled}
                multiline
                maxHeight={120}
              />
            </View>

            {/* Send Button (only when keyboard open) */}
            {isKeyboardVisible && (
              <TouchableOpacity
                onPress={handleSend}
                disabled={disabled}
                activeOpacity={0.7}
                style={styles.iconContainer}
              >
                <LinearGradient
                  colors={["#d9c4fb", "#a9d3fd"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.iconGradient}
                >
                  <Ionicons name="send" size={20} color="#fff" />
                </LinearGradient>
              </TouchableOpacity>
            )}
          </BlurView>
        </View>

        {/* Right circular mic icon (outside input when keyboard closed) */}
        {!isKeyboardVisible && (
          <TouchableOpacity
            onPress={() => router.push("/voice")}
            disabled={disabled}
            activeOpacity={0.7}
          >
            <BlurView intensity={80} tint="light" style={styles.micBlur}>
              <LinearGradient
                colors={["#d9c4fb", "#a9d3fd"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.iconGradient}
              >
                <Ionicons name="mic" size={22} color="#fff" />
              </LinearGradient>
            </BlurView>
          </TouchableOpacity>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

export default ChatInput;

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 12,
    paddingBottom: Platform.OS === "android" ? 12 : 20,
  },
  glassContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 30,
    minHeight: 56,
    paddingHorizontal: 8,
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    borderWidth: 0.5,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    marginHorizontal: 4,
  },
  iconGradient: {
    width: "100%",
    height: "100%",
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  inputWrapper: {
    flex: 1,
    justifyContent: "center",
  },
  input: {
    color: "#3c3c6e",
    fontSize: 16,
    textAlignVertical: "center",
    paddingVertical: 10,
  },
  micBlur: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginLeft: 10,
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.3)",
  },
});
