import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { actualizarEstadoPedido, getPedidosPorReserva, getReservaActivaPorSala, getSalas } from "../../services/empleadoService";

interface DetallePedido {
  idDetallePedido: number;
  cantidad: number;
  subtotal: number;
  producto: { nombre: string; precio: number };
}

interface Pedido {
  idPedido: number;
  idReserva: number;
  estadoPedido: "Pendiente" | "En preparación" | "Entregado";
  fechaHora: string;
  total: number;
  numeroSala?: number;
  detalles: DetallePedido[];
}

const ESTADO_CONFIG = {
  Pendiente: { color: "#EAB308", bg: "#EAB30822", label: "Pendiente", icon: "time-outline" as const },
  "En preparación": { color: "#7C3AED", bg: "#7C3AED22", label: "En preparación", icon: "flame-outline" as const },
  Entregado: { color: "#22C55E", bg: "#22C55E22", label: "Entregado", icon: "checkmark-circle-outline" as const },
};

export default function PedidosEmpleadoScreen() {
  const router = useRouter();
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [actualizando, setActualizando] = useState<number | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const cargarTodosPedidos = useCallback(async () => {
    try {
      // 1. Obtenemos todas las salas
      const salas = await getSalas();
      // 2. Para cada sala ocupada, buscamos su reserva activa y sus pedidos pendientes
      const resultados: Pedido[] = [];

      await Promise.all(
        salas
          .filter((s: any) => s.estado === "Ocupada")
          .map(async (sala: any) => {
            try {
              const reserva = await getReservaActivaPorSala(sala.idSala);
              const pedidosSala = await getPedidosPorReserva(reserva.idReserva);
              const noEntregados = pedidosSala
                .filter((p: any) => p.estadoPedido !== "Entregado")
                .map((p: any) => ({ ...p, numeroSala: sala.numeroSala }));
              resultados.push(...noEntregados);
            } catch {
              // sala ocupada sin reserva activa encontrada — ignorar
            }
          })
      );

      // Ordenar: Pendientes primero, luego En preparación
      resultados.sort((a, b) => {
        const orden = { Pendiente: 0, "En preparación": 1, Entregado: 2 };
        return (orden[a.estadoPedido] ?? 3) - (orden[b.estadoPedido] ?? 3);
      });

      setPedidos(resultados);
    } catch (e: any) {
      Alert.alert("Error", e.message || "Error al cargar pedidos.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    cargarTodosPedidos();
    intervalRef.current = setInterval(cargarTodosPedidos, 10000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    cargarTodosPedidos();
  };

  async function handleCambiarEstado(
    pedido: Pedido,
    nuevoEstado: "En preparación" | "Entregado"
  ) {
    setActualizando(pedido.idPedido);
    try {
      await actualizarEstadoPedido(pedido.idPedido, nuevoEstado);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      await cargarTodosPedidos();
    } catch (e: any) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("Error", e.message || "No se pudo actualizar el pedido.");
    } finally {
      setActualizando(null);
    }
  }

  const pendientes = pedidos.filter((p) => p.estadoPedido === "Pendiente").length;
  const enPrep = pedidos.filter((p) => p.estadoPedido === "En preparación").length;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={() => router.replace("/(employee)" as any)}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={20} color="white" />
        </TouchableOpacity>
        <View style={{ marginLeft: 12, flex: 1 }}>
          <Text style={styles.subtitle}>Comandas y Consumos</Text>
          <Text style={styles.title}>Pedidos en Espera</Text>
        </View>
        {pendientes > 0 && (
          <View style={styles.alertBadge}>
            <Text style={styles.alertBadgeText}>{pendientes} nuevos</Text>
          </View>
        )}
      </View>

      {/* Resumen */}
      {!loading && (
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { borderColor: "#EAB30833" }]}>
            <Text style={[styles.statNum, { color: "#EAB308" }]}>{pendientes}</Text>
            <Text style={styles.statLabel}>Pendientes</Text>
          </View>
          <View style={[styles.statCard, { borderColor: "#7C3AED33" }]}>
            <Text style={[styles.statNum, { color: "#7C3AED" }]}>{enPrep}</Text>
            <Text style={styles.statLabel}>En preparación</Text>
          </View>
          <View style={[styles.statCard, { borderColor: "#6B728033" }]}>
            <Text style={[styles.statNum, { color: "#6B7280" }]}>{pedidos.length}</Text>
            <Text style={styles.statLabel}>Total activos</Text>
          </View>
        </View>
      )}

      {loading ? (
        <ActivityIndicator color="#EC4899" size="large" style={{ marginTop: 60 }} />
      ) : pedidos.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="checkmark-circle-outline" size={52} color="#10B981" />
          <Text style={styles.emptyTitle}>Todo al día</Text>
          <Text style={styles.emptyText}>No hay pedidos pendientes en este momento.</Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#EC4899"
            />
          }
        >
          {pedidos.map((pedido) => {
            const cfg = ESTADO_CONFIG[pedido.estadoPedido] ?? ESTADO_CONFIG.Pendiente;
            const hora = new Date(pedido.fechaHora).toLocaleTimeString("es-CO", {
              hour: "2-digit",
              minute: "2-digit",
            });
            const esPendiente = pedido.estadoPedido === "Pendiente";
            const esEnPrep = pedido.estadoPedido === "En preparación";
            const esActualizando = actualizando === pedido.idPedido;

            return (
              <View key={pedido.idPedido} style={styles.pedidoCard}>
                {/* Top: sala + estado + hora */}
                <View style={styles.cardTop}>
                  <View>
                    <Text style={styles.salaLabel}>
                      Sala {pedido.numeroSala ?? "?"}
                    </Text>
                    <Text style={styles.horaText}>{hora}</Text>
                  </View>
                  <View style={[styles.estadoBadge, { backgroundColor: cfg.bg }]}>
                    <Ionicons name={cfg.icon} size={13} color={cfg.color} />
                    <Text style={[styles.estadoText, { color: cfg.color }]}>
                      {cfg.label}
                    </Text>
                  </View>
                </View>

                {/* Detalle de productos */}
                <View style={styles.detalles}>
                  {pedido.detalles?.map((d) => (
                    <View key={d.idDetallePedido} style={styles.detalleRow}>
                      <Text style={styles.detalleQty}>{d.cantidad}×</Text>
                      <Text style={styles.detalleNombre}>
                        {d.producto?.nombre ?? "Producto"}
                      </Text>
                      <Text style={styles.detalleSubtotal}>
                        ${d.subtotal.toLocaleString()}
                      </Text>
                    </View>
                  ))}
                </View>

                {/* Total + acciones */}
                <View style={styles.cardBottom}>
                  <Text style={styles.totalText}>
                    Total: ${pedido.total.toLocaleString()}
                  </Text>

                  <View style={styles.acciones}>
                    {esPendiente && (
                      <TouchableOpacity
                        style={styles.btnPreparar}
                        disabled={esActualizando}
                        onPress={() =>
                          handleCambiarEstado(pedido, "En preparación")
                        }
                      >
                        {esActualizando ? (
                          <ActivityIndicator size="small" color="#7C3AED" />
                        ) : (
                          <>
                            <Ionicons name="flame-outline" size={15} color="#7C3AED" />
                            <Text style={styles.btnPrepararText}>Preparar</Text>
                          </>
                        )}
                      </TouchableOpacity>
                    )}
                    {esEnPrep && (
                      <TouchableOpacity
                        style={styles.btnEntregar}
                        disabled={esActualizando}
                        onPress={() =>
                          handleCambiarEstado(pedido, "Entregado")
                        }
                      >
                        {esActualizando ? (
                          <ActivityIndicator size="small" color="#EC4899" />
                        ) : (
                          <>
                            <Ionicons name="checkmark-done" size={15} color="#EC4899" />
                            <Text style={styles.btnEntregarText}>Entregar</Text>
                          </>
                        )}
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </View>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0F0F1A" },
  headerContainer: {
    paddingTop: 52,
    paddingHorizontal: 24,
    paddingBottom: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: { backgroundColor: "#1A1A2E", padding: 8, borderRadius: 10 },
  subtitle: { color: "#6B7280", fontSize: 13 },
  title: { color: "white", fontSize: 24, fontWeight: "bold" },
  alertBadge: {
    backgroundColor: "#EAB30822",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#EAB30833",
  },
  alertBadgeText: { color: "#EAB308", fontSize: 12, fontWeight: "700" },
  statsRow: {
    flexDirection: "row",
    paddingHorizontal: 24,
    gap: 10,
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#1A1A2E",
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: "center",
    borderWidth: 1,
  },
  statNum: { fontSize: 22, fontWeight: "bold" },
  statLabel: { color: "#6B7280", fontSize: 10, marginTop: 2 },
  content: { paddingHorizontal: 24, paddingTop: 4, paddingBottom: 32 },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingHorizontal: 40,
  },
  emptyTitle: { color: "white", fontSize: 20, fontWeight: "bold" },
  emptyText: { color: "#6B7280", fontSize: 14, textAlign: "center" },
  pedidoCard: {
    backgroundColor: "#1A1A2E",
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#EC489915",
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  salaLabel: { color: "#EC4899", fontSize: 13, fontWeight: "700" },
  horaText: { color: "#6B7280", fontSize: 12, marginTop: 2 },
  estadoBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
  },
  estadoText: { fontSize: 11, fontWeight: "600" },
  detalles: {
    gap: 6,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderColor: "#6B728015",
    marginBottom: 12,
  },
  detalleRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  detalleQty: { color: "#7C3AED", fontWeight: "700", fontSize: 13, width: 24 },
  detalleNombre: { color: "white", fontSize: 14, flex: 1 },
  detalleSubtotal: { color: "#6B7280", fontSize: 13 },
  cardBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalText: { color: "white", fontWeight: "700", fontSize: 14 },
  acciones: { flexDirection: "row", gap: 8 },
  btnPreparar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#7C3AED15",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: "#7C3AED33",
    minWidth: 90,
    justifyContent: "center",
  },
  btnPrepararText: { color: "#7C3AED", fontSize: 12, fontWeight: "600" },
  btnEntregar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#EC489915",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: "#EC489933",
    minWidth: 90,
    justifyContent: "center",
  },
  btnEntregarText: { color: "#EC4899", fontSize: 12, fontWeight: "600" },
});

// import { Ionicons } from "@expo/vector-icons";
// import { useRouter } from "expo-router";
// import React from "react";
// import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

// export default function PedidosEmpleadoScreen() {
//   const router = useRouter();

//   // Lista simulada de comandas que mandan desde las salas
//   const pedidos = [
//     { id: "1", sala: "Sala 1", items: "1x Hamburguesa + 1x CocaCola", hora: "19:15", estado: "En Cocina" },
//     { id: "2", sala: "Sala 10", items: "1x Cubetazo Águila Light", hora: "19:30", estado: "Pendiente" },
//   ];

//   return (
//     <View style={styles.container}>
//       <View style={styles.headerContainer}>
//         <TouchableOpacity onPress={() => router.replace("/(employee)" as any)} style={styles.backButton}>
//           <Ionicons name="arrow-back" size={20} color="white" />
//         </TouchableOpacity>
//         <View style={{ marginLeft: 12 }}>
//           <Text style={styles.subtitle}>Comandas y Consumos</Text>
//           <Text style={styles.title}>Pedidos en Espera</Text>
//         </View>
//       </View>

//       <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
//         {pedidos.map((pedido) => (
//           <View key={pedido.id} style={styles.pedidoCard}>
//             <View style={styles.cardTop}>
//               <View>
//                 <Text style={styles.salaLabel}>{pedido.sala}</Text>
//                 <Text style={styles.itemsText}>{pedido.items}</Text>
//               </View>
//               <View style={[styles.statusBadge, { backgroundColor: pedido.estado === "Pendiente" ? "#EF444415" : "#F59E0B15" }]}>
//                 <Text style={[styles.statusText, { color: pedido.estado === "Pendiente" ? "#EF4444" : "#F59E0B" }]}>
//                   {pedido.estado}
//                 </Text>
//               </View>
//             </View>

//             <View style={styles.cardBottom}>
//               <Text style={styles.horaText}>Pedido a las {pedido.hora}</Text>
//               <TouchableOpacity
//                 style={styles.btnCompletar}
//                 onPress={() => alert(`Pedido de la ${pedido.sala} despachado.`)}
//               >
//                 <Text style={styles.btnCompletarText}>Entregar</Text>
//                 <Ionicons name="checkmark-done" size={16} color="#EC4899" />
//               </TouchableOpacity>
//             </View>
//           </View>
//         ))}
//       </ScrollView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#0F0F1A" },
//   headerContainer: { paddingTop: 52, paddingHorizontal: 24, paddingBottom: 20, flexDirection: "row", alignItems: "center" },
//   backButton: { backgroundColor: "#1A1A2E", padding: 8, borderRadius: 10 },
//   subtitle: { color: "#6B7280", fontSize: 13 },
//   title: { color: "white", fontSize: 24, fontWeight: "bold" },
//   content: { paddingHorizontal: 24, paddingTop: 10 },
//   pedidoCard: { backgroundColor: "#1A1A2E", borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: "#EC489915" },
//   cardTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 },
//   salaLabel: { color: "#EC4899", fontSize: 12, fontWeight: "700" },
//   itemsText: { color: "white", fontSize: 15, fontWeight: "600", marginTop: 4 },
//   statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
//   statusText: { fontSize: 11, fontWeight: "600" },
//   cardBottom: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderTopWidth: 1, borderColor: "#6B728015", paddingTop: 12 },
//   horaText: { color: "#6B7280", fontSize: 12 },
//   btnCompletar: { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: "#EC489910", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: "#EC489933" },
//   btnCompletarText: { color: "#EC4899", fontSize: 12, fontWeight: "600" },
// });