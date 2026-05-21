import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 64) / 2;

export default function SalasEmpleadoScreen() {
  const router = useRouter();

  const salas = [
    { id: "1", nombre: "Sala 1", capacidad: 8, precio: "20.000", estado: "Disponible" },
    { id: "10", nombre: "Sala 10", capacidad: 15, precio: "50.000", estado: "Disponible" },
  ];

  return (
    <View style={styles.container}>
      {/* --- ENCABEZADO MODIFICADO --- */}
      <View style={styles.headerContainer}>
        <View style={styles.headerLeft}>
          {/* AQUÍ ESTÁ EL NUEVO BOTÓN DE VOLVER */}
          <TouchableOpacity onPress={() => router.replace("/(employee)" as any)} style={styles.backButton}>
            <Ionicons name="arrow-back" size={20} color="white" />
          </TouchableOpacity>
          
          <View style={{ marginLeft: 12 }}>
            <Text style={styles.subtitle}>Módulo de Trabajo</Text>
            <Text style={styles.title}>Gestionar Salas</Text>
          </View>
        </View>

        {/* BOTÓN DE REFRESCAR ORIGINAL */}
        <TouchableOpacity style={styles.refreshButton} activeOpacity={0.7}>
          <Ionicons name="refresh" size={20} color="#7C3AED" />
        </TouchableOpacity>
      </View>
      {/* ------------------------------ */}

      <ScrollView contentContainerStyle={styles.gridContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.row}>
          {salas.map((sala) => (
            <View key={sala.id} style={styles.salaCard}>
              <View style={styles.cardHeader}>
                <Text style={styles.salaTitle}>{sala.nombre}</Text>
                <View style={styles.badgeDisponible}>
                  <Text style={styles.badgeText}>{sala.estado}</Text>
                </View>
              </View>

              <View style={styles.detailsContainer}>
                <View style={styles.detailRow}>
                  <Ionicons name="people-outline" size={14} color="#6B7280" />
                  <Text style={styles.detailText}>Capacidad: {sala.capacidad}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Ionicons name="cash-outline" size={14} color="#6B7280" />
                  <Text style={styles.detailText}>${sala.precio}/h</Text>
                </View>
              </View>

              <TouchableOpacity 
                style={styles.btnReserva}
                activeOpacity={0.8}
                onPress={() => alert(`Creando reserva para ${sala.nombre}`)}
              >
                <Text style={styles.btnText}>Abrir Reserva</Text>
                <Ionicons name="add-circle-outline" size={16} color="#10B981" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0F0F1A" },
  
  // Estilos del encabezado actualizados
  headerContainer: { paddingTop: 52, paddingHorizontal: 24, paddingBottom: 20, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  headerLeft: { flexDirection: "row", alignItems: "center" },
  backButton: { backgroundColor: "#1A1A2E", padding: 8, borderRadius: 10 },
  refreshButton: { backgroundColor: "#1A1A2E", padding: 10, borderRadius: 12 },
  
  subtitle: { color: "#6B7280", fontSize: 13 },
  title: { color: "white", fontSize: 24, fontWeight: "bold" },
  gridContainer: { paddingHorizontal: 24, paddingTop: 10 },
  row: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", gap: 16 },
  salaCard: { backgroundColor: "#1A1A2E", width: CARD_WIDTH, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: "#10B98122", minHeight: 160, justifyContent: "space-between" },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  salaTitle: { color: "white", fontSize: 16, fontWeight: "bold" },
  badgeDisponible: { backgroundColor: "#10B98115", paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  badgeText: { color: "#10B981", fontSize: 10, fontWeight: "600" },
  detailsContainer: { gap: 6, marginBottom: 16 },
  detailRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  detailText: { color: "#9CA3AF", fontSize: 12 },
  btnReserva: { flexDirection: "row", backgroundColor: "#10B98110", borderWidth: 1, borderColor: "#10B98133", borderRadius: 10, paddingVertical: 8, alignItems: "center", justifyContent: "center", gap: 6 },
  btnText: { color: "#10B981", fontSize: 12, fontWeight: "600" },
});