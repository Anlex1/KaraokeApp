import { Slot, useRouter, useSegments } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import "../global.css";
import { getUsuario } from "../services/authService";
import { Usuario } from "../types";

export default function RootLayout() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    getUsuario().then((usuario) => {
      setUsuario(usuario);
      setLoading(false);
    });
  }, []);

 useEffect(() => {
    if (loading) return;

    const inAuth = segments[0] === "(auth)";
    const inClient = segments[0] === "(client)";

    if (!usuario && !inAuth && !inClient) {
      router.replace("/(auth)/login");
    } else if (usuario) {
      // AQUÍ VOLVEMOS A LA NORMALIDAD:
      if (usuario.rol === "admin") {
        router.replace("/(admin)" as any);
      } else {
        router.replace("/(employee)" as any);
      }
    }
  }, [usuario, loading]);

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: "#0F0F1A", alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator color="#7C3AED" size="large" />
      </View>
    );
  }

  return <Slot />;
}