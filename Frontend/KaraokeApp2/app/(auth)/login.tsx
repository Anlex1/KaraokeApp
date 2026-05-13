import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { api } from "../../lib/api";
import { saveSession } from "../../lib/auth";
import { AuthResponse } from "../../types";

export default function LoginScreen() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!username || !password) {
      Alert.alert("Campos requeridos", "Ingresa usuario y contraseña.");
      return;
    }

    setLoading(true);
    try {
      const data = await api.post<AuthResponse>("/Auth/login", {
        username,
        contraseña: password,
      });

      await saveSession(data.token, data.usuario);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      if (data.usuario.rol === "admin") router.replace("/(admin)");
      else router.replace("/(employee)");
    } catch (e: any) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("Error", e.message || "Credenciales incorrectas.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, backgroundColor: "#0F0F1A" }}
    >
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 32 }}>

        {/* Logo */}
        <View style={{ marginBottom: 40, alignItems: "center" }}>
          <Ionicons name="mic" size={56} color="#7C3AED" />
          <Text style={{ color: "white", fontSize: 32, fontWeight: "bold", marginTop: 12, letterSpacing: 4 }}>
            KaraokeApp
          </Text>
          <Text className="text-red-500 text-2xl">Test Tailwind</Text>
          <Text style={{ color: "#6B7280", fontSize: 13, marginTop: 4 }}>
            Sistema de gestión interno
          </Text>
        </View>

        {/* Card */}
        <View style={{ width: "100%", backgroundColor: "#1A1A2E", borderRadius: 16, padding: 24, gap: 16 }}>
          <Text style={{ color: "white", fontSize: 20, fontWeight: "600", marginBottom: 8 }}>
            Iniciar sesión
          </Text>

          {/* Usuario */}
          <View style={{ backgroundColor: "#0F0F1A", borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, flexDirection: "row", alignItems: "center", gap: 12 }}>
            <Ionicons name="person-outline" size={20} color="#6B7280" />
            <TextInput
              style={{ flex: 1, color: "white", fontSize: 16 }}
              placeholder="Usuario"
              placeholderTextColor="#6B7280"
              autoCapitalize="none"
              value={username}
              onChangeText={setUsername}
            />
          </View>

          {/* Contraseña */}
          <View style={{ backgroundColor: "#0F0F1A", borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, flexDirection: "row", alignItems: "center", gap: 12 }}>
            <Ionicons name="lock-closed-outline" size={20} color="#6B7280" />
            <TextInput
              style={{ flex: 1, color: "white", fontSize: 16 }}
              placeholder="Contraseña"
              placeholderTextColor="#6B7280"
              secureTextEntry={!showPass}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={() => setShowPass(!showPass)}>
              <Ionicons
                name={showPass ? "eye-off-outline" : "eye-outline"}
                size={20}
                color="#6B7280"
              />
            </TouchableOpacity>
          </View>

          {/* Botón */}
          <TouchableOpacity
            onPress={handleLogin}
            disabled={loading}
            style={{ backgroundColor: "#7C3AED", borderRadius: 12, paddingVertical: 16, alignItems: "center", marginTop: 8 }}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>
                Ingresar
              </Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Acceso cliente */}
        <TouchableOpacity
          style={{ marginTop: 24 }}
          onPress={() => router.push("/(client)/scan")}
        >
          <Text style={{ color: "#6B7280", fontSize: 13, textAlign: "center" }}>
            ¿Eres cliente?{" "}
            <Text style={{ color: "#EC4899", fontWeight: "600" }}>
              Escanea el QR de tu sala
            </Text>
          </Text>
        </TouchableOpacity>

      </View>
    </KeyboardAvoidingView>
  );
}