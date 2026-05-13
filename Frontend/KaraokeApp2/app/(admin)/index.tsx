import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { getUsuario, logout } from "../../services/authService";

const opciones = [
  { label: "Salas", icon: "musical-notes", route: "/(admin)/salas", color: "#7C3AED" },
  { label: "Productos", icon: "fast-food", route: "/(admin)/productos", color: "#EC4899" },
  { label: "Empleados", icon: "people", route: "/(admin)/empleados", color: "#06B6D4" },
];

export default function AdminScreen() {
  const router = useRouter();
  const [nombre, setNombre] = useState("");

  useEffect(() => {
    getUsuario().then((u) => setNombre(u?.nombre ?? "Admin"));
  }, []);

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
    <View style={{ flex: 1, backgroundColor: "#0F0F1A", padding: 24 }}>

      {/* Header */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 48, marginBottom: 32 }}>
        <View>
          <Text style={{ color: "#6B7280", fontSize: 13 }}>Bienvenido,</Text>
          <Text style={{ color: "white", fontSize: 22, fontWeight: "bold" }}>{nombre}</Text>
        </View>
        <TouchableOpacity onPress={handleLogout} style={{ backgroundColor: "#1A1A2E", padding: 10, borderRadius: 12 }}>
          <Ionicons name="log-out-outline" size={24} color="#EC4899" />
        </TouchableOpacity>
      </View>

      {/* Título */}
      <Text style={{ color: "#6B7280", fontSize: 13, marginBottom: 16, letterSpacing: 1 }}>
        PANEL DE ADMINISTRACIÓN
      </Text>

      {/* Tarjetas */}
      <View style={{ gap: 16 }}>
        {opciones.map((op) => (
          <TouchableOpacity
            key={op.label}
            onPress={() => router.push(op.route as any)}
            style={{ backgroundColor: "#1A1A2E", borderRadius: 16, padding: 24, flexDirection: "row", alignItems: "center", gap: 16 }}
            activeOpacity={0.8}
          >
            <View style={{ backgroundColor: op.color + "22", padding: 12, borderRadius: 12 }}>
              <Ionicons name={op.icon as any} size={28} color={op.color} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: "white", fontSize: 18, fontWeight: "600" }}>{op.label}</Text>
              <Text style={{ color: "#6B7280", fontSize: 13, marginTop: 2 }}>Gestionar {op.label.toLowerCase()}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#6B7280" />
          </TouchableOpacity>
        ))}
      </View>

    </View>
  );
}