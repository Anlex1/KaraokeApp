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
import { actualizarProducto, crearProducto, desactivarProducto, getProductos } from "../../services/productosService";

interface Producto {
  idProducto: number;
  nombre: string;
  precio: number;
  stock: number;
  estadoActivo: boolean;
}

export default function ProductosScreen() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editando, setEditando] = useState<Producto | null>(null);

  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [stock, setStock] = useState("");

  async function cargarProductos() {
    setLoading(true);
    try {
      const data = await getProductos();
      setProductos(data);
    } catch (e: any) {
      Alert.alert("Error", e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { cargarProductos(); }, []);

  function abrirCrear() {
    setEditando(null);
    setNombre("");
    setPrecio("");
    setStock("");
    setModalVisible(true);
  }

  function abrirEditar(producto: Producto) {
    setEditando(producto);
    setNombre(producto.nombre);
    setPrecio(producto.precio.toString());
    setStock(producto.stock.toString());
    setModalVisible(true);
  }

  async function handleGuardar() {
    if (!nombre || !precio || !stock) {
      Alert.alert("Campos requeridos", "Completa todos los campos.");
      return;
    }
    try {
      if (editando) {
        await actualizarProducto(editando.idProducto, {
          nombre,
          precio: parseFloat(precio),
          stock: parseInt(stock),
        });
      } else {
        await crearProducto({
          nombre,
          precio: parseFloat(precio),
          stock: parseInt(stock),
        });
      }
      setModalVisible(false);
      cargarProductos();
    } catch (e: any) {
      Alert.alert("Error", e.message);
    }
  }

  async function handleToggleEstado(producto: Producto) {
    const accion = producto.estadoActivo ? "desactivar" : "activar";
    Alert.alert(
      `${accion.charAt(0).toUpperCase() + accion.slice(1)} producto`,
      `¿Deseas ${accion} "${producto.nombre}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: accion.charAt(0).toUpperCase() + accion.slice(1),
          style: producto.estadoActivo ? "destructive" : "default",
          onPress: async () => {
            try {
              if (producto.estadoActivo) {
                await desactivarProducto(producto.idProducto);
              } else {
                await actualizarProducto(producto.idProducto, { estadoActivo: true });
              }
              cargarProductos();
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
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 48, marginBottom: 24 }}>
        <Text style={{ color: "white", fontSize: 24, fontWeight: "bold" }}>Productos</Text>
        <TouchableOpacity
          onPress={abrirCrear}
          style={{ backgroundColor: "#EC4899", paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, flexDirection: "row", alignItems: "center", gap: 6 }}
        >
          <Ionicons name="add" size={20} color="white" />
          <Text style={{ color: "white", fontWeight: "600" }}>Nuevo</Text>
        </TouchableOpacity>
      </View>

      {/* Lista */}
      {loading ? (
        <ActivityIndicator color="#EC4899" size="large" style={{ marginTop: 40 }} />
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          {productos.map((producto) => (
            <View key={producto.idProducto} style={{ backgroundColor: "#1A1A2E", borderRadius: 16, padding: 20, marginBottom: 12 }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                  <Ionicons name="fast-food" size={20} color="#EC4899" />
                  <Text style={{ color: "white", fontSize: 18, fontWeight: "600" }}>{producto.nombre}</Text>
                </View>
                <View style={{ backgroundColor: producto.estadoActivo ? "#22C55E22" : "#6B728022", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 }}>
                  <Text style={{ color: producto.estadoActivo ? "#22C55E" : "#6B7280", fontSize: 12, fontWeight: "600" }}>
                    {producto.estadoActivo ? "Activo" : "Inactivo"}
                  </Text>
                </View>
              </View>

              <View style={{ flexDirection: "row", gap: 16, marginBottom: 16 }}>
                <View style={{ flex: 1, backgroundColor: "#0F0F1A", borderRadius: 10, padding: 12, alignItems: "center" }}>
                  <Ionicons name="cash-outline" size={16} color="#6B7280" />
                  <Text style={{ color: "#6B7280", fontSize: 11, marginTop: 4 }}>Precio</Text>
                  <Text style={{ color: "white", fontWeight: "600", marginTop: 2 }}>${producto.precio.toLocaleString()}</Text>
                </View>
                <View style={{ flex: 1, backgroundColor: "#0F0F1A", borderRadius: 10, padding: 12, alignItems: "center" }}>
                  <Ionicons name="cube-outline" size={16} color="#6B7280" />
                  <Text style={{ color: "#6B7280", fontSize: 11, marginTop: 4 }}>Stock</Text>
                  <Text style={{ color: "white", fontWeight: "600", marginTop: 2 }}>{producto.stock} uds</Text>
                </View>
              </View>

              <View style={{ flexDirection: "row", gap: 10 }}>
                <TouchableOpacity
                  onPress={() => abrirEditar(producto)}
                  style={{ flex: 1, backgroundColor: "#EC489922", borderRadius: 10, paddingVertical: 10, alignItems: "center", flexDirection: "row", justifyContent: "center", gap: 6 }}
                >
                  <Ionicons name="pencil-outline" size={16} color="#EC4899" />
                  <Text style={{ color: "#EC4899", fontWeight: "600" }}>Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleToggleEstado(producto)}
                  style={{ flex: 1, backgroundColor: producto.estadoActivo ? "#EF444422" : "#22C55E22", borderRadius: 10, paddingVertical: 10, alignItems: "center", flexDirection: "row", justifyContent: "center", gap: 6 }}
                >
                  <Ionicons name={producto.estadoActivo ? "ban-outline" : "checkmark-circle-outline"} size={16} color={producto.estadoActivo ? "#EF4444" : "#22C55E"} />
                  <Text style={{ color: producto.estadoActivo ? "#EF4444" : "#22C55E", fontWeight: "600" }}>
                    {producto.estadoActivo ? "Desactivar" : "Activar"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      )}

      {/* Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={{ flex: 1, backgroundColor: "#000000AA", justifyContent: "flex-end" }}>
          <View style={{ backgroundColor: "#1A1A2E", borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, gap: 16 }}>
            <Text style={{ color: "white", fontSize: 20, fontWeight: "bold", marginBottom: 8 }}>
              {editando ? `Editar ${editando.nombre}` : "Nuevo Producto"}
            </Text>

            <View style={{ backgroundColor: "#0F0F1A", borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12 }}>
              <Text style={{ color: "#6B7280", fontSize: 11, marginBottom: 4 }}>Nombre</Text>
              <TextInput
                style={{ color: "white", fontSize: 16 }}
                placeholder="Ej: Cerveza"
                placeholderTextColor="#6B7280"
                value={nombre}
                onChangeText={setNombre}
              />
            </View>

            <View style={{ backgroundColor: "#0F0F1A", borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12 }}>
              <Text style={{ color: "#6B7280", fontSize: 11, marginBottom: 4 }}>Precio</Text>
              <TextInput
                style={{ color: "white", fontSize: 16 }}
                placeholder="Ej: 5000"
                placeholderTextColor="#6B7280"
                keyboardType="numeric"
                value={precio}
                onChangeText={setPrecio}
              />
            </View>

            <View style={{ backgroundColor: "#0F0F1A", borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12 }}>
              <Text style={{ color: "#6B7280", fontSize: 11, marginBottom: 4 }}>Stock</Text>
              <TextInput
                style={{ color: "white", fontSize: 16 }}
                placeholder="Ej: 50"
                placeholderTextColor="#6B7280"
                keyboardType="numeric"
                value={stock}
                onChangeText={setStock}
              />
            </View>

            <TouchableOpacity
              onPress={handleGuardar}
              style={{ backgroundColor: "#EC4899", borderRadius: 12, paddingVertical: 16, alignItems: "center" }}
            >
              <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>
                {editando ? "Guardar cambios" : "Crear producto"}
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