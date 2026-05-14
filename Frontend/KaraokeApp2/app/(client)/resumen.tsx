import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    Alert,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { getPedidosPorReserva } from "../../services/clienteService";

interface Pedido {
  idPedido: number;
  estadoPedido: string;
  total: number;
  detalles: { idDetallePedido: number; cantidad: number; subtotal: number; producto: { nombre: string } }[];
}

function useTiempoRestante(fechaHoraFin: string) {
  const [segundos, setSegundos] = useState(0);

  useEffect(() => {
    function calcular() {
      const diff = Math.max(0, new Date(fechaHoraFin).getTime() - Date.now());
      setSegundos(Math.floor(diff / 1000));
    }
    calcular();
    const interval = setInterval(calcular, 1000);
    return () => clearInterval(interval);
  }, [fechaHoraFin]);

  const horas = Math.floor(segundos / 3600);
  const minutos = Math.floor((segundos % 3600) / 60);
  const segs = segundos % 60;
  const porcentaje = (() => {
    const total = new Date(fechaHoraFin).getTime();
    const inicio = total - 4 * 3600 * 1000; // estimado 4h máx
    const ahora = Date.now();
    if (ahora >= total) return 0;
    if (ahora <= inicio) return 100;
    return Math.round(((total - ahora) / (total - inicio)) * 100);
  })();

  return { horas, minutos, segs, segundos, porcentaje };
}

export default function ResumenScreen() {
  const { idReserva, idSala, fechaHoraFin } = useLocalSearchParams<{
    idReserva: string;
    idSala: string;
    fechaHoraFin: string;
  }>();
  const router = useRouter();
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const { horas, minutos, segs, segundos, porcentaje } = useTiempoRestante(fechaHoraFin!);

  useEffect(() => {
    getPedidosPorReserva(parseInt(idReserva!))
      .then(setPedidos)
      .catch((e) => Alert.alert("Error", e.message));
  }, []);

  const totalConsumo = pedidos.reduce((sum, p) => sum + p.total, 0);
  const tiempoAgotado = segundos === 0;
  const tiempoColor = segundos < 600 ? "#EF4444" : segundos < 1800 ? "#EAB308" : "#22C55E";

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
        <View>
          <Text style={{ color: "#6B7280", fontSize: 12 }}>Sala {idSala}</Text>
          <Text style={{ color: "white", fontSize: 20, fontWeight: "bold" }}>Mi cuenta</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 120 }} showsVerticalScrollIndicator={false}>

        {/* Tarjeta de tiempo */}
        <View style={{ backgroundColor: "#1A1A2E", borderRadius: 20, padding: 20, marginBottom: 16 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <Ionicons name="time-outline" size={20} color={tiempoColor} />
              <Text style={{ color: "white", fontWeight: "600", fontSize: 16 }}>
                {tiempoAgotado ? "Tiempo agotado" : "Tiempo restante"}
              </Text>
            </View>
            {!tiempoAgotado && (
              <View style={{ backgroundColor: tiempoColor + "22", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 }}>
                <Text style={{ color: tiempoColor, fontWeight: "700", fontSize: 12 }}>{porcentaje}%</Text>
              </View>
            )}
          </View>

          {/* Reloj grande */}
          {tiempoAgotado ? (
            <View style={{ alignItems: "center", paddingVertical: 12 }}>
              <Ionicons name="alert-circle-outline" size={40} color="#EF4444" />
              <Text style={{ color: "#EF4444", fontSize: 18, fontWeight: "700", marginTop: 8 }}>Tu tiempo ha terminado</Text>
              <Text style={{ color: "#6B7280", fontSize: 13, marginTop: 4 }}>Por favor avisa al empleado</Text>
            </View>
          ) : (
            <View style={{ flexDirection: "row", justifyContent: "center", gap: 4, marginBottom: 16 }}>
              {[
                { val: horas.toString().padStart(2, "0"), label: "horas" },
                { val: minutos.toString().padStart(2, "0"), label: "min" },
                { val: segs.toString().padStart(2, "0"), label: "seg" },
              ].map((item, i) => (
                <View key={i} style={{ alignItems: "center", flexDirection: "row", gap: 4 }}>
                  {i > 0 && <Text style={{ color: tiempoColor, fontSize: 28, fontWeight: "900", marginBottom: 14 }}>:</Text>}
                  <View style={{ backgroundColor: "#0F0F1A", borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8, alignItems: "center", minWidth: 60 }}>
                    <Text style={{ color: tiempoColor, fontSize: 32, fontWeight: "900", fontVariant: ["tabular-nums"] }}>{item.val}</Text>
                    <Text style={{ color: "#6B7280", fontSize: 10, marginTop: 2 }}>{item.label}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Barra de progreso */}
          {!tiempoAgotado && (
            <View style={{ height: 6, backgroundColor: "#0F0F1A", borderRadius: 3, overflow: "hidden" }}>
              <View style={{ width: `${porcentaje}%`, height: "100%", backgroundColor: tiempoColor, borderRadius: 3 }} />
            </View>
          )}
        </View>

        {/* Tarjeta consumo total */}
        <View style={{ backgroundColor: "#1A1A2E", borderRadius: 20, padding: 20, marginBottom: 16 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <Ionicons name="cash-outline" size={20} color="#7C3AED" />
              <Text style={{ color: "white", fontWeight: "600", fontSize: 16 }}>Consumo en pedidos</Text>
            </View>
            <Text style={{ color: "#7C3AED", fontSize: 22, fontWeight: "900" }}>
              ${totalConsumo.toLocaleString()}
            </Text>
          </View>
          <Text style={{ color: "#6B7280", fontSize: 12, marginTop: 8 }}>
            * El valor de la sala se calcula al cerrar la reserva
          </Text>
        </View>

        {/* Historial de pedidos colapsado */}
        {pedidos.length > 0 && (
          <View>
            <Text style={{ color: "#6B7280", fontSize: 12, letterSpacing: 1, marginBottom: 12 }}>
              HISTORIAL DE PEDIDOS ({pedidos.length})
            </Text>
            {pedidos.map((pedido, idx) => (
              <View key={pedido.idPedido} style={{ backgroundColor: "#1A1A2E", borderRadius: 14, padding: 14, marginBottom: 8 }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                  <Text style={{ color: "#6B7280", fontSize: 13 }}>Pedido #{idx + 1}</Text>
                  <Text style={{ color: "white", fontWeight: "700" }}>${pedido.total.toLocaleString()}</Text>
                </View>
                {pedido.detalles.slice(0, 2).map((d) => (
                  <Text key={d.idDetallePedido} style={{ color: "#6B7280", fontSize: 12, marginTop: 4 }}>
                    {d.cantidad}× {d.producto?.nombre}
                  </Text>
                ))}
                {pedido.detalles.length > 2 && (
                  <Text style={{ color: "#6B7280", fontSize: 12, marginTop: 4 }}>
                    +{pedido.detalles.length - 2} más...
                  </Text>
                )}
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Acciones inferiores */}
      <View style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        backgroundColor: "#1A1A2E",
        borderTopLeftRadius: 24, borderTopRightRadius: 24,
        padding: 20, paddingBottom: 36,
        flexDirection: "row", gap: 12,
      }}>
        <TouchableOpacity
          onPress={() => router.push({ pathname: "/(client)/pedido-estado", params: { idReserva, idSala, fechaHoraFin } })}
          style={{ flex: 1, backgroundColor: "#0F0F1A", borderRadius: 12, paddingVertical: 14, alignItems: "center", flexDirection: "row", justifyContent: "center", gap: 6 }}
        >
          <Ionicons name="time-outline" size={18} color="#7C3AED" />
          <Text style={{ color: "#7C3AED", fontWeight: "600" }}>Mis pedidos</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ flex: 1, backgroundColor: "#7C3AED", borderRadius: 12, paddingVertical: 14, alignItems: "center", flexDirection: "row", justifyContent: "center", gap: 6 }}
        >
          <Ionicons name="fast-food-outline" size={18} color="white" />
          <Text style={{ color: "white", fontWeight: "600" }}>Pedir más</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}