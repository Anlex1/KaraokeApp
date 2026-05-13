import { Text, View } from "react-native";

export default function ScanScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: "#0F0F1A", alignItems: "center", justifyContent: "center" }}>
      <Text style={{ color: "white" }}>Scan QR</Text>
    </View>
  );
}