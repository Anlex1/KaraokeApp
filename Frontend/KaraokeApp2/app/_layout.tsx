import { Slot, useRouter, useSegments } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import "../global.css";
import { getSession } from "../lib/auth";
import { Usuario } from "../types";

export default function RootLayout() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    getSession().then((session) => {
      setUsuario(session?.usuario ?? null);
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
      if (usuario.rol === "admin") router.replace("/(admin)");
      else router.replace("/(employee)");
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