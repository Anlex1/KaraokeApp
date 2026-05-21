import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
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
import {
  cerrarReserva,
  getPedidosPorReserva,
  getReservaActivaPorSala,
  getSalas,
} from "../../services/empleadoService";

interface CuentaActiva {
  idReserva: number;
  idSala: number;
  numeroSala: number;
  precioHora: number;
  fechaHoraInicio: string;
  cantidadPersonas: number;
  totalConsumos: number;
  minutosUsados: number;
  subtotalSala: number;
  total: number;
}

function calcularMinutos(fechaInicio: string): number {
  return Math.max(
    0,
    Math.floor((Date.now() - new Date(fechaInicio).getTime()) / 60000)
  );
}

function formatDuracion(minutos: number): string {
  const h = Math.floor(minutos / 60);
  const m = minutos % 60;
  return h > 0 ? `${h}h ${m}min` : `${m}min`;
}

export default function CierreCuentasScreen() {
  const router = useRouter();
  const [cuentas, setCuentas] = useState<CuentaActiva[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [cerrando, setCerrando] = useState<number | null>(null);

  const cargarCuentas = useCallback(async () => {
    try {
      const salas = await getSalas();
      const resultados: CuentaActiva[] = [];

      await Promise.all(
        salas
          .filter((s: any) => s.estado === "Ocupada")
          .map(async (sala: any) => {
            try {
              const reserva = await getReservaActivaPorSala(sala.idSala);
              const pedidos = await getPedidosPorReserva(reserva.idReserva);

              const totalConsumos = pedidos.reduce(
                (sum: number, p: any) => sum + (p.total ?? 0),
                0
              );
              const minutos = calcularMinutos(reserva.fechaHoraInicio);
              const horas = minutos / 60;
              const subtotalSala = Math.ceil(horas * sala.precioHora);
              const total = subtotalSala + totalConsumos;

              resultados.push({
                idReserva: reserva.idReserva,
                idSala: sala.idSala,
                numeroSala: sala.numeroSala,
                precioHora: sala.precioHora,
                fechaHoraInicio: reserva.fechaHoraInicio,
                cantidadPersonas: reserva.cantidadPersonas,
                totalConsumos,
                minutosUsados: minutos,
                subtotalSala,
                total,
              });
            } catch {
              // sala sin reserva activa — ignorar
            }
          })
      );

      resultados.sort((a, b) => a.numeroSala - b.numeroSala);
      setCuentas(resultados);
    } catch (e: any) {
      Alert.alert("Error", e.message || "Error al cargar cuentas.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    cargarCuentas();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    cargarCuentas();
  };

  async function handleCerrar(cuenta: CuentaActiva) {
    Alert.alert(
      "Cerrar reserva",
      `¿Finalizar Sala ${cuenta.numeroSala}?\n\nTotal estimado: $${cuenta.total.toLocaleString()}`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Finalizar y cobrar",
          style: "destructive",
          onPress: async () => {
            setCerrando(cuenta.idReserva);
            try {
              await cerrarReserva(cuenta.idReserva);
              await Haptics.notificationAsync(
                Haptics.NotificationFeedbackType.Success
              );
              Alert.alert(
                "Reserva cerrada",
                `Sala ${cuenta.numeroSala} liberada. Total: $${cuenta.total.toLocaleString()}`,
                [{ text: "OK", onPress: cargarCuentas }]
              );
            } catch (e: any) {
              await Haptics.notificationAsync(
                Haptics.NotificationFeedbackType.Error
              );
              Alert.alert("Error", e.message || "No se pudo cerrar la reserva.");
            } finally {
              setCerrando(null);
            }
          },
        },
      ]
    );
  }

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
        <View style={{ marginLeft: 12 }}>
          <Text style={styles.subtitle}>Pre-facturación</Text>
          <Text style={styles.title}>Cierre de Cuentas</Text>
        </View>
      </View>

      {loading ? (
        <ActivityIndicator
          color="#06B6D4"
          size="large"
          style={{ marginTop: 60 }}
        />
      ) : cuentas.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="receipt-outline" size={52} color="#6B7280" />
          <Text style={styles.emptyTitle}>Sin salas activas</Text>
          <Text style={styles.emptyText}>
            No hay reservas abiertas en este momento.
          </Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#06B6D4"
            />
          }
        >
          {cuentas.map((cuenta) => {
            const esCerrando = cerrando === cuenta.idReserva;
            return (
              <View key={cuenta.idReserva} style={styles.cuentaCard}>
                {/* Encabezado */}
                <View style={styles.cardHeader}>
                  <View>
                    <Text style={styles.salaTitle}>
                      Sala {cuenta.numeroSala}
                    </Text>
                    <Text style={styles.personasText}>
                      {cuenta.cantidadPersonas} persona
                      {cuenta.cantidadPersonas !== 1 ? "s" : ""}
                    </Text>
                  </View>
                  <Text style={styles.totalText}>
                    ${cuenta.total.toLocaleString()}
                  </Text>
                </View>

                {/* Desglose */}
                <View style={styles.breakdown}>
                  <View style={styles.breakdownRow}>
                    <View style={styles.breakdownLeft}>
                      <Ionicons name="time-outline" size={14} color="#6B7280" />
                      <Text style={styles.breakdownLabel}>
                        Tiempo ({formatDuracion(cuenta.minutosUsados)})
                      </Text>
                    </View>
                    <Text style={styles.breakdownValue}>
                      ${cuenta.subtotalSala.toLocaleString()}
                    </Text>
                  </View>
                  <View style={styles.breakdownRow}>
                    <View style={styles.breakdownLeft}>
                      <Ionicons
                        name="fast-food-outline"
                        size={14}
                        color="#6B7280"
                      />
                      <Text style={styles.breakdownLabel}>Consumos</Text>
                    </View>
                    <Text style={styles.breakdownValue}>
                      ${cuenta.totalConsumos.toLocaleString()}
                    </Text>
                  </View>
                  <View style={[styles.breakdownRow, styles.breakdownTotal]}>
                    <Text style={styles.breakdownTotalLabel}>Total</Text>
                    <Text style={styles.breakdownTotalValue}>
                      ${cuenta.total.toLocaleString()}
                    </Text>
                  </View>
                </View>

                {/* Nota tarifa */}
                <Text style={styles.tarifaNote}>
                  Tarifa: ${cuenta.precioHora.toLocaleString()}/h · Se calcula
                  el tiempo real al momento del cierre
                </Text>

                {/* Botón cerrar */}
                <TouchableOpacity
                  style={styles.btnCerrar}
                  onPress={() => handleCerrar(cuenta)}
                  disabled={esCerrando}
                  activeOpacity={0.8}
                >
                  {esCerrando ? (
                    <ActivityIndicator size="small" color="#06B6D4" />
                  ) : (
                    <>
                      <Ionicons
                        name="receipt-outline"
                        size={16}
                        color="#06B6D4"
                      />
                      <Text style={styles.btnCerrarText}>
                        Finalizar y Cobrar
                      </Text>
                    </>
                  )}
                </TouchableOpacity>
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
    paddingBottom: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: { backgroundColor: "#1A1A2E", padding: 8, borderRadius: 10 },
  subtitle: { color: "#6B7280", fontSize: 13 },
  title: { color: "white", fontSize: 24, fontWeight: "bold" },
  content: { paddingHorizontal: 24, paddingBottom: 32 },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingHorizontal: 40,
  },
  emptyTitle: { color: "white", fontSize: 20, fontWeight: "bold" },
  emptyText: { color: "#6B7280", fontSize: 14, textAlign: "center" },
  cuentaCard: {
    backgroundColor: "#1A1A2E",
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#06B6D415",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  salaTitle: { color: "white", fontSize: 20, fontWeight: "bold" },
  personasText: { color: "#6B7280", fontSize: 12, marginTop: 2 },
  totalText: { color: "#06B6D4", fontSize: 22, fontWeight: "bold" },
  breakdown: {
    backgroundColor: "#0F0F1A",
    borderRadius: 10,
    padding: 14,
    gap: 10,
    marginBottom: 12,
  },
  breakdownRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  breakdownLeft: { flexDirection: "row", alignItems: "center", gap: 6 },
  breakdownLabel: { color: "#9CA3AF", fontSize: 13 },
  breakdownValue: { color: "white", fontSize: 13, fontWeight: "600" },
  breakdownTotal: {
    paddingTop: 10,
    borderTopWidth: 1,
    borderColor: "#6B728020",
    marginTop: 2,
  },
  breakdownTotalLabel: { color: "white", fontWeight: "700", fontSize: 14 },
  breakdownTotalValue: {
    color: "#06B6D4",
    fontWeight: "bold",
    fontSize: 16,
  },
  tarifaNote: {
    color: "#3A3A5C",
    fontSize: 11,
    marginBottom: 14,
    lineHeight: 16,
  },
  btnCerrar: {
    flexDirection: "row",
    backgroundColor: "#06B6D410",
    borderWidth: 1,
    borderColor: "#06B6D433",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    minHeight: 44,
  },
  btnCerrarText: { color: "#06B6D4", fontSize: 14, fontWeight: "600" },
});

// import { Ionicons } from "@expo/vector-icons";
// import { useRouter } from "expo-router";
// import React from "react";
// import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

// export default function CierreCuentasScreen() {
//   const router = useRouter();

//   // Datos simulados de las cuentas activas
//   const cuentasActivas = [
//     { id: "1", sala: "Sala 1", tiempo: "2h 15m", subtotal: "45.000", consumos: "32.000", total: "77.000" },
//   ];

//   return (
//     <View style={styles.container}>
//       <View style={styles.headerContainer}>
//         <TouchableOpacity onPress={() => router.replace("/(employee)" as any)} style={styles.backButton}>
//           <Ionicons name="arrow-back" size={20} color="white" />
//         </TouchableOpacity>
//         <View style={{ marginLeft: 12 }}>
//           <Text style={styles.subtitle}>Pre-facturación</Text>
//           <Text style={styles.title}>Cierre de Cuentas</Text>
//         </View>
//       </View>

//       <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
//         {cuentasActivas.map((cuenta) => (
//           <View key={cuenta.id} style={styles.cuentaCard}>
//             <View style={styles.cardHeader}>
//               <Text style={styles.salaTitle}>{cuenta.sala}</Text>
//               <Text style={styles.totalText}>Total: ${cuenta.total}</Text>
//             </View>

//             <View style={styles.breakdown}>
//               <Text style={styles.breakdownText}>Tiempo usado: {cuenta.tiempo} (${cuenta.subtotal})</Text>
//               <Text style={styles.breakdownText}>Consumos adicionales: ${cuenta.consumos}</Text>
//             </View>

//             <TouchableOpacity
//               style={styles.btnCerrar}
//               onPress={() => alert(`Generando orden de pago para ${cuenta.sala}`)}
//             >
//               <Text style={styles.btnCerrarText}>Finalizar y Cobrar</Text>
//               <Ionicons name="receipt-outline" size={16} color="#06B6D4" />
//             </TouchableOpacity>
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
//   cuentaCard: { backgroundColor: "#1A1A2E", borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: "#06B6D415" },
//   cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
//   salaTitle: { color: "white", fontSize: 18, fontWeight: "bold" },
//   totalText: { color: "#06B6D4", fontSize: 18, fontWeight: "bold" },
//   breakdown: { gap: 4, marginBottom: 16 },
//   breakdownText: { color: "#9CA3AF", fontSize: 13 },
//   btnCerrar: { flexDirection: "row", backgroundColor: "#06B6D410", borderWidth: 1, borderColor: "#06B6D433", borderRadius: 10, paddingVertical: 10, alignItems: "center", justifyContent: "center", gap: 8 },
//   btnCerrarText: { color: "#06B6D4", fontSize: 13, fontWeight: "600" },
// });