import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function PedidosEmpleadoScreen() {
  const router = useRouter();

  // Lista simulada de comandas que mandan desde las salas
  const pedidos = [
    { id: "1", sala: "Sala 1", items: "1x Hamburguesa + 1x CocaCola", hora: "19:15", estado: "En Cocina" },
    { id: "2", sala: "Sala 10", items: "1x Cubetazo Águila Light", hora: "19:30", estado: "Pendiente" },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => router.replace("/(employee)" as any)} style={styles.backButton}>
          <Ionicons name="arrow-back" size={20} color="white" />
        </TouchableOpacity>
        <View style={{ marginLeft: 12 }}>
          <Text style={styles.subtitle}>Comandas y Consumos</Text>
          <Text style={styles.title}>Pedidos en Espera</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {pedidos.map((pedido) => (
          <View key={pedido.id} style={styles.pedidoCard}>
            <View style={styles.cardTop}>
              <View>
                <Text style={styles.salaLabel}>{pedido.sala}</Text>
                <Text style={styles.itemsText}>{pedido.items}</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: pedido.estado === "Pendiente" ? "#EF444415" : "#F59E0B15" }]}>
                <Text style={[styles.statusText, { color: pedido.estado === "Pendiente" ? "#EF4444" : "#F59E0B" }]}>
                  {pedido.estado}
                </Text>
              </View>
            </View>

            <View style={styles.cardBottom}>
              <Text style={styles.horaText}>Pedido a las {pedido.hora}</Text>
              <TouchableOpacity 
                style={styles.btnCompletar}
                onPress={() => alert(`Pedido de la ${pedido.sala} despachado.`)}
              >
                <Text style={styles.btnCompletarText}>Entregar</Text>
                <Ionicons name="checkmark-done" size={16} color="#EC4899" />
              </TouchableOpacity>
            </View>
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
  pedidoCard: { backgroundColor: "#1A1A2E", borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: "#EC489915" },
  cardTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 },
  salaLabel: { color: "#EC4899", fontSize: 12, fontWeight: "700" },
  itemsText: { color: "white", fontSize: 15, fontWeight: "600", marginTop: 4 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  statusText: { fontSize: 11, fontWeight: "600" },
  cardBottom: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderTopWidth: 1, borderColor: "#6B728015", paddingTop: 12 },
  horaText: { color: "#6B7280", fontSize: 12 },
  btnCompletar: { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: "#EC489910", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: "#EC489933" },
  btnCompletarText: { color: "#EC4899", fontSize: 12, fontWeight: "600" },
});