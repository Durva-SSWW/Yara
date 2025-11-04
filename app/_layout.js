// import { Stack } from "expo-router";
// import { StatusBar } from "expo-status-bar";
// import React from "react";
// import { GestureHandlerRootView } from "react-native-gesture-handler";
// import { SafeAreaView } from "react-native-safe-area-context";

// export default function Layout() {
//   return (
//     <GestureHandlerRootView style={{ flex: 1 }}>
//        <StatusBar style="light" backgroundColor="#e0c3fc" translucent={true} />
       
//       <SafeAreaView style={{ flex: 1 }}>
//         <Stack screenOptions={{ headerShown: false }} />
//       </SafeAreaView>
//     </GestureHandlerRootView>
//   );
// }



import { Stack, useNavigation } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { setNotificationHandler } from "../utils/notifications";

export default function Layout() {
  const navigation = useNavigation();

  useEffect(() => {
    // Set up notification handler when layout mounts
    const subscription = setNotificationHandler(navigation);

    // Cleanup subscription when component unmounts
    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, [navigation]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
       <StatusBar style="light" backgroundColor="#e0c3fc" translucent={true} />
       
      <SafeAreaView style={{ flex: 1 }}>
        <Stack screenOptions={{ headerShown: false }} />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}