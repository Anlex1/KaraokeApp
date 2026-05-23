import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  Modal,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { getSalas, liberarSala } from "../../services/empleadoService";

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
  const [liberando, setLiberando] = useState<number | null>(null);

  // Modal QR
  const [qrModal, setQrModal] = useState<{ sala: Sala; qrUrl: string } | null>(null);

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

  useEffect(() => { cargarSalas(); }, []);

  const onRefresh = () => { setRefreshing(true); cargarSalas(); };

  // Obtener QR de una sala ocupada desde el backend
  async function verQrSala(sala: Sala) {
    try {
      const { getToken } = await import("../../services/authService");
      const token = await getToken();
      const BASE_URL = (await import("../../services/authService")).BASE_URL;
      const res = await fetch(`${BASE_URL}/Sala/${sala.idSala}/qr`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("No se pudo obtener el QR");
      const data = await res.json();
      setQrModal({ sala, qrUrl: data.qrDataUrl });
    } catch (e: any) {
      Alert.alert("Error", e.message);
    }
  }

  async function handleLiberarSala(sala: Sala) {
    Alert.alert(
      "Liberar sala",
      `¿Marcar Sala ${sala.numeroSala} como Disponible forzadamente?\n\nAsegúrate de haber cerrado la reserva primero.`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Liberar",
          style: "destructive",
          onPress: async () => {
            setLiberando(sala.idSala);
            try {
              await liberarSala(sala.idSala);
              cargarSalas();
            } catch (e: any) {
              Alert.alert("Error", e.message);
            } finally {
              setLiberando(null);
            }
          },
        },
      ]
    );
  }

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
        <TouchableOpacity style={styles.refreshButton} onPress={onRefresh} activeOpacity={0.7}>
          <Ionicons name="refresh" size={20} color="#7C3AED" />
        </TouchableOpacity>
      </View>

      {/* Resumen */}
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
        <ActivityIndicator color="#7C3AED" size="large" style={{ marginTop: 60 }} />
      ) : (
        <ScrollView
          contentContainerStyle={styles.gridContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#7C3AED" />}
        >
          <View style={styles.row}>
            {salas.filter((s) => s.estado !== "Inactiva").map((sala) => {
              const cfg = ESTADO_CONFIG[sala.estado];
              const esLiberando = liberando === sala.idSala;
              return (
                <View key={sala.idSala} style={[styles.salaCard, { borderColor: cfg.border }]}>
                  {/* Encabezado */}
                  <View style={styles.cardHeader}>
                    <Text style={styles.salaTitle}>Sala {sala.numeroSala}</Text>
                    <View style={[styles.badge, { backgroundColor: cfg.bg }]}>
                      <Text style={[styles.badgeText, { color: cfg.color }]}>{sala.estado}</Text>
                    </View>
                  </View>

                  {/* Detalles */}
                  <View style={styles.detailsContainer}>
                    <View style={styles.detailRow}>
                      <Ionicons name="people-outline" size={14} color="#6B7280" />
                      <Text style={styles.detailText}>Cap: {sala.capacidad}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Ionicons name="cash-outline" size={14} color="#6B7280" />
                      <Text style={styles.detailText}>${sala.precioHora.toLocaleString()}/h</Text>
                    </View>
                  </View>

                  {/* Botones según estado */}
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
                      <Text style={styles.btnReservaText}>Abrir Reserva</Text>
                      <Ionicons name="add-circle-outline" size={16} color="#10B981" />
                    </TouchableOpacity>
                  ) : (
                    <View style={{ gap: 8 }}>
                      {/* Ver QR */}
                      <TouchableOpacity
                        style={styles.btnQr}
                        onPress={() => verQrSala(sala)}
                        activeOpacity={0.8}
                      >
                        <Ionicons name="qr-code-outline" size={15} color="#7C3AED" />
                        <Text style={styles.btnQrText}>Ver QR</Text>
                      </TouchableOpacity>
                      {/* Liberar forzado */}
                      <TouchableOpacity
                        style={styles.btnLiberar}
                        onPress={() => handleLiberarSala(sala)}
                        disabled={esLiberando}
                        activeOpacity={0.8}
                      >
                        {esLiberando ? (
                          <ActivityIndicator size="small" color="#EF4444" />
                        ) : (
                          <>
                            <Ionicons name="lock-open-outline" size={15} color="#EF4444" />
                            <Text style={styles.btnLiberarText}>Liberar sala</Text>
                          </>
                        )}
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        </ScrollView>
      )}

      {/* Modal QR */}
      <Modal visible={!!qrModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Sala {qrModal?.sala.numeroSala}</Text>
            <Text style={styles.modalSubtitle}>Muéstrale este QR al cliente</Text>
            {qrModal?.qrUrl ? (
              <Image
                source={{ uri: qrModal.qrUrl }}
                style={styles.modalQr}
                resizeMode="contain"
              />
            ) : null}
            <TouchableOpacity
              style={styles.modalClose}
              onPress={() => setQrModal(null)}
            >
              <Text style={{ color: "white", fontWeight: "bold" }}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0F0F1A" },
  headerContainer: {
    paddingTop: 52, paddingHorizontal: 24, paddingBottom: 16,
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
  },
  headerLeft: { flexDirection: "row", alignItems: "center" },
  backButton: { backgroundColor: "#1A1A2E", padding: 8, borderRadius: 10 },
  subtitle: { color: "#6B7280", fontSize: 13 },
  title: { color: "white", fontSize: 24, fontWeight: "bold" },
  refreshButton: { backgroundColor: "#1A1A2E", padding: 10, borderRadius: 12, borderWidth: 1, borderColor: "#7C3AED22" },
  statsRow: { flexDirection: "row", paddingHorizontal: 24, gap: 10, marginBottom: 16 },
  statCard: { flex: 1, backgroundColor: "#1A1A2E", borderRadius: 12, paddingVertical: 10, alignItems: "center", borderWidth: 1 },
  statNum: { fontSize: 22, fontWeight: "bold" },
  statLabel: { color: "#6B7280", fontSize: 11, marginTop: 2 },
  gridContainer: { paddingHorizontal: 24, paddingBottom: 32 },
  row: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", gap: 16 },
  salaCard: { backgroundColor: "#1A1A2E", width: CARD_WIDTH, borderRadius: 16, padding: 16, borderWidth: 1, minHeight: 190, justifyContent: "space-between" },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  salaTitle: { color: "white", fontSize: 16, fontWeight: "bold" },
  badge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  badgeText: { fontSize: 10, fontWeight: "600" },
  detailsContainer: { gap: 6, marginBottom: 12 },
  detailRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  detailText: { color: "#9CA3AF", fontSize: 11 },
  btnReserva: {
    flexDirection: "row", backgroundColor: "#10B98110", borderWidth: 1,
    borderColor: "#10B98133", borderRadius: 10, paddingVertical: 8,
    alignItems: "center", justifyContent: "center", gap: 6,
  },
  btnReservaText: { color: "#10B981", fontSize: 12, fontWeight: "600" },
  btnQr: {
    flexDirection: "row", backgroundColor: "#7C3AED15", borderWidth: 1,
    borderColor: "#7C3AED33", borderRadius: 10, paddingVertical: 8,
    alignItems: "center", justifyContent: "center", gap: 6,
  },
  btnQrText: { color: "#7C3AED", fontSize: 12, fontWeight: "600" },
  btnLiberar: {
    flexDirection: "row", backgroundColor: "#EF444415", borderWidth: 1,
    borderColor: "#EF444433", borderRadius: 10, paddingVertical: 8,
    alignItems: "center", justifyContent: "center", gap: 6, minHeight: 36,
  },
  btnLiberarText: { color: "#EF4444", fontSize: 12, fontWeight: "600" },
  // Modal
  modalOverlay: { flex: 1, backgroundColor: "#000000CC", alignItems: "center", justifyContent: "center" },
  modalCard: { backgroundColor: "#1A1A2E", borderRadius: 24, padding: 28, alignItems: "center", width: "85%" },
  modalTitle: { color: "white", fontSize: 22, fontWeight: "bold", letterSpacing: 2 },
  modalSubtitle: { color: "#6B7280", fontSize: 13, marginTop: 4, marginBottom: 20 },
  modalQr: { width: 220, height: 220, backgroundColor: "white", borderRadius: 12 },
  modalClose: {
    marginTop: 24, backgroundColor: "#7C3AED", borderRadius: 12,
    paddingHorizontal: 32, paddingVertical: 12,
  },
});