// components/VoiceRecordingModal.js
import { LinearGradient } from "expo-linear-gradient";
import {
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import FloatingAssistant from "./FloatingAssistant";

export default function VoiceRecordingModal({
  visible,
  onCancel,
  onSend,
  recordingText = "Listening...",
}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <LinearGradient
        colors={["#8e2de299", "#4a00e099"]}
        style={styles.overlay}
      >
        <View style={styles.container}>
          <FloatingAssistant />
          <Text style={styles.text}>{recordingText}</Text>

          <View style={styles.buttons}>
            <TouchableOpacity style={[styles.btn, styles.cancel]} onPress={onCancel}>
              <Text style={styles.btnText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.btn, styles.send]} onPress={onSend}>
              <Text style={styles.btnText}>Send</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 30,
    alignItems: "center",
    width: "80%",
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  text: {
    fontSize: 18,
    color: "#4a00e0",
    marginVertical: 20,
    fontWeight: "500",
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  btn: {
    flex: 1,
    marginHorizontal: 8,
    borderRadius: 20,
    paddingVertical: 10,
    alignItems: "center",
  },
  cancel: {
    backgroundColor: "#ddd",
  },
  send: {
    backgroundColor: "#8e2de2",
  },
  btnText: {
    color: "#fff",
    fontWeight: "600",
  },
});
