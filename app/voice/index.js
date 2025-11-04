// // app/voice/index.js
// import { Ionicons } from "@expo/vector-icons";
// import { Audio } from "expo-av";
// import { BlurView } from "expo-blur";
// import { LinearGradient } from "expo-linear-gradient";
// import { useRouter } from "expo-router";
// import * as Speech from "expo-speech";
// import { useEffect, useRef, useState } from "react";
// import {
//   Alert,
//   SafeAreaView,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View
// } from "react-native";

// import * as SpeechRecognition from "expo-speech-recognition"; // community module
// import { sendChatMessage } from "../../utils/api";

// export default function VoiceScreen() {
//   const router = useRouter();

//   const [listening, setListening] = useState(false);
//   const [transcript, setTranscript] = useState("");
//   const [backendResponse, setBackendResponse] = useState(null);
//   const [showResponseText, setShowResponseText] = useState(true); // toggle for later removal
//   const listenerRef = useRef(null);

//   useEffect(() => {
//     (async () => {
//       await requestPermissions();
//       // Optionally check availability
//       const available = SpeechRecognition.isRecognitionAvailable
//         ? await SpeechRecognition.isRecognitionAvailable()
//         : true;
//       if (!available) {
//         console.warn("Speech recognition not available on this device/browser.");
//       }
//     })();

//     return () => {
//       // stop and remove listeners on unmount
//       stopListening();
//       try {
//         if (SpeechRecognition.removeAllRecordingListeners) {
//           SpeechRecognition.removeAllRecordingListeners();
//         }
//       } catch (e) {}
//     };
//   }, []);

//   const requestPermissions = async () => {
//     try {
//       // Microphone / Audio recording permission
//       const audioPerm = await Audio.requestPermissionsAsync && (await Audio.requestPermissionsAsync());
//       // For iOS you might also need Speech recognition permission (SFSpeechRecognizer)
//       if (SpeechRecognition.requestPermissionsAsync) {
//         const srPerm = await SpeechRecognition.requestPermissionsAsync();
//         if (srPerm.status && srPerm.status !== "granted") {
//           Alert.alert(
//             "Permission required",
//             "Microphone / Speech recognition permission is required to use voice chat."
//           );
//         }
//       } else {
//         // Fallback: rely on Audio permission
//         if (audioPerm && audioPerm.status !== "granted") {
//           Alert.alert("Permission required", "Microphone permission is required to use voice chat.");
//         }
//       }
//     } catch (error) {
//       console.error("Permission error:", error);
//       Alert.alert("Permission error", "Could not get microphone permission. Try again from settings.");
//     }
//   };

//   const startListening = async () => {
//     try {
//       // Double-check permissions before starting
//       if (SpeechRecognition.requestPermissionsAsync) {
//         const p = await SpeechRecognition.requestPermissionsAsync();
//         if (p.status && p.status !== "granted") {
//           Alert.alert("Permission required", "Microphone permission required to start recording.");
//           return;
//         }
//       }

//       // Clear previous
//       setTranscript("");
//       setBackendResponse(null);

//       // Start recognition
//       if (SpeechRecognition.startRecordingAsync) {
//         await SpeechRecognition.startRecordingAsync({
//           language: "en-US",
//           // maxDuration: 120, // optional
//         });
//       } else if (SpeechRecognition.startAsync) {
//         // alternative name
//         await SpeechRecognition.startAsync({ language: "en-US" });
//       } else {
//         throw new Error("SpeechRecognition.start not available on this platform");
//       }

//       // Add listener - the API exposes addRecordingListener(event => ...)
//       if (SpeechRecognition.addRecordingListener) {
//         listenerRef.current = SpeechRecognition.addRecordingListener((event) => {
//           // event.results is usually an array of interim/final results
//           if (event?.results && event.results.length > 0) {
//             const first = event.results[0];
//             // first.text or first.transcript
//             const text = first.text ?? first.transcript ?? "";
//             setTranscript(text);
//           } else if (event?.text) {
//             setTranscript(event.text);
//           }
//         });
//       }

//       setListening(true);
//       setTranscript("Listening...");
//     } catch (error) {
//       console.error("startListening error:", error);
//       Alert.alert("Error", "Failed to start voice recognition.");
//     }
//   };

//   const stopListening = async () => {
//     try {
//       // Stop recording
//       if (SpeechRecognition.stopRecordingAsync) {
//         await SpeechRecognition.stopRecordingAsync();
//       } else if (SpeechRecognition.stopAsync) {
//         await SpeechRecognition.stopAsync();
//       }

//       // Remove listener(s)
//       if (SpeechRecognition.removeAllRecordingListeners) {
//         SpeechRecognition.removeAllRecordingListeners();
//       } else if (SpeechRecognition.removeRecordingListener && listenerRef.current) {
//         SpeechRecognition.removeRecordingListener(listenerRef.current);
//       }

//       setListening(false);

//       // If transcript still placeholder, clear it
//       if (transcript === "Listening...") {
//         setTranscript("");
//       }
//     } catch (error) {
//       console.error("stopListening error:", error);
//     }
//   };

//   const handleSend = async () => {
//     if (!transcript || transcript === "Listening...") {
//       Alert.alert("No input", "Please speak something first.");
//       return;
//     }

//     try {
//       // Ensure we stop recording
//       await stopListening();

//       // Send transcript to backend (n8n webhook)
//       setBackendResponse("Thinking...");
//       const responseText = await sendChatMessage(transcript);

//       setBackendResponse(responseText || "I couldn't find a response.");
//       // speak it using expo-speech
//       Speech.speak(responseText || "I couldn't find a response.", {
//         rate: 1.0,
//         pitch: 1.0,
//       });

//       // After presenting response we can navigate back or keep on screen
//       // Navigate back to chat and pass response via params if needed
//       // router.push({ pathname: "/chat", params: { fromVoice: true, transcript, responseText } });
//       // For now, just keep on this screen so user can see response and close manually:
//       // If you prefer to automatically go back after reply finishes:
//       // const durationEstimateMs = Math.min((responseText?.length || 50) * 60, 10000);
//       // setTimeout(() => router.push("/chat"), durationEstimateMs);

//     } catch (error) {
//       console.error("handleSend error:", error);
//       Alert.alert("Error", "Failed to send message.");
//       setBackendResponse(null);
//     }
//   };

//   const handleCancel = async () => {
//     await stopListening();
//     router.push("/chat");
//   };

//   return (
//     <SafeAreaView style={styles.screen}>
//       <LinearGradient colors={["#f9f6ff", "#e6f4ff"]} style={styles.background}>
//         <ScrollView contentContainerStyle={styles.container}>
//           {/* Orb / assistant visual */}
//           <View style={styles.orbWrapper}>
//             <View style={styles.orbGlow} />
//             <View style={styles.orbInner} />
//           </View>

//           <BlurView intensity={80} tint="light" style={styles.card}>
//             <Text style={styles.title}>🎤 Speak now</Text>

//             <View style={styles.transcriptBox}>
//               <Text style={styles.transcriptText}>
//                 {transcript || "Tap the mic to start speaking. Speak naturally."}
//               </Text>
//             </View>

//             {showResponseText && backendResponse ? (
//               <View style={styles.responseBox}>
//                 <Text style={styles.responseLabel}>Assistant</Text>
//                 <Text style={styles.responseText}>{backendResponse}</Text>
//               </View>
//             ) : null}

//             <View style={styles.controlsRow}>
//               {/* Start / Stop */}
//               <TouchableOpacity
//                 style={styles.controlBtn}
//                 onPress={listening ? stopListening : startListening}
//                 activeOpacity={0.8}
//               >
//                 <Ionicons
//                   name={listening ? "stop-circle" : "mic-circle"}
//                   size={56}
//                   color="#5b4b8a"
//                 />
//                 <Text style={styles.controlLabel}>{listening ? "Stop" : "Start"}</Text>
//               </TouchableOpacity>

//               {/* Send (only visible if there's transcript) */}
//               <TouchableOpacity
//                 style={[styles.controlBtn, !transcript ? styles.disabledBtn : null]}
//                 onPress={handleSend}
//                 disabled={!transcript}
//                 activeOpacity={0.8}
//               >
//                 <Ionicons name="send" size={36} color="#5b4b8a" />
//                 <Text style={styles.controlLabel}>Send</Text>
//               </TouchableOpacity>

//               {/* Cancel */}
//               <TouchableOpacity style={styles.controlBtn} onPress={handleCancel} activeOpacity={0.8}>
//                 <Ionicons name="close" size={36} color="#5b4b8a" />
//                 <Text style={styles.controlLabel}>Cancel</Text>
//               </TouchableOpacity>
//             </View>

//             {/* Small toggle for showing/hiding text reply (for future) */}
//             <View style={styles.footerRow}>
//               <TouchableOpacity
//                 onPress={() => setShowResponseText((s) => !s)}
//                 style={styles.footerToggle}
//                 activeOpacity={0.8}
//               >
//                 <Ionicons name={showResponseText ? "eye" : "eye-off"} size={18} color="#5b4b8a" />
//                 <Text style={styles.footerToggleText}>
//                   {showResponseText ? "Show text" : "Hide text"}
//                 </Text>
//               </TouchableOpacity>
//             </View>
//           </BlurView>
//         </ScrollView>
//       </LinearGradient>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   screen: {
//     flex: 1,
//     backgroundColor: "#fff",
//   },
//   background: {
//     flex: 1,
//   },
//   container: {
//     padding: 20,
//     alignItems: "center",
//   },
//   orbWrapper: {
//     marginTop: 20,
//     marginBottom: 18,
//     width: 160,
//     height: 160,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   orbGlow: {
//     position: "absolute",
//     width: 160,
//     height: 160,
//     borderRadius: 80,
//     backgroundColor: "#9f7cff30",
//     shadowColor: "#9f7cff",
//     shadowOpacity: 0.8,
//     shadowRadius: 24,
//     elevation: 8,
//   },
//   orbInner: {
//     width: 120,
//     height: 120,
//     borderRadius: 60,
//     backgroundColor: "#7b5bff",
//     opacity: 0.95,
//   },
//   card: {
//     width: "100%",
//     borderRadius: 28,
//     padding: 18,
//     alignItems: "center",
//     backgroundColor: "#ffffffd0",
//     shadowColor: "#000",
//     shadowOpacity: 0.08,
//     shadowRadius: 12,
//     elevation: 6,
//   },
//   title: {
//     fontSize: 20,
//     fontWeight: "700",
//     color: "#5b4b8a",
//     marginBottom: 12,
//   },
//   transcriptBox: {
//     backgroundColor: "#ffffffee",
//     borderRadius: 16,
//     padding: 16,
//     width: "100%",
//     minHeight: 120,
//     justifyContent: "center",
//     marginBottom: 12,
//   },
//   transcriptText: {
//     textAlign: "center",
//     color: "#3c3c6e",
//     fontSize: 16,
//     lineHeight: 22,
//   },
//   responseBox: {
//     width: "100%",
//     backgroundColor: "#f7fff7",
//     borderRadius: 12,
//     padding: 12,
//     marginBottom: 12,
//   },
//   responseLabel: {
//     color: "#2f7f39",
//     fontWeight: "700",
//     marginBottom: 6,
//   },
//   responseText: {
//     color: "#1b1b2b",
//     fontSize: 15,
//     lineHeight: 20,
//   },
//   controlsRow: {
//     flexDirection: "row",
//     width: "100%",
//     justifyContent: "space-around",
//     marginTop: 8,
//     marginBottom: 6,
//   },
//   controlBtn: {
//     alignItems: "center",
//     minWidth: 90,
//   },
//   disabledBtn: {
//     opacity: 0.5,
//   },
//   controlLabel: {
//     color: "#3c3c6e",
//     marginTop: 6,
//     fontSize: 13,
//     fontWeight: "600",
//   },
//   footerRow: {
//     width: "100%",
//     alignItems: "flex-end",
//     marginTop: 10,
//   },
//   footerToggle: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 8,
//   },
//   footerToggleText: {
//     color: "#5b4b8a",
//     marginLeft: 6,
//     fontWeight: "600",
//   },
// });



// app/voice/index.js
import { Ionicons } from "@expo/vector-icons";
import { Audio } from "expo-av";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import * as Speech from "expo-speech";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

import * as SpeechRecognition from "expo-speech-recognition";
import FloatingAssistant from "../../components/FloatingAssistant"; // Adjust path as needed
import { sendChatMessage } from "../../utils/api";

export default function VoiceScreen() {
  const router = useRouter();

  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [backendResponse, setBackendResponse] = useState(null);
  const [showResponseText, setShowResponseText] = useState(true);
  const listenerRef = useRef(null);

  useEffect(() => {
    (async () => {
      await requestPermissions();
      const available = SpeechRecognition.isRecognitionAvailable
        ? await SpeechRecognition.isRecognitionAvailable()
        : true;
      if (!available) {
        console.warn("Speech recognition not available on this device/browser.");
      }
    })();

    return () => {
      stopListening();
      try {
        if (SpeechRecognition.removeAllRecordingListeners) {
          SpeechRecognition.removeAllRecordingListeners();
        }
      } catch (e) {}
    };
  }, []);

  const requestPermissions = async () => {
    try {
      const audioPerm = await Audio.requestPermissionsAsync && (await Audio.requestPermissionsAsync());
      if (SpeechRecognition.requestPermissionsAsync) {
        const srPerm = await SpeechRecognition.requestPermissionsAsync();
        if (srPerm.status && srPerm.status !== "granted") {
          Alert.alert(
            "Permission required",
            "Microphone / Speech recognition permission is required to use voice chat."
          );
        }
      } else {
        if (audioPerm && audioPerm.status !== "granted") {
          Alert.alert("Permission required", "Microphone permission is required to use voice chat.");
        }
      }
    } catch (error) {
      console.error("Permission error:", error);
      Alert.alert("Permission error", "Could not get microphone permission. Try again from settings.");
    }
  };

  const startListening = async () => {
    try {
      if (SpeechRecognition.requestPermissionsAsync) {
        const p = await SpeechRecognition.requestPermissionsAsync();
        if (p.status && p.status !== "granted") {
          Alert.alert("Permission required", "Microphone permission required to start recording.");
          return;
        }
      }

      setTranscript("");
      setBackendResponse(null);

      if (SpeechRecognition.startRecordingAsync) {
        await SpeechRecognition.startRecordingAsync({
          language: "en-US",
        });
      } else if (SpeechRecognition.startAsync) {
        await SpeechRecognition.startAsync({ language: "en-US" });
      } else {
        throw new Error("SpeechRecognition.start not available on this platform");
      }

      if (SpeechRecognition.addRecordingListener) {
        listenerRef.current = SpeechRecognition.addRecordingListener((event) => {
          if (event?.results && event.results.length > 0) {
            const first = event.results[0];
            const text = first.text ?? first.transcript ?? "";
            setTranscript(text);
          } else if (event?.text) {
            setTranscript(event.text);
          }
        });
      }

      setListening(true);
      setTranscript("Listening...");
    } catch (error) {
      console.error("startListening error:", error);
      Alert.alert("Error", "Failed to start voice recognition.");
    }
  };

  const stopListening = async () => {
    try {
      if (SpeechRecognition.stopRecordingAsync) {
        await SpeechRecognition.stopRecordingAsync();
      } else if (SpeechRecognition.stopAsync) {
        await SpeechRecognition.stopAsync();
      }

      if (SpeechRecognition.removeAllRecordingListeners) {
        SpeechRecognition.removeAllRecordingListeners();
      } else if (SpeechRecognition.removeRecordingListener && listenerRef.current) {
        SpeechRecognition.removeRecordingListener(listenerRef.current);
      }

      setListening(false);

      if (transcript === "Listening...") {
        setTranscript("");
      }
    } catch (error) {
      console.error("stopListening error:", error);
    }
  };

  const handleSend = async () => {
    if (!transcript || transcript === "Listening...") {
      Alert.alert("No input", "Please speak something first.");
      return;
    }

    try {
      await stopListening();

      setBackendResponse("Thinking...");
      const responseText = await sendChatMessage(transcript);

      setBackendResponse(responseText || "I couldn't find a response.");
      Speech.speak(responseText || "I couldn't find a response.", {
        rate: 1.0,
        pitch: 1.0,
      });

    } catch (error) {
      console.error("handleSend error:", error);
      Alert.alert("Error", "Failed to send message.");
      setBackendResponse(null);
    }
  };

  const handleCancel = async () => {
    await stopListening();
    router.push("/chat");
  };

  return (
    <SafeAreaView style={styles.screen}>
      <LinearGradient 
        colors={["#faf5ff", "#f0e7ff", "#e6f4ff"]} 
        style={styles.background}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <ScrollView contentContainerStyle={styles.container}>
          {/* Enhanced Floating Assistant */}
          <View style={styles.assistantWrapper}>
            <FloatingAssistant withEyes={true} />
          </View>

          {/* Glass Morphism Card */}
          <BlurView intensity={90} tint="light" style={styles.glassCard}>
            {/* Status Indicator */}
            <View style={styles.statusContainer}>
              <View style={[
                styles.statusIndicator, 
                listening ? styles.listening : styles.idle
              ]} />
              <Text style={styles.statusText}>
                {listening ? "Listening..." : "Ready to listen"}
              </Text>
            </View>

            <Text style={styles.title}>🎤 Voice Assistant</Text>

            {/* Transcript Box with Glass Effect */}
            <View style={styles.glassBox}>
              <Text style={styles.transcriptText}>
                {transcript || "Tap the microphone to start speaking. I'm listening..."}
              </Text>
            </View>

            {/* Response Box with Premium Styling */}
            {showResponseText && backendResponse ? (
              <View style={styles.responseGlassBox}>
                <View style={styles.responseHeader}>
                  <Ionicons name="sparkles" size={16} color="#7c3aed" />
                  <Text style={styles.responseLabel}>Assistant Response</Text>
                </View>
                <Text style={styles.responseText}>{backendResponse}</Text>
              </View>
            ) : null}

            {/* Premium Control Buttons */}
            <View style={styles.controlsRow}>
              {/* Start/Stop Button */}
              <TouchableOpacity
                style={[
                  styles.glassButton,
                  listening && styles.listeningButton
                ]}
                onPress={listening ? stopListening : startListening}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={listening ? ["#ef4444", "#dc2626"] : ["#8b5cf6", "#7c3aed"]}
                  style={styles.buttonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Ionicons
                    name={listening ? "stop-circle" : "mic-circle"}
                    size={32}
                    color="#fff"
                  />
                </LinearGradient>
                <Text style={styles.controlLabel}>
                  {listening ? "Stop" : "Start"}
                </Text>
              </TouchableOpacity>

              {/* Send Button */}
              <TouchableOpacity
                style={[
                  styles.glassButton,
                  !transcript && styles.disabledButton
                ]}
                onPress={handleSend}
                disabled={!transcript}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={["#10b981", "#059669"]}
                  style={styles.buttonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Ionicons name="send" size={24} color="#fff" />
                </LinearGradient>
                <Text style={styles.controlLabel}>Send</Text>
              </TouchableOpacity>

              {/* Cancel Button */}
              <TouchableOpacity 
                style={styles.glassButton}
                onPress={handleCancel}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={["#6b7280", "#4b5563"]}
                  style={styles.buttonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Ionicons name="close" size={24} color="#fff" />
                </LinearGradient>
                <Text style={styles.controlLabel}>Cancel</Text>
              </TouchableOpacity>
            </View>

            {/* Footer Toggle */}
            <View style={styles.footerRow}>
              <TouchableOpacity
                onPress={() => setShowResponseText((s) => !s)}
                style={styles.footerToggle}
                activeOpacity={0.8}
              >
                <Ionicons 
                  name={showResponseText ? "eye" : "eye-off"} 
                  size={18} 
                  color="#7c3aed" 
                />
                <Text style={styles.footerToggleText}>
                  {showResponseText ? "Hide response" : "Show response"}
                </Text>
              </TouchableOpacity>
            </View>
          </BlurView>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#fff",
  },
  background: {
    flex: 1,
  },
  container: {
    padding: 20,
    alignItems: "center",
    minHeight: "100%",
  },
  assistantWrapper: {
    marginTop: 20,
    marginBottom: 30,
  },
  glassCard: {
    width: "100%",
    borderRadius: 32,
    padding: 24,
    alignItems: "center",
    backgroundColor: "#ffffff88",
    shadowColor: "#8b5cf6",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 12,
    borderWidth: 1,
    borderColor: "#ffffff40",
    overflow: "hidden",
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#ffffff60",
    borderRadius: 20,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  listening: {
    backgroundColor: "#ef4444",
    shadowColor: "#ef4444",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 4,
  },
  idle: {
    backgroundColor: "#10b981",
    shadowColor: "#10b981",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 4,
  },
  statusText: {
    color: "#374151",
    fontSize: 14,
    fontWeight: "600",
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#7c3aed",
    marginBottom: 20,
    textAlign: "center",
  },
  glassBox: {
    backgroundColor: "#ffffffee",
    borderRadius: 20,
    padding: 20,
    width: "100%",
    minHeight: 140,
    justifyContent: "center",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: "#ffffff80",
  },
  transcriptText: {
    textAlign: "center",
    color: "#374151",
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "500",
  },
  responseGlassBox: {
    width: "100%",
    backgroundColor: "#f0fdf4ee",
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#10b981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: "#d1fae580",
  },
  responseHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  responseLabel: {
    color: "#065f46",
    fontWeight: "700",
    fontSize: 16,
    marginLeft: 8,
  },
  responseText: {
    color: "#1f2937",
    fontSize: 15,
    lineHeight: 22,
  },
  controlsRow: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-around",
    marginTop: 16,
    marginBottom: 8,
  },
  glassButton: {
    alignItems: "center",
    minWidth: 80,
  },
  buttonGradient: {
    width: 60,
    height: 60,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    marginBottom: 8,
  },
  listeningButton: {
    shadowColor: "#ef4444",
    shadowOpacity: 0.4,
  },
  disabledButton: {
    opacity: 0.6,
  },
  controlLabel: {
    color: "#374151",
    fontSize: 13,
    fontWeight: "700",
    textAlign: "center",
  },
  footerRow: {
    width: "100%",
    alignItems: "center",
    marginTop: 16,
  },
  footerToggle: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#ffffff60",
    borderRadius: 20,
  },
  footerToggleText: {
    color: "#7c3aed",
    marginLeft: 6,
    fontWeight: "600",
    fontSize: 14,
  },
});
