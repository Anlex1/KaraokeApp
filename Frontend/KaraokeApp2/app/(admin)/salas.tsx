import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  actualizarSala,
  crearSala,
  desactivarSala,
  getSalas,
} from "../../services/salasService";

interface Sala {
  idSala: number;
  numeroSala: number;
  estado: "Disponible" | "Ocupada" | "Inactiva";
  precioHora: number;
  capacidad: number;
}

const ESTADO_COLORS: Record<string, string> = {
  Disponible: "#10B981",
  Ocupada:    "#EF4444",
  Inactiva:   "#6B7280",
};

export default function SalasAdminScreen() {
  const [salas, setSalas] = useState<Sala[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editando, setEditando] = useState<Sala | null>(null);

  const [numeroSala, setNumeroSala] = useState("");
  const [precioHora, setPrecioHora] = useState("");
  const [capacidad, setCapacidad] = useState("");

  async function cargarSalas() {
    setLoading(true);
    try {
      const data = await getSalas();
      setSalas(data);
    } catch (e: any) {
      Alert.alert("Error", e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    cargarSalas();
  }, []);

  function abrirCrear() {
    setEditando(null);
    setNumeroSala("");
    setPrecioHora("");
    setCapacidad("");
    setModalVisible(true);
  }

  function abrirEditar(sala: Sala) {
    setEditando(sala);
    setNumeroSala(sala.numeroSala.toString());
    setPrecioHora(sala.precioHora.toString());
    setCapacidad(sala.capacidad.toString());
    setModalVisible(true);
  }

  async function handleGuardar() {
    if (!precioHora || !capacidad || (!editando && !numeroSala)) {
      Alert.alert("Campos requeridos", "Completa todos los campos.");
      return;
    }
    const precio = parseFloat(precioHora);
    const cap    = parseInt(capacidad);
    if (isNaN(precio) || precio <= 0) {
      Alert.alert("Precio inválido", "Ingresa un precio por hora válido.");
      return;
    }
    if (isNaN(cap) || cap <= 0) {
      Alert.alert("Capacidad inválida", "Ingresa una capacidad válida.");
      return;
    }

    try {
      if (editando) {
        await actualizarSala(editando.idSala, { precioHora: precio, capacidad: cap });
      } else {
        await crearSala({
          numeroSala: parseInt(numeroSala),
          precioHora: precio,
          capacidad: cap,
        });
      }
      setModalVisible(false);
      cargarSalas();
    } catch (e: any) {
      Alert.alert("Error", e.message);
    }
  }

  async function handleDesactivar(sala: Sala) {
    if (sala.estado === "Ocupada") {
      Alert.alert(
        "No disponible",
        "No puedes desactivar una sala que está en uso."
      );
      return;
    }
    const esInactiva = sala.estado === "Inactiva";
    Alert.alert(
      esInactiva ? "Activar sala" : "Desactivar sala",
      `¿Deseas ${esInactiva ? "activar" : "desactivar"} la Sala ${sala.numeroSala}?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: esInactiva ? "Activar" : "Desactivar",
          style: esInactiva ? "default" : "destructive",
          onPress: async () => {
            try {
              if (esInactiva) {
                await actualizarSala(sala.idSala, { estado: "Disponible" });
              } else {
                await desactivarSala(sala.idSala);
              }
              cargarSalas();
            } catch (e: any) {
              Alert.alert("Error", e.message);
            }
          },
        },
      ]
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#0F0F1A", padding: 24 }}>
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 48,
          marginBottom: 24,
        }}
      >
        <Text style={{ color: "white", fontSize: 24, fontWeight: "bold" }}>
          Salas
        </Text>
        <TouchableOpacity
          onPress={abrirCrear}
          style={{
            backgroundColor: "#7C3AED",
            paddingHorizontal: 16,
            paddingVertical: 10,
            borderRadius: 12,
            flexDirection: "row",
            alignItems: "center",
            gap: 6,
          }}
        >
          <Ionicons name="add" size={20} color="white" />
          <Text style={{ color: "white", fontWeight: "600" }}>Nueva</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator color="#7C3AED" size="large" style={{ marginTop: 40 }} />
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          {salas.map((sala) => {
            const estadoColor = ESTADO_COLORS[sala.estado] ?? "#6B7280";
            return (
              <View
                key={sala.idSala}
                style={{
                  backgroundColor: "#1A1A2E",
                  borderRadius: 16,
                  padding: 20,
                  marginBottom: 12,
                }}
              >
                {/* Encabezado de tarjeta */}
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 14,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 10,
                    }}
                  >
                    <View
                      style={{
                        backgroundColor: "#7C3AED22",
                        padding: 8,
                        borderRadius: 10,
                      }}
                    >
                      <Ionicons
                        name="musical-notes"
                        size={20}
                        color="#7C3AED"
                      />
                    </View>
                    <Text
                      style={{
                        color: "white",
                        fontSize: 18,
                        fontWeight: "600",
                      }}
                    >
                      Sala {sala.numeroSala}
                    </Text>
                  </View>
                  <View
                    style={{
                      backgroundColor: estadoColor + "22",
                      paddingHorizontal: 10,
                      paddingVertical: 4,
                      borderRadius: 20,
                    }}
                  >
                    <Text
                      style={{
                        color: estadoColor,
                        fontSize: 12,
                        fontWeight: "600",
                      }}
                    >
                      {sala.estado}
                    </Text>
                  </View>
                </View>

                {/* Detalles */}
                <View
                  style={{
                    flexDirection: "row",
                    gap: 12,
                    marginBottom: 16,
                  }}
                >
                  <View
                    style={{
                      flex: 1,
                      backgroundColor: "#0F0F1A",
                      borderRadius: 10,
                      padding: 12,
                      alignItems: "center",
                    }}
                  >
                    <Ionicons name="cash-outline" size={16} color="#6B7280" />
                    <Text
                      style={{
                        color: "#6B7280",
                        fontSize: 11,
                        marginTop: 4,
                      }}
                    >
                      Precio/hora
                    </Text>
                    <Text
                      style={{
                        color: "white",
                        fontWeight: "600",
                        marginTop: 2,
                      }}
                    >
                      ${sala.precioHora.toLocaleString()}
                    </Text>
                  </View>
                  <View
                    style={{
                      flex: 1,
                      backgroundColor: "#0F0F1A",
                      borderRadius: 10,
                      padding: 12,
                      alignItems: "center",
                    }}
                  >
                    <Ionicons name="people-outline" size={16} color="#6B7280" />
                    <Text
                      style={{
                        color: "#6B7280",
                        fontSize: 11,
                        marginTop: 4,
                      }}
                    >
                      Capacidad
                    </Text>
                    <Text
                      style={{
                        color: "white",
                        fontWeight: "600",
                        marginTop: 2,
                      }}
                    >
                      {sala.capacidad} personas
                    </Text>
                  </View>
                </View>

                {/* Acciones */}
                <View style={{ flexDirection: "row", gap: 10 }}>
                  <TouchableOpacity
                    onPress={() => abrirEditar(sala)}
                    disabled={sala.estado === "Ocupada"}
                    style={{
                      flex: 1,
                      backgroundColor:
                        sala.estado === "Ocupada" ? "#6B728011" : "#7C3AED22",
                      borderRadius: 10,
                      paddingVertical: 10,
                      alignItems: "center",
                      flexDirection: "row",
                      justifyContent: "center",
                      gap: 6,
                    }}
                  >
                    <Ionicons
                      name="pencil-outline"
                      size={16}
                      color={sala.estado === "Ocupada" ? "#3A3A5C" : "#7C3AED"}
                    />
                    <Text
                      style={{
                        color:
                          sala.estado === "Ocupada" ? "#3A3A5C" : "#7C3AED",
                        fontWeight: "600",
                      }}
                    >
                      Editar
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => handleDesactivar(sala)}
                    disabled={sala.estado === "Ocupada"}
                    style={{
                      flex: 1,
                      backgroundColor:
                        sala.estado === "Inactiva"
                          ? "#22C55E22"
                          : sala.estado === "Ocupada"
                          ? "#6B728011"
                          : "#EF444422",
                      borderRadius: 10,
                      paddingVertical: 10,
                      alignItems: "center",
                      flexDirection: "row",
                      justifyContent: "center",
                      gap: 6,
                    }}
                  >
                    <Ionicons
                      name={
                        sala.estado === "Inactiva"
                          ? "checkmark-circle-outline"
                          : "ban-outline"
                      }
                      size={16}
                      color={
                        sala.estado === "Ocupada"
                          ? "#3A3A5C"
                          : sala.estado === "Inactiva"
                          ? "#22C55E"
                          : "#EF4444"
                      }
                    />
                    <Text
                      style={{
                        color:
                          sala.estado === "Ocupada"
                            ? "#3A3A5C"
                            : sala.estado === "Inactiva"
                            ? "#22C55E"
                            : "#EF4444",
                        fontWeight: "600",
                      }}
                    >
                      {sala.estado === "Inactiva" ? "Activar" : "Desactivar"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </ScrollView>
      )}

      {/* Modal crear / editar */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View
          style={{
            flex: 1,
            backgroundColor: "#000000AA",
            justifyContent: "flex-end",
          }}
        >
          <View
            style={{
              backgroundColor: "#1A1A2E",
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              padding: 24,
              gap: 16,
            }}
          >
            <Text
              style={{ color: "white", fontSize: 20, fontWeight: "bold", marginBottom: 8 }}
            >
              {editando
                ? `Editar Sala ${editando.numeroSala}`
                : "Nueva Sala"}
            </Text>

            {/* Número sala (solo al crear) */}
            {!editando && (
              <View
                style={{
                  backgroundColor: "#0F0F1A",
                  borderRadius: 12,
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                }}
              >
                <Text style={{ color: "#6B7280", fontSize: 11, marginBottom: 4 }}>
                  Número de sala
                </Text>
                <TextInput
                  style={{ color: "white", fontSize: 16 }}
                  placeholder="Ej: 5"
                  placeholderTextColor="#6B7280"
                  keyboardType="numeric"
                  value={numeroSala}
                  onChangeText={setNumeroSala}
                />
              </View>
            )}

            {/* Precio hora */}
            <View
              style={{
                backgroundColor: "#0F0F1A",
                borderRadius: 12,
                paddingHorizontal: 16,
                paddingVertical: 12,
              }}
            >
              <Text style={{ color: "#6B7280", fontSize: 11, marginBottom: 4 }}>
                Precio por hora ($)
              </Text>
              <TextInput
                style={{ color: "white", fontSize: 16 }}
                placeholder="Ej: 25000"
                placeholderTextColor="#6B7280"
                keyboardType="numeric"
                value={precioHora}
                onChangeText={setPrecioHora}
              />
            </View>

            {/* Capacidad */}
            <View
              style={{
                backgroundColor: "#0F0F1A",
                borderRadius: 12,
                paddingHorizontal: 16,
                paddingVertical: 12,
              }}
            >
              <Text style={{ color: "#6B7280", fontSize: 11, marginBottom: 4 }}>
                Capacidad (personas)
              </Text>
              <TextInput
                style={{ color: "white", fontSize: 16 }}
                placeholder="Ej: 10"
                placeholderTextColor="#6B7280"
                keyboardType="numeric"
                value={capacidad}
                onChangeText={setCapacidad}
              />
            </View>

            <TouchableOpacity
              onPress={handleGuardar}
              style={{
                backgroundColor: "#7C3AED",
                borderRadius: 12,
                paddingVertical: 16,
                alignItems: "center",
              }}
            >
              <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>
                {editando ? "Guardar cambios" : "Crear sala"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={{ alignItems: "center", paddingVertical: 8 }}
            >
              <Text style={{ color: "#6B7280" }}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// import { Ionicons } from "@expo/vector-icons";
// import { useRouter } from "expo-router";
// import React from "react";
// import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

// const { width } = Dimensions.get("window");
// const CARD_WIDTH = (width - 64) / 2; // Distribución exacta para dos columnas

// export default function SalasEmpleadoScreen() {
//   const router = useRouter();

//   // Tus datos de las salas
//   const salas = [
//     { id: "1", nombre: "Sala 1", capacidad: 8, precio: "20.000", estado: "Disponible" },
//     { id: "10", nombre: "Sala 10", capacidad: 15, precio: "50.000", estado: "Disponible" },
//   ];

//   return (
//     <View style={styles.container}>
//       {/* Header Superior */}
//       <View style={styles.headerContainer}>
//         <View style={styles.headerLeft}>
//           <TouchableOpacity onPress={() => router.replace("/(employee)")} style={styles.backButton}>
//             <Ionicons name="arrow-back" size={20} color="white" />
//           </TouchableOpacity>
//           <View>
//             <Text style={styles.subtitle}>Módulo de Trabajo</Text>
//             <Text style={styles.title}>Gestionar Salas</Text>
//           </View>
//         </View>
        
//         <TouchableOpacity style={styles.refreshButton} activeOpacity={0.7}>
//           <Ionicons name="refresh" size={20} color="#7C3AED" />
//         </TouchableOpacity>
//       </View>

//       {/* Grid de las salas en 2 columnas */}
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
//   headerContainer: { paddingTop: 52, paddingHorizontal: 24, paddingBottom: 20, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
//   headerLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
//   backButton: { backgroundColor: "#1A1A2E", padding: 8, borderRadius: 10 },
//   subtitle: { color: "#6B7280", fontSize: 13 },
//   title: { color: "white", fontSize: 24, fontWeight: "bold" },
//   refreshButton: { backgroundColor: "#1A1A2E", padding: 10, borderRadius: 12, borderWidth: 1, borderColor: "#7C3AED22" },
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