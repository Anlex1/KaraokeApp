import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { getSalas } from "../../services/empleadoService";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 64) / 2;

interface Sala {
  idSala: number;
  numeroSala: number;
  estado: "Disponible" | "Ocupada" | "Inactiva";
  precioHora: number;
  capacidad: number;
}

const ESTADO_CONFIG = {
  Disponible: { color: "#10B981", bg: "#10B98115", border: "#10B98133" },
  Ocupada:    { color: "#EF4444", bg: "#EF444415", border: "#EF444433" },
  Inactiva:   { color: "#6B7280", bg: "#6B728015", border: "#6B728033" },
};

export default function SalasEmpleadoScreen() {
  const router = useRouter();
  const [salas, setSalas] = useState<Sala[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const cargarSalas = useCallback(async () => {
    try {
      const data = await getSalas();
      setSalas(data);
    } catch (e: any) {
      Alert.alert("Error", e.message || "No se pudieron cargar las salas.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    cargarSalas();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    cargarSalas();
  };

  const disponibles = salas.filter((s) => s.estado === "Disponible").length;
  const ocupadas    = salas.filter((s) => s.estado === "Ocupada").length;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            onPress={() => router.replace("/(employee)" as any)}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={20} color="white" />
          </TouchableOpacity>
          <View style={{ marginLeft: 12 }}>
            <Text style={styles.subtitle}>Módulo de Trabajo</Text>
            <Text style={styles.title}>Gestionar Salas</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.refreshButton}
          onPress={onRefresh}
          activeOpacity={0.7}
        >
          <Ionicons name="refresh" size={20} color="#7C3AED" />
        </TouchableOpacity>
      </View>

      {/* Resumen rápido */}
      <View style={styles.statsRow}>
        <View style={[styles.statCard, { borderColor: "#10B98133" }]}>
          <Text style={[styles.statNum, { color: "#10B981" }]}>{disponibles}</Text>
          <Text style={styles.statLabel}>Disponibles</Text>
        </View>
        <View style={[styles.statCard, { borderColor: "#EF444433" }]}>
          <Text style={[styles.statNum, { color: "#EF4444" }]}>{ocupadas}</Text>
          <Text style={styles.statLabel}>Ocupadas</Text>
        </View>
        <View style={[styles.statCard, { borderColor: "#6B728033" }]}>
          <Text style={[styles.statNum, { color: "#6B7280" }]}>{salas.length}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
      </View>

      {loading ? (
        <ActivityIndicator
          color="#7C3AED"
          size="large"
          style={{ marginTop: 60 }}
        />
      ) : (
        <ScrollView
          contentContainerStyle={styles.gridContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#7C3AED"
            />
          }
        >
          <View style={styles.row}>
            {salas
              .filter((s) => s.estado !== "Inactiva")
              .map((sala) => {
                const cfg = ESTADO_CONFIG[sala.estado];
                return (
                  <View
                    key={sala.idSala}
                    style={[styles.salaCard, { borderColor: cfg.border }]}
                  >
                    <View style={styles.cardHeader}>
                      <Text style={styles.salaTitle}>
                        Sala {sala.numeroSala}
                      </Text>
                      <View
                        style={[
                          styles.badge,
                          { backgroundColor: cfg.bg },
                        ]}
                      >
                        <Text style={[styles.badgeText, { color: cfg.color }]}>
                          {sala.estado}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.detailsContainer}>
                      <View style={styles.detailRow}>
                        <Ionicons
                          name="people-outline"
                          size={14}
                          color="#6B7280"
                        />
                        <Text style={styles.detailText}>
                          Cap: {sala.capacidad} personas
                        </Text>
                      </View>
                      <View style={styles.detailRow}>
                        <Ionicons
                          name="cash-outline"
                          size={14}
                          color="#6B7280"
                        />
                        <Text style={styles.detailText}>
                          ${sala.precioHora.toLocaleString()}/h
                        </Text>
                      </View>
                    </View>

                    {sala.estado === "Disponible" ? (
                      <TouchableOpacity
                        style={styles.btnReserva}
                        activeOpacity={0.8}
                        onPress={() =>
                          router.push({
                            pathname: "/(employee)/reserva",
                            params: {
                              idSala: sala.idSala,
                              numeroSala: sala.numeroSala,
                              precioHora: sala.precioHora,
                              capacidad: sala.capacidad,
                            },
                          } as any)
                        }
                      >
                        <Text style={styles.btnText}>Abrir Reserva</Text>
                        <Ionicons
                          name="add-circle-outline"
                          size={16}
                          color="#10B981"
                        />
                      </TouchableOpacity>
                    ) : (
                      <View style={styles.btnOcupada}>
                        <Ionicons name="lock-closed" size={14} color="#EF4444" />
                        <Text style={styles.btnOcupadaText}>En uso</Text>
                      </View>
                    )}
                  </View>
                );
              })}
          </View>
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
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerLeft: { flexDirection: "row", alignItems: "center" },
  backButton: { backgroundColor: "#1A1A2E", padding: 8, borderRadius: 10 },
  subtitle: { color: "#6B7280", fontSize: 13 },
  title: { color: "white", fontSize: 24, fontWeight: "bold" },
  refreshButton: {
    backgroundColor: "#1A1A2E",
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#7C3AED22",
  },
  statsRow: {
    flexDirection: "row",
    paddingHorizontal: 24,
    gap: 10,
    marginBottom: 16,
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
  statLabel: { color: "#6B7280", fontSize: 11, marginTop: 2 },
  gridContainer: { paddingHorizontal: 24, paddingBottom: 32 },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 16,
  },
  salaCard: {
    backgroundColor: "#1A1A2E",
    width: CARD_WIDTH,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    minHeight: 170,
    justifyContent: "space-between",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  salaTitle: { color: "white", fontSize: 16, fontWeight: "bold" },
  badge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  badgeText: { fontSize: 10, fontWeight: "600" },
  detailsContainer: { gap: 6, marginBottom: 14 },
  detailRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  detailText: { color: "#9CA3AF", fontSize: 11 },
  btnReserva: {
    flexDirection: "row",
    backgroundColor: "#10B98110",
    borderWidth: 1,
    borderColor: "#10B98133",
    borderRadius: 10,
    paddingVertical: 8,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  btnText: { color: "#10B981", fontSize: 12, fontWeight: "600" },
  btnOcupada: {
    flexDirection: "row",
    backgroundColor: "#EF444410",
    borderWidth: 1,
    borderColor: "#EF444430",
    borderRadius: 10,
    paddingVertical: 8,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  btnOcupadaText: { color: "#EF4444", fontSize: 12, fontWeight: "600" },
});

// import { Ionicons } from "@expo/vector-icons";
// import { useRouter } from "expo-router";
// import React from "react";
// import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

// const { width } = Dimensions.get("window");
// const CARD_WIDTH = (width - 64) / 2;

// export default function SalasEmpleadoScreen() {
//   const router = useRouter();

//   const salas = [
//     { id: "1", nombre: "Sala 1", capacidad: 8, precio: "20.000", estado: "Disponible" },
//     { id: "10", nombre: "Sala 10", capacidad: 15, precio: "50.000", estado: "Disponible" },
//   ];

//   return (
//     <View style={styles.container}>
//       {/* --- ENCABEZADO MODIFICADO --- */}
//       <View style={styles.headerContainer}>
//         <View style={styles.headerLeft}>
//           {/* AQUÍ ESTÁ EL NUEVO BOTÓN DE VOLVER */}
//           <TouchableOpacity onPress={() => router.replace("/(employee)" as any)} style={styles.backButton}>
//             <Ionicons name="arrow-back" size={20} color="white" />
//           </TouchableOpacity>
          
//           <View style={{ marginLeft: 12 }}>
//             <Text style={styles.subtitle}>Módulo de Trabajo</Text>
//             <Text style={styles.title}>Gestionar Salas</Text>
//           </View>
//         </View>

//         {/* BOTÓN DE REFRESCAR ORIGINAL */}
//         <TouchableOpacity style={styles.refreshButton} activeOpacity={0.7}>
//           <Ionicons name="refresh" size={20} color="#7C3AED" />
//         </TouchableOpacity>
//       </View>
//       {/* ------------------------------ */}

//       <ScrollView contentContainerStyle={styles.gridContainer} showsVerticalScrollIndicator={false}>
//         <View style={styles.row}>
//           {salas.map((sala) => (
//             <View key={sala.id} style={styles.salaCard}>
//               <View style={styles.cardHeader}>
//                 <Text style={styles.salaTitle}>{sala.nombre}</Text>
//                 <View style={styles.badgeDisponible}>
//                   <Text style={styles.badgeText}>{sala.estado}</Text>
//                 </View>
//               </View>

//               <View style={styles.detailsContainer}>
//                 <View style={styles.detailRow}>
//                   <Ionicons name="people-outline" size={14} color="#6B7280" />
//                   <Text style={styles.detailText}>Capacidad: {sala.capacidad}</Text>
//                 </View>
//                 <View style={styles.detailRow}>
//                   <Ionicons name="cash-outline" size={14} color="#6B7280" />
//                   <Text style={styles.detailText}>${sala.precio}/h</Text>
//                 </View>
//               </View>

//               <TouchableOpacity 
//                 style={styles.btnReserva}
//                 activeOpacity={0.8}
//                 onPress={() => alert(`Creando reserva para ${sala.nombre}`)}
//               >
//                 <Text style={styles.btnText}>Abrir Reserva</Text>
//                 <Ionicons name="add-circle-outline" size={16} color="#10B981" />
//               </TouchableOpacity>
//             </View>
//           ))}
//         </View>
//       </ScrollView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#0F0F1A" },
  
//   // Estilos del encabezado actualizados
//   headerContainer: { paddingTop: 52, paddingHorizontal: 24, paddingBottom: 20, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
//   headerLeft: { flexDirection: "row", alignItems: "center" },
//   backButton: { backgroundColor: "#1A1A2E", padding: 8, borderRadius: 10 },
//   refreshButton: { backgroundColor: "#1A1A2E", padding: 10, borderRadius: 12 },
  
//   subtitle: { color: "#6B7280", fontSize: 13 },
//   title: { color: "white", fontSize: 24, fontWeight: "bold" },
//   gridContainer: { paddingHorizontal: 24, paddingTop: 10 },
//   row: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", gap: 16 },
//   salaCard: { backgroundColor: "#1A1A2E", width: CARD_WIDTH, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: "#10B98122", minHeight: 160, justifyContent: "space-between" },
//   cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
//   salaTitle: { color: "white", fontSize: 16, fontWeight: "bold" },
//   badgeDisponible: { backgroundColor: "#10B98115", paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
//   badgeText: { color: "#10B981", fontSize: 10, fontWeight: "600" },
//   detailsContainer: { gap: 6, marginBottom: 16 },
//   detailRow: { flexDirection: "row", alignItems: "center", gap: 6 },
//   detailText: { color: "#9CA3AF", fontSize: 12 },
//   btnReserva: { flexDirection: "row", backgroundColor: "#10B98110", borderWidth: 1, borderColor: "#10B98133", borderRadius: 10, paddingVertical: 8, alignItems: "center", justifyContent: "center", gap: 6 },
//   btnText: { color: "#10B981", fontSize: 12, fontWeight: "600" },
// });