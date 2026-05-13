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
import { actualizarSala, crearSala, desactivarSala, getSalas } from "../../services/salasService";

interface Sala {
  idSala: number;
  numeroSala: number;
  estado: string;
  precioHora: number;
  capacidad: number;
}

const estadoColor: Record<string, string> = {
  Disponible: "#22C55E",
  Ocupada: "#EAB308",
  Inactiva: "#6B7280",
};

export default function SalasScreen() {
  const [salas, setSalas] = useState<Sala[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editando, setEditando] = useState<Sala | null>(null);

  // Formulario
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

  useEffect(() => { cargarSalas(); }, []);

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
    console.log("Enviando:", { numeroSala: parseInt(numeroSala), precioHora: parseFloat(precioHora), capacidad: parseInt(capacidad) });
    if (!precioHora || !capacidad || (!editando && !numeroSala)) {
      Alert.alert("Campos requeridos", "Completa todos los campos.");
      return;
    }
    try {
      if (editando) {
        await actualizarSala(editando.idSala, {
          precioHora: parseFloat(precioHora),
          capacidad: parseInt(capacidad),
        });
      } else {
        await crearSala({
          numeroSala: parseInt(numeroSala),
          precioHora: parseFloat(precioHora),
          capacidad: parseInt(capacidad),
        });
      }
      setModalVisible(false);
      cargarSalas();
    } catch (e: any) {
      Alert.alert("Error", e.message);
    }
  }

  async function handleDesactivar(sala: Sala) {
    Alert.alert("Desactivar sala", `¿Desactivar la sala ${sala.numeroSala}?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Desactivar",
        style: "destructive",
        onPress: async () => {
          try {
            await desactivarSala(sala.idSala);
            cargarSalas();
          } catch (e: any) {
            Alert.alert("Error", e.message);
          }
        },
      },
    ]);
  }

  async function handleReactivar(sala: Sala) {
    Alert.alert("Activar sala", `¿Activar la sala ${sala.numeroSala}?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Activar",
        onPress: async () => {
          try {
            await actualizarSala(sala.idSala, { estado: "Disponible" });
            cargarSalas();
          } catch (e: any) {
            Alert.alert("Error", e.message);
          }
        },
      },
    ]);
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#0F0F1A", padding: 24 }}>

      {/* Header */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 48, marginBottom: 24 }}>
        <Text style={{ color: "white", fontSize: 24, fontWeight: "bold" }}>Salas</Text>
        <TouchableOpacity
          onPress={abrirCrear}
          style={{ backgroundColor: "#7C3AED", paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, flexDirection: "row", alignItems: "center", gap: 6 }}
        >
          <Ionicons name="add" size={20} color="white" />
          <Text style={{ color: "white", fontWeight: "600" }}>Nueva</Text>
        </TouchableOpacity>
      </View>

      {/* Lista */}
      {loading ? (
        <ActivityIndicator color="#7C3AED" size="large" style={{ marginTop: 40 }} />
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} style={{ gap: 12 }}>
          {salas.map((sala) => (
            <View key={sala.idSala} style={{ backgroundColor: "#1A1A2E", borderRadius: 16, padding: 20, marginBottom: 12 }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                  <Ionicons name="musical-notes" size={20} color="#7C3AED" />
                  <Text style={{ color: "white", fontSize: 18, fontWeight: "600" }}>Sala {sala.numeroSala}</Text>
                </View>
                <View style={{ backgroundColor: estadoColor[sala.estado] + "22", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 }}>
                  <Text style={{ color: estadoColor[sala.estado], fontSize: 12, fontWeight: "600" }}>{sala.estado}</Text>
                </View>
              </View>

              <View style={{ flexDirection: "row", gap: 16, marginBottom: 16 }}>
                <View style={{ flex: 1, backgroundColor: "#0F0F1A", borderRadius: 10, padding: 12, alignItems: "center" }}>
                  <Ionicons name="cash-outline" size={16} color="#6B7280" />
                  <Text style={{ color: "#6B7280", fontSize: 11, marginTop: 4 }}>Precio/hora</Text>
                  <Text style={{ color: "white", fontWeight: "600", marginTop: 2 }}>${sala.precioHora.toLocaleString()}</Text>
                </View>
                <View style={{ flex: 1, backgroundColor: "#0F0F1A", borderRadius: 10, padding: 12, alignItems: "center" }}>
                  <Ionicons name="people-outline" size={16} color="#6B7280" />
                  <Text style={{ color: "#6B7280", fontSize: 11, marginTop: 4 }}>Capacidad</Text>
                  <Text style={{ color: "white", fontWeight: "600", marginTop: 2 }}>{sala.capacidad} personas</Text>
                </View>
              </View>

              <View style={{ flexDirection: "row", gap: 10 }}>
                <TouchableOpacity
                  onPress={() => abrirEditar(sala)}
                  style={{ flex: 1, backgroundColor: "#7C3AED22", borderRadius: 10, paddingVertical: 10, alignItems: "center", flexDirection: "row", justifyContent: "center", gap: 6 }}
                >
                  <Ionicons name="pencil-outline" size={16} color="#7C3AED" />
                  <Text style={{ color: "#7C3AED", fontWeight: "600" }}>Editar</Text>
                </TouchableOpacity>
                {sala.estado !== "Inactiva" ? (
                  <TouchableOpacity
                    onPress={() => handleDesactivar(sala)}
                    style={{ flex: 1, backgroundColor: "#EF444422", borderRadius: 10, paddingVertical: 10, alignItems: "center", flexDirection: "row", justifyContent: "center", gap: 6 }}
                  >
                    <Ionicons name="ban-outline" size={16} color="#EF4444" />
                    <Text style={{ color: "#EF4444", fontWeight: "600" }}>Desactivar</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={() => handleReactivar(sala)}
                    style={{ flex: 1, backgroundColor: "#22C55E22", borderRadius: 10, paddingVertical: 10, alignItems: "center", flexDirection: "row", justifyContent: "center", gap: 6 }}
                  >
                    <Ionicons name="checkmark-circle-outline" size={16} color="#22C55E" />
                    <Text style={{ color: "#22C55E", fontWeight: "600" }}>Activar</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))}
        </ScrollView>
      )}

      {/* Modal crear/editar */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={{ flex: 1, backgroundColor: "#000000AA", justifyContent: "flex-end" }}>
          <View style={{ backgroundColor: "#1A1A2E", borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, gap: 16 }}>
            <Text style={{ color: "white", fontSize: 20, fontWeight: "bold", marginBottom: 8 }}>
              {editando ? `Editar Sala ${editando.numeroSala}` : "Nueva Sala"}
            </Text>

            {!editando && (
              <View style={{ backgroundColor: "#0F0F1A", borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12 }}>
                <Text style={{ color: "#6B7280", fontSize: 11, marginBottom: 4 }}>Número de sala</Text>
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

            <View style={{ backgroundColor: "#0F0F1A", borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12 }}>
              <Text style={{ color: "#6B7280", fontSize: 11, marginBottom: 4 }}>Precio por hora</Text>
              <TextInput
                style={{ color: "white", fontSize: 16 }}
                placeholder="Ej: 50000"
                placeholderTextColor="#6B7280"
                keyboardType="numeric"
                value={precioHora}
                onChangeText={setPrecioHora}
              />
            </View>

            <View style={{ backgroundColor: "#0F0F1A", borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12 }}>
              <Text style={{ color: "#6B7280", fontSize: 11, marginBottom: 4 }}>Capacidad</Text>
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
              style={{ backgroundColor: "#7C3AED", borderRadius: 12, paddingVertical: 16, alignItems: "center" }}
            >
              <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>
                {editando ? "Guardar cambios" : "Crear sala"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setModalVisible(false)} style={{ alignItems: "center", paddingVertical: 8 }}>
              <Text style={{ color: "#6B7280" }}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </View>
  );
}