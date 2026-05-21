import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { crearReserva } from "../../services/empleadoService";

export default function ReservaScreen() {
  const router = useRouter();
  const { idSala, numeroSala, precioHora, capacidad } =
    useLocalSearchParams<{
      idSala: string;
      numeroSala: string;
      precioHora: string;
      capacidad: string;
    }>();

  const [cantPersonas, setCantPersonas] = useState("1");
  const [loading, setLoading] = useState(false);

  const precio = parseFloat(precioHora ?? "0");
  const capMax = parseInt(capacidad ?? "0");

  async function handleCrearReserva() {
    const cant = parseInt(cantPersonas);

    if (!cantPersonas || isNaN(cant) || cant < 1) {
      Alert.alert("Campo requerido", "Ingresa la cantidad de personas.");
      return;
    }
    if (cant > capMax) {
      Alert.alert(
        "Capacidad excedida",
        `Esta sala tiene capacidad máxima para ${capMax} personas.`
      );
      return;
    }

    setLoading(true);
    try {
      await crearReserva({
        idSala: parseInt(idSala!),
        cantidadPersonas: cant,
      });

      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      Alert.alert(
        "¡Reserva creada!",
        `Sala ${numeroSala} abierta para ${cant} persona${cant > 1 ? "s" : ""}.`,
        [
          {
            text: "Ver salas",
            onPress: () => router.replace("/(employee)/salas" as any),
          },
        ]
      );
    } catch (e: any) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("Error", e.message || "No se pudo crear la reserva.");
    } finally {
      setLoading(false);
    }
  }

  const incrementar = () => {
    const v = parseInt(cantPersonas || "0");
    if (v < capMax) setCantPersonas((v + 1).toString());
  };

  const decrementar = () => {
    const v = parseInt(cantPersonas || "0");
    if (v > 1) setCantPersonas((v - 1).toString());
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={20} color="white" />
        </TouchableOpacity>
        <View style={{ marginLeft: 12 }}>
          <Text style={styles.subtitle}>Nueva Reserva</Text>
          <Text style={styles.title}>Sala {numeroSala}</Text>
        </View>
      </View>

      <View style={styles.content}>
        {/* Info de la sala */}
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Ionicons name="cash-outline" size={22} color="#7C3AED" />
              <Text style={styles.infoLabel}>Precio por hora</Text>
              <Text style={styles.infoValue}>
                ${precio.toLocaleString()}
              </Text>
            </View>
            <View style={styles.infoDivider} />
            <View style={styles.infoItem}>
              <Ionicons name="people-outline" size={22} color="#7C3AED" />
              <Text style={styles.infoLabel}>Capacidad máx.</Text>
              <Text style={styles.infoValue}>{capMax} personas</Text>
            </View>
          </View>
        </View>

        {/* Cantidad de personas */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Cantidad de personas</Text>

          <View style={styles.counterRow}>
            <TouchableOpacity
              style={[
                styles.counterBtn,
                parseInt(cantPersonas) <= 1 && styles.counterBtnDisabled,
              ]}
              onPress={decrementar}
              activeOpacity={0.7}
            >
              <Ionicons
                name="remove"
                size={22}
                color={parseInt(cantPersonas) <= 1 ? "#3A3A5C" : "white"}
              />
            </TouchableOpacity>

            <TextInput
              style={styles.counterInput}
              value={cantPersonas}
              onChangeText={(v) => {
                const n = parseInt(v);
                if (v === "") {
                  setCantPersonas("");
                } else if (!isNaN(n) && n >= 1 && n <= capMax) {
                  setCantPersonas(v);
                }
              }}
              keyboardType="numeric"
              textAlign="center"
              maxLength={2}
            />

            <TouchableOpacity
              style={[
                styles.counterBtn,
                parseInt(cantPersonas) >= capMax && styles.counterBtnDisabled,
              ]}
              onPress={incrementar}
              activeOpacity={0.7}
            >
              <Ionicons
                name="add"
                size={22}
                color={parseInt(cantPersonas) >= capMax ? "#3A3A5C" : "white"}
              />
            </TouchableOpacity>
          </View>

          <Text style={styles.counterHint}>
            Máximo {capMax} personas para esta sala
          </Text>
        </View>

        {/* Nota informativa */}
        <View style={styles.noteCard}>
          <Ionicons name="information-circle-outline" size={18} color="#7C3AED" />
          <Text style={styles.noteText}>
            El tiempo comienza a contar desde que se confirma la reserva. El cobro se calcula automáticamente al cierre.
          </Text>
        </View>

        {/* Botón confirmar */}
        <TouchableOpacity
          style={styles.btnConfirmar}
          onPress={handleCrearReserva}
          disabled={loading}
          activeOpacity={0.85}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <>
              <Ionicons name="checkmark-circle-outline" size={22} color="white" />
              <Text style={styles.btnConfirmarText}>Confirmar Reserva</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0F0F1A" },
  header: {
    paddingTop: 52,
    paddingHorizontal: 24,
    paddingBottom: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: { backgroundColor: "#1A1A2E", padding: 8, borderRadius: 10 },
  subtitle: { color: "#6B7280", fontSize: 13 },
  title: { color: "white", fontSize: 24, fontWeight: "bold" },
  content: { flex: 1, paddingHorizontal: 24, gap: 16 },
  infoCard: {
    backgroundColor: "#1A1A2E",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#7C3AED22",
  },
  infoRow: { flexDirection: "row", alignItems: "center" },
  infoItem: { flex: 1, alignItems: "center", gap: 6 },
  infoDivider: {
    width: 1,
    height: 50,
    backgroundColor: "#6B728020",
    marginHorizontal: 12,
  },
  infoLabel: { color: "#6B7280", fontSize: 12 },
  infoValue: { color: "white", fontSize: 18, fontWeight: "bold" },
  card: {
    backgroundColor: "#1A1A2E",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#7C3AED22",
  },
  cardLabel: {
    color: "#6B7280",
    fontSize: 13,
    marginBottom: 20,
    letterSpacing: 0.5,
  },
  counterRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginBottom: 12,
  },
  counterBtn: {
    backgroundColor: "#7C3AED",
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  counterBtnDisabled: { backgroundColor: "#1E1E38" },
  counterInput: {
    color: "white",
    fontSize: 42,
    fontWeight: "bold",
    width: 80,
  },
  counterHint: { color: "#3A3A5C", fontSize: 12 },
  noteCard: {
    backgroundColor: "#7C3AED15",
    borderRadius: 12,
    padding: 14,
    flexDirection: "row",
    gap: 10,
    borderWidth: 1,
    borderColor: "#7C3AED22",
  },
  noteText: { color: "#9CA3AF", fontSize: 13, flex: 1, lineHeight: 19 },
  btnConfirmar: {
    backgroundColor: "#7C3AED",
    borderRadius: 16,
    paddingVertical: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginTop: 8,
  },
  btnConfirmarText: { color: "white", fontSize: 17, fontWeight: "bold" },
});