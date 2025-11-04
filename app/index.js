// import { LinearGradient } from "expo-linear-gradient";
// import { useRouter } from "expo-router";
// import React, { useEffect } from "react";
// import { StyleSheet } from "react-native";
// import Animated, { BounceIn, FadeIn, FadeOut } from "react-native-reanimated";
// import FloatingAssistant from "../components/FloatingAssistant";

// export default function Index() {
//   const router = useRouter();

//   useEffect(() => {
//     const timer = setTimeout(() => router.push("/chat"), 2500);
//     return () => clearTimeout(timer);
//   }, []);

//   return (
//     <LinearGradient colors={["#e0c3fc", "#8ec5fc"]} style={styles.container}>
//       <Animated.View entering={BounceIn} exiting={FadeOut}>
//         <FloatingAssistant />
//       </Animated.View>
//       <Animated.Text entering={FadeIn} style={styles.text}>
//         Welcome to Yara 💜
//       </Animated.Text>
//     </LinearGradient>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, justifyContent: "center", alignItems: "center" },
//   text: { fontSize: 20, color: "#fff", marginTop: 20, fontWeight: "600" },
// });


import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { Alert, StyleSheet } from "react-native";
import Animated, { BounceIn, FadeIn, FadeOut } from "react-native-reanimated";
import FloatingAssistant from "../components/FloatingAssistant";
import {
  cancelAllScheduledNotifications // ADD THIS IMPORT
  ,

  getScheduledNotifications,
  registerForPushNotificationsAsync,
  scheduleTestNotification
} from "../utils/notifications";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => router.push("/chat"), 2500);
    
    // Initialize notifications - SIMPLIFIED
    const initNotifications = async () => {
      console.log('🚀 App started - Setting up notifications...');
      
      const granted = await registerForPushNotificationsAsync();
      
      if (granted) {
        console.log('🔔 Scheduling single 10-second test notification...');
        
        // Cancel any existing notifications first
        await cancelAllScheduledNotifications();
        
        // Schedule ONLY ONE notification after 10 seconds
        await scheduleTestNotification();
        
        // Check what's scheduled
        await getScheduledNotifications();
        
        Alert.alert(
          "Notification Scheduled",
          "You will get ONE notification in 10 seconds!",
          [{ text: "OK" }]
        );
      }
    };

    initNotifications();

    return () => clearTimeout(timer);
  }, []);

  return (
    <LinearGradient colors={["#e0c3fc", "#8ec5fc"]} style={styles.container}>
      <Animated.View entering={BounceIn} exiting={FadeOut}>
        <FloatingAssistant />
      </Animated.View>
      <Animated.Text entering={FadeIn} style={styles.text}>
        Welcome to Yara 💜
      </Animated.Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  text: { fontSize: 20, color: "#fff", marginTop: 20, fontWeight: "600" },
});