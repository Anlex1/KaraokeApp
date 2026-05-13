import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { logout } from "../../services/authService";

export default function EmployeeScreen() {
  const router = useRouter();

  async function handleLogout() {
    Alert.alert("Cerrar sesión", "¿Estás seguro?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Salir",
        style: "destructive",
        onPress: async () => {
          await logout();
          router.replace("/(auth)/login");
        },
      },
    ]);
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#0F0F1A", alignItems: "center", justifyContent: "center" }}>
      <Text style={{ color: "white", fontSize: 20, marginBottom: 24 }}>Módulo Empleado</Text>
      <TouchableOpacity onPress={handleLogout} style={{ backgroundColor: "#1A1A2E", padding: 12, borderRadius: 12, flexDirection: "row", alignItems: "center", gap: 8 }}>
        <Ionicons name="log-out-outline" size={20} color="#EC4899" />
        <Text style={{ color: "#EC4899", fontWeight: "600" }}>Cerrar sesión</Text>
      </TouchableOpacity>
    </View>
  );
}