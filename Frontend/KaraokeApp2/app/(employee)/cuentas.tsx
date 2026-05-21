import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function CierreCuentasScreen() {
  const router = useRouter();

  // Datos simulados de las cuentas activas
  const cuentasActivas = [
    { id: "1", sala: "Sala 1", tiempo: "2h 15m", subtotal: "45.000", consumos: "32.000", total: "77.000" },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => router.replace("/(employee)" as any)} style={styles.backButton}>
          <Ionicons name="arrow-back" size={20} color="white" />
        </TouchableOpacity>
        <View style={{ marginLeft: 12 }}>
          <Text style={styles.subtitle}>Pre-facturación</Text>
          <Text style={styles.title}>Cierre de Cuentas</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {cuentasActivas.map((cuenta) => (
          <View key={cuenta.id} style={styles.cuentaCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.salaTitle}>{cuenta.sala}</Text>
              <Text style={styles.totalText}>Total: ${cuenta.total}</Text>
            </View>

            <View style={styles.breakdown}>
              <Text style={styles.breakdownText}>Tiempo usado: {cuenta.tiempo} (${cuenta.subtotal})</Text>
              <Text style={styles.breakdownText}>Consumos adicionales: ${cuenta.consumos}</Text>
            </View>

            <TouchableOpacity 
              style={styles.btnCerrar}
              onPress={() => alert(`Generando orden de pago para ${cuenta.sala}`)}
            >
              <Text style={styles.btnCerrarText}>Finalizar y Cobrar</Text>
              <Ionicons name="receipt-outline" size={16} color="#06B6D4" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0F0F1A" },
  headerContainer: { paddingTop: 52, paddingHorizontal: 24, paddingBottom: 20, flexDirection: "row", alignItems: "center" },
  backButton: { backgroundColor: "#1A1A2E", padding: 8, borderRadius: 10 },
  subtitle: { color: "#6B7280", fontSize: 13 },
  title: { color: "white", fontSize: 24, fontWeight: "bold" },
  content: { paddingHorizontal: 24, paddingTop: 10 },
  cuentaCard: { backgroundColor: "#1A1A2E", borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: "#06B6D415" },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  salaTitle: { color: "white", fontSize: 18, fontWeight: "bold" },
  totalText: { color: "#06B6D4", fontSize: 18, fontWeight: "bold" },
  breakdown: { gap: 4, marginBottom: 16 },
  breakdownText: { color: "#9CA3AF", fontSize: 13 },
  btnCerrar: { flexDirection: "row", backgroundColor: "#06B6D410", borderWidth: 1, borderColor: "#06B6D433", borderRadius: 10, paddingVertical: 10, alignItems: "center", justifyContent: "center", gap: 8 },
  btnCerrarText: { color: "#06B6D4", fontSize: 13, fontWeight: "600" },
});