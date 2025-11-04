// import { BlurView } from "expo-blur";
// import { LinearGradient } from "expo-linear-gradient";
// import React from "react";
// import { StyleSheet, Text, View } from "react-native";

// export default function ChatBubble({ text, isBot }) {
//   return (
//     <View style={[styles.wrapper, isBot ? styles.botAlign : styles.userAlign]}>
//       <LinearGradient
//         colors={isBot ? ["#ffffff40", "#ffffff20"] : ["#8e2de2", "#4a00e0"]}
//         start={{ x: 0, y: 0 }}
//         end={{ x: 1, y: 1 }}
//         style={styles.gradientBorder}
//       >
//         <BlurView intensity={90} tint="light" style={[styles.bubble]}>
//           <Text style={[styles.text, isBot ? styles.botText : styles.userText]}>
//             {text}
//           </Text>
//         </BlurView>
//       </LinearGradient>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   wrapper: {
//     marginVertical: 6,
//     flexDirection: "row",
//   },
//   botAlign: { justifyContent: "flex-start" },
//   userAlign: { justifyContent: "flex-end" },
//   gradientBorder: {
//     borderRadius: 24,
//     padding: 2,
//   },
//   bubble: {
//     padding: 14,
//     borderRadius: 24,
//     overflow: "hidden",
//     shadowColor: "#000",
//     shadowOpacity: 0.1,
//     shadowRadius: 6,
//   },
//   text: { fontSize: 16, lineHeight: 22 },
// //   botText: { color: "#2c2c54" },
//   botText: { color: "#8e2de2" },
//   userText: { color: "#000" },
// });


import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Platform, StyleSheet, Text, View } from "react-native";

export default function ChatBubble({ text, isBot }) {
  return (
    <View style={[styles.wrapper, isBot ? styles.botAlign : styles.userAlign]}>
      <LinearGradient
        colors={isBot ? ["#ffffff60", "#ffffff10"] : ["#9b8cff", "#b38efb"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientBorder}
      >
        <BlurView
          intensity={Platform.OS === "ios" ? 90 : 50}
          tint="light"
          experimentalBlurMethod="dimezisBlurView"
          style={styles.bubble}
        >
          <Text style={[styles.text, isBot ? styles.botText : styles.userText]}>
            {text}
          </Text>
        </BlurView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginVertical: 6, flexDirection: "row" },
  botAlign: { justifyContent: "flex-start" },
  userAlign: { justifyContent: "flex-end" },
  gradientBorder: {
    borderRadius: 24,
    padding: 2,
  },
  bubble: {
    padding: 14,
    borderRadius: 24,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  text: { fontSize: 16, lineHeight: 22 },
  botText: { color: "#5b4b8a" },
  userText: { color: "#fff" },
});
