// import { LinearGradient } from "expo-linear-gradient";
// import React, { useEffect } from "react";
// import { StyleSheet, View } from "react-native";
// import Animated, {
//     useAnimatedStyle,
//     useSharedValue,
//     withRepeat,
//     withTiming,
// } from "react-native-reanimated";

// export default function FloatingAssistant({ small = false }) {
//   const translateY = useSharedValue(0);

//   useEffect(() => {
//     translateY.value = withRepeat(withTiming(-10, { duration: 1500 }), -1, true);
//   }, []);

//   const animatedStyle = useAnimatedStyle(() => ({
//     transform: [{ translateY: translateY.value }],
//   }));

//   const orbSize = small ? 60 : 120;

//   return (
//     <Animated.View
//       style={[
//         styles.glowContainer,
//         animatedStyle,
//         small && { alignSelf: "flex-start" },
//       ]}
//     >
//       <LinearGradient
//         colors={["#9b8cff", "#e5b8ff", "#b0f3f1"]}
//         style={[styles.orb, { width: orbSize, height: orbSize, borderRadius: orbSize / 2 }]}
//         start={{ x: 0, y: 0 }}
//         end={{ x: 1, y: 1 }}
//       />
//       <View style={[styles.innerEyes, small && { gap: 10 }]}>
//         <View style={[styles.eye, small && { width: 8, height: 8, borderRadius: 4 }]} />
//         <View style={[styles.eye, small && { width: 8, height: 8, borderRadius: 4 }]} />
//       </View>
//     </Animated.View>
//   );
// }

// const styles = StyleSheet.create({
//   glowContainer: {
//     alignSelf: "center",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   orb: {
//     opacity: 0.9,
//   },
//   innerEyes: {
//     position: "absolute",
//     flexDirection: "row",
//     gap: 20,
//   },
//   eye: {
//     width: 14,
//     height: 14,
//     borderRadius: 7,
//     backgroundColor: "#fff",
//   },
// });



// FloatingAssistant.js
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

export default function FloatingAssistant({ small = false, withEyes = true }) {
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);

  useEffect(() => {
    translateY.value = withRepeat(
      withSequence(
        withTiming(-6, { duration: 2000 }),
        withTiming(3, { duration: 2000 })
      ),
      -1,
      true
    );
    
    scale.value = withRepeat(
      withSequence(
        withTiming(1.02, { duration: 3000 }),
        withTiming(0.98, { duration: 3000 })
      ),
      -1,
      true
    );

    rotation.value = withRepeat(
      withTiming(5, { duration: 8000 }),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { scale: scale.value },
      { rotate: `${rotation.value}deg` }
    ],
  }));

  const innerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${-rotation.value * 0.5}deg` }
    ],
  }));

  // Reduced sizes - much smaller for both variants
  const orbSize = small ? 40 : 80; // Reduced from 60/160 to 40/80
  const glowSize = small ? 60 : 100; // Reduced glow size

  return (
    <Animated.View
      style={[
        styles.glowContainer,
        animatedStyle,
        small && { alignSelf: "flex-start" },
      ]}
    >
      {/* Outer Glow */}
      <View style={[styles.outerGlow, { 
        width: glowSize, 
        height: glowSize, 
        borderRadius: glowSize / 2 
      }]} />
      
      {/* Main Orb */}
      <LinearGradient
        colors={["#a78bfa", "#c084fc", "#67e8f9"]}
        style={[styles.orb, { 
          width: orbSize, 
          height: orbSize, 
          borderRadius: orbSize / 2 
        }]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      
      {/* Inner Shine */}
      <LinearGradient
        colors={["#ffffff40", "#ffffff00", "#ffffff20"]}
        style={[styles.innerShine, { 
          width: orbSize * 0.5, 
          height: orbSize * 0.5, 
          borderRadius: orbSize * 0.25 
        }]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      
      {/* Liquid Reflection */}
      <Animated.View style={[styles.liquidReflection, innerAnimatedStyle]}>
        <LinearGradient
          colors={["#ffffff30", "#ffffff00", "#ffffff10"]}
          style={[styles.reflection, { 
            width: orbSize * 0.6, 
            height: orbSize * 0.2 
          }]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        />
      </Animated.View>

      {withEyes && (
        <Animated.View style={[styles.innerEyes, small && { gap: 6 }, innerAnimatedStyle]}>
          <View style={[styles.eye, small && { width: 4, height: 4, borderRadius: 2 }]} />
          <View style={[styles.eye, small && { width: 4, height: 4, borderRadius: 2 }]} />
        </Animated.View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  glowContainer: {
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  outerGlow: {
    position: "absolute",
    backgroundColor: "#a78bfa30",
    shadowColor: "#a78bfa",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 10,
  },
  orb: {
    opacity: 0.95,
    shadowColor: "#a78bfa",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  innerShine: {
    position: "absolute",
    top: "15%",
    left: "15%",
  },
  liquidReflection: {
    position: "absolute",
    top: "10%",
    alignItems: "center",
  },
  reflection: {
    borderRadius: 10,
    opacity: 0.6,
  },
  innerEyes: {
    position: "absolute",
    flexDirection: "row",
    gap: 12,
  },
  eye: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
});