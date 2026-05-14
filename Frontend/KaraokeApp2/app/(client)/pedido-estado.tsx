import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { getPedidosPorReserva } from "../../services/clienteService";

interface DetallePedido {
  idDetallePedido: number;
  cantidad: number;
  subtotal: number;
  producto: { nombre: string; precio: number };
}

interface Pedido {
  idPedido: number;
  estadoPedido: "Pendiente" | "En preparación" | "Entregado";
  fechaHora: string;
  total: number;
  detalles: DetallePedido[];
}

const ESTADO_CONFIG = {
  Pendiente: { color: "#EAB308", bg: "#EAB30822", icon: "time-outline" as const, label: "Pendiente" },
  "En preparación": { color: "#7C3AED", bg: "#7C3AED22", icon: "flame-outline" as const, label: "En preparación" },
  Entregado: { color: "#22C55E", bg: "#22C55E22", icon: "checkmark-circle-outline" as const, label: "Entregado" },
};

export default function PedidoEstadoScreen() {
  const { idReserva, idSala, fechaHoraFin } = useLocalSearchParams<{
    idReserva: string;
    idSala: string;
    fechaHoraFin: string;
  }>();
  const router = useRouter();
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  async function cargarPedidos() {
    try {
      const data = await getPedidosPorReserva(parseInt(idReserva!));
      setPedidos(data);
    } catch (e: any) {
      Alert.alert("Error", e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    cargarPedidos();
    // Polling cada 8 segundos para actualizar estados
    intervalRef.current = setInterval(cargarPedidos, 8000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const totalConsumo = pedidos.reduce((sum, p) => sum + p.total, 0);
  const hayPendientes = pedidos.some((p) => p.estadoPedido !== "Entregado");

  return (
    <View style={{ flex: 1, backgroundColor: "#0F0F1A" }}>
      {/* Header */}
      <View style={{ paddingTop: 52, paddingHorizontal: 24, paddingBottom: 16, flexDirection: "row", alignItems: "center", gap: 12 }}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ backgroundColor: "#1A1A2E", padding: 8, borderRadius: 10 }}
        >
          <Ionicons name="chevron-back" size={20} color="white" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={{ color: "#6B7280", fontSize: 12 }}>Sala {idSala}</Text>
          <Text style={{ color: "white", fontSize: 20, fontWeight: "bold" }}>Mis pedidos</Text>
        </View>
        {hayPendientes && (
          <View style={{ backgroundColor: "#EAB30822", paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20, flexDirection: "row", alignItems: "center", gap: 4 }}>
            <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: "#EAB308" }} />
            <Text style={{ color: "#EAB308", fontSize: 11, fontWeight: "600" }}>En proceso</Text>
          </View>
        )}
      </View>

      {loading ? (
        <ActivityIndicator color="#7C3AED" size="large" style={{ marginTop: 60 }} />
      ) : pedidos.length === 0 ? (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: 12 }}>
          <Ionicons name="receipt-outline" size={48} color="#6B7280" />
          <Text style={{ color: "#6B7280", fontSize: 15 }}>Aún no tienes pedidos</Text>
          <TouchableOpacity
            onPress={() => router.back()}
            style={{ backgroundColor: "#1A1A2E", paddingHorizontal: 20, paddingVertical: 10, borderRadius: 12, marginTop: 8 }}
          >
            <Text style={{ color: "#7C3AED", fontWeight: "600" }}>Ver el menú</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 140 }} showsVerticalScrollIndicator={false}>
          {pedidos.map((pedido) => {
            const config = ESTADO_CONFIG[pedido.estadoPedido] ?? ESTADO_CONFIG["Pendiente"];
            const hora = new Date(pedido.fechaHora).toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" });

            return (
              <View key={pedido.idPedido} style={{ backgroundColor: "#1A1A2E", borderRadius: 16, padding: 16, marginBottom: 12 }}>
                {/* Estado y hora */}
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <View style={{ backgroundColor: config.bg, flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 }}>
                    <Ionicons name={config.icon} size={14} color={config.color} />
                    <Text style={{ color: config.color, fontSize: 12, fontWeight: "600" }}>{config.label}</Text>
                  </View>
                  <Text style={{ color: "#6B7280", fontSize: 12 }}>{hora}</Text>
                </View>

                {/* Detalle de productos */}
                {pedido.detalles.map((detalle) => (
                  <View key={detalle.idDetallePedido} style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 6 }}>
                    <Text style={{ color: "white", fontSize: 14 }}>
                      {detalle.cantidad}× {detalle.producto?.nombre ?? "Producto"}
                    </Text>
                    <Text style={{ color: "#6B7280", fontSize: 14 }}>
                      ${detalle.subtotal.toLocaleString()}
                    </Text>
                  </View>
                ))}

                {/* Total pedido */}
                <View style={{ borderTopWidth: 1, borderTopColor: "#0F0F1A", marginTop: 8, paddingTop: 8, flexDirection: "row", justifyContent: "space-between" }}>
                  <Text style={{ color: "#6B7280", fontSize: 13 }}>Total pedido</Text>
                  <Text style={{ color: "white", fontWeight: "700" }}>${pedido.total.toLocaleString()}</Text>
                </View>
              </View>
            );
          })}
        </ScrollView>
      )}

      {/* Barra inferior */}
      <View style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        backgroundColor: "#1A1A2E",
        borderTopLeftRadius: 24, borderTopRightRadius: 24,
        padding: 20, paddingBottom: 36,
        flexDirection: "row", gap: 12,
      }}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ flex: 1, backgroundColor: "#0F0F1A", borderRadius: 12, paddingVertical: 14, alignItems: "center", flexDirection: "row", justifyContent: "center", gap: 6 }}
        >
          <Ionicons name="fast-food-outline" size={18} color="white" />
          <Text style={{ color: "white", fontWeight: "600" }}>Pedir más</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.push({ pathname: "/(client)/resumen", params: { idReserva, idSala, fechaHoraFin } })}
          style={{ flex: 1, backgroundColor: "#7C3AED", borderRadius: 12, paddingVertical: 14, alignItems: "center", flexDirection: "row", justifyContent: "center", gap: 6 }}
        >
          <Ionicons name="receipt-outline" size={18} color="white" />
          <Text style={{ color: "white", fontWeight: "600" }}>Mi cuenta</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}