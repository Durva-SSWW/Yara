import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import ChatBubble from "../../components/ChatBubble";
import ChatInput from "../../components/ChatInput";
import FloatingAssistant from "../../components/FloatingAssistant";
import { sendChatMessage } from "../../utils/api";

export default function ChatScreen() {
  const [messages, setMessages] = useState([
    {
      id: "1",
      text: "Hello, Buddy! 💜\nHow can I help you today?",
      isBot: true,
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const scrollRef = useRef();

  // Detect keyboard visibility
  useEffect(() => {
    const showSubscription = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      () => setKeyboardVisible(true)
    );
    const hideSubscription = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      () => setKeyboardVisible(false)
    );

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const handleSend = async (text) => {
    const userMessage = { id: Date.now().toString(), text, isBot: false };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const botResponse = await sendChatMessage(text);
      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), text: botResponse, isBot: true },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          text: "Sorry, something went wrong 😔",
          isBot: true,
        },
      ]);
    } finally {
      setLoading(false);
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    }
  };

  return (
    <LinearGradient colors={["#e0c3fc", "#8ec5fc"]} style={{ flex: 1 }}>
      <SafeAreaView style={styles.safe}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 30}
        >
          <ScrollView
            ref={scrollRef}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[
              styles.scrollContent,
              // Dynamic padding based on keyboard state
              { paddingBottom: isKeyboardVisible ? 90 : 20 },
            ]}
            onContentSizeChange={() =>
              scrollRef.current?.scrollToEnd({ animated: true })
            }
            keyboardShouldPersistTaps="handled"
          >
            <Text style={styles.header}>Hello, Buddy!</Text>
            <Text style={styles.subHeader}>How can I help you today?</Text>

            {/* Big assistant always visible */}
            <View style={styles.bigAssistantWrapper}>
              <FloatingAssistant />
            </View>

            {messages.map((msg) => (
              <ChatBubble key={msg.id} text={msg.text} isBot={msg.isBot} />
            ))}

            {/* Small assistant + animated dots while waiting */}
            {loading && <AnimatedTypingLoader />}
          </ScrollView>

          <ChatInput onSend={handleSend} disabled={loading} />
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

/* ===========================
    Animated Typing Loader
   =========================== */
const AnimatedTypingLoader = () => {
  const opacity1 = useSharedValue(0.3);
  const opacity2 = useSharedValue(0.3);
  const opacity3 = useSharedValue(0.3);
  const translateY = useSharedValue(0);

  useEffect(() => {
    // Floating up/down motion
    translateY.value = withRepeat(
      withSequence(
        withTiming(-5, { duration: 800 }),
        withTiming(0, { duration: 800 })
      ),
      -1,
      true
    );

    // Sequential fade animation for dots
    opacity1.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 400 }),
        withTiming(0.3, { duration: 800 })
      ),
      -1,
      false
    );
    opacity2.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 600 }),
        withTiming(0.3, { duration: 600 })
      ),
      -1,
      false
    );
    opacity3.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 800 }),
        withTiming(0.3, { duration: 400 })
      ),
      -1,
      false
    );
  }, []);

  const dotStyle = (opacity) =>
    useAnimatedStyle(() => ({
      opacity: opacity.value,
    }));

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={[styles.loaderWrapper, containerStyle]}>
      <View style={styles.smallAssistantWrapper}>
        <FloatingAssistant small />
      </View>

      <View style={styles.typingDots}>
        <Animated.Text style={[styles.dot, dotStyle(opacity1)]}>
          ●
        </Animated.Text>
        <Animated.Text style={[styles.dot, dotStyle(opacity2)]}>
          ●
        </Animated.Text>
        <Animated.Text style={[styles.dot, dotStyle(opacity3)]}>
          ●
        </Animated.Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 90,
  },
  header: {
    fontSize: 28,
    textAlign: "center",
    fontWeight: "700",
    color: "#3c3c6e",
    marginTop: 10,
  },
  subHeader: {
    textAlign: "center",
    fontSize: 16,
    color: "#444",
    marginBottom: 20,
  },
  loaderWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 12,
  },
  bigAssistantWrapper: {
    marginBottom: 20,
    marginTop: 10,
  },
  smallAssistantWrapper: {
    marginRight: 15,
    alignItems: "flex-start",
    marginTop: 10,
    marginLeft: 10,
  },
  typingDots: {
    flexDirection: "row",
    gap: 5,
    marginTop: 5,
    alignItems: "center",
  },
  dot: {
    fontSize: 16,
    color: "#3c3c6e",
  },
});
