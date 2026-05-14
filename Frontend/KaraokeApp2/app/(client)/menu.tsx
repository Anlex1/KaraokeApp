import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { crearPedido, getProductosActivos } from "../../services/clienteService";

interface Producto {
  idProducto: number;
  nombre: string;
  precio: number;
  stock: number;
  estadoActivo: boolean;
}

interface ItemCarrito {
  producto: Producto;
  cantidad: number;
}

export default function MenuScreen() {
  const { idReserva, idSala, fechaHoraFin } = useLocalSearchParams<{
    idReserva: string;
    idSala: string;
    fechaHoraFin: string;
  }>();
  const router = useRouter();

  const [productos, setProductos] = useState<Producto[]>([]);
  const [carrito, setCarrito] = useState<Map<number, ItemCarrito>>(new Map());
  const [loading, setLoading] = useState(true);
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    getProductosActivos()
      .then(setProductos)
      .catch((e) => Alert.alert("Error", e.message))
      .finally(() => setLoading(false));
  }, []);

  function agregarAlCarrito(producto: Producto) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setCarrito((prev) => {
      const next = new Map(prev);
      const item = next.get(producto.idProducto);
      if (item) {
        if (item.cantidad >= producto.stock) return prev; // no más stock
        next.set(producto.idProducto, { ...item, cantidad: item.cantidad + 1 });
      } else {
        next.set(producto.idProducto, { producto, cantidad: 1 });
      }
      return next;
    });
  }

  function quitarDelCarrito(idProducto: number) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setCarrito((prev) => {
      const next = new Map(prev);
      const item = next.get(idProducto);
      if (!item) return prev;
      if (item.cantidad <= 1) {
        next.delete(idProducto);
      } else {
        next.set(idProducto, { ...item, cantidad: item.cantidad - 1 });
      }
      return next;
    });
  }

  const totalCarrito = [...carrito.values()].reduce(
    (sum, item) => sum + item.producto.precio * item.cantidad,
    0
  );
  const cantidadItems = [...carrito.values()].reduce((sum, item) => sum + item.cantidad, 0);

  async function handlePedir() {
    if (carrito.size === 0) return;
    setEnviando(true);
    try {
      const detalles = [...carrito.values()].map((item) => ({
        idProducto: item.producto.idProducto,
        cantidad: item.cantidad,
      }));
      await crearPedido(parseInt(idReserva!), detalles);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setCarrito(new Map());
      router.push({
        pathname: "/(client)/pedido-estado",
        params: { idReserva, idSala, fechaHoraFin },
      });
    } catch (e: any) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("Error al pedir", e.message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#0F0F1A" }}>
      {/* Header */}
      <View style={{ paddingTop: 52, paddingHorizontal: 24, paddingBottom: 16, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <View>
          <Text style={{ color: "#6B7280", fontSize: 12 }}>Sala {idSala}</Text>
          <Text style={{ color: "white", fontSize: 22, fontWeight: "bold" }}>Menú</Text>
        </View>
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: "/(client)/resumen",
              params: { idReserva, idSala, fechaHoraFin },
            })
          }
          style={{ backgroundColor: "#1A1A2E", padding: 10, borderRadius: 12 }}
        >
          <Ionicons name="receipt-outline" size={22} color="#7C3AED" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator color="#7C3AED" size="large" style={{ marginTop: 60 }} />
      ) : (
        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 160 }}
          showsVerticalScrollIndicator={false}
        >
          {productos.map((producto) => {
            const enCarrito = carrito.get(producto.idProducto);
            return (
              <View
                key={producto.idProducto}
                style={{
                  backgroundColor: "#1A1A2E",
                  borderRadius: 16,
                  padding: 16,
                  marginBottom: 12,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                {/* Icono */}
                <View style={{ backgroundColor: "#EC489922", padding: 10, borderRadius: 12 }}>
                  <Ionicons name="fast-food-outline" size={22} color="#EC4899" />
                </View>

                {/* Info */}
                <View style={{ flex: 1 }}>
                  <Text style={{ color: "white", fontWeight: "600", fontSize: 15 }}>{producto.nombre}</Text>
                  <Text style={{ color: "#EC4899", fontWeight: "700", marginTop: 2 }}>
                    ${producto.precio.toLocaleString()}
                  </Text>
                  {producto.stock <= 5 && (
                    <Text style={{ color: "#EAB308", fontSize: 11, marginTop: 2 }}>
                      Solo quedan {producto.stock}
                    </Text>
                  )}
                </View>

                {/* Controles */}
                {enCarrito ? (
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                    <TouchableOpacity
                      onPress={() => quitarDelCarrito(producto.idProducto)}
                      style={{ backgroundColor: "#0F0F1A", borderRadius: 8, width: 32, height: 32, alignItems: "center", justifyContent: "center" }}
                    >
                      <Ionicons name="remove" size={18} color="white" />
                    </TouchableOpacity>
                    <Text style={{ color: "white", fontWeight: "700", fontSize: 16, minWidth: 20, textAlign: "center" }}>
                      {enCarrito.cantidad}
                    </Text>
                    <TouchableOpacity
                      onPress={() => agregarAlCarrito(producto)}
                      style={{ backgroundColor: "#7C3AED", borderRadius: 8, width: 32, height: 32, alignItems: "center", justifyContent: "center" }}
                    >
                      <Ionicons name="add" size={18} color="white" />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity
                    onPress={() => agregarAlCarrito(producto)}
                    style={{ backgroundColor: "#7C3AED", borderRadius: 10, paddingHorizontal: 14, paddingVertical: 8 }}
                  >
                    <Ionicons name="add" size={20} color="white" />
                  </TouchableOpacity>
                )}
              </View>
            );
          })}
        </ScrollView>
      )}

      {/* Barra de carrito flotante */}
      {cantidadItems > 0 && (
        <View style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          backgroundColor: "#1A1A2E",
          borderTopLeftRadius: 24, borderTopRightRadius: 24,
          padding: 20, paddingBottom: 36,
        }}>
          {/* Resumen carrito */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
            {[...carrito.values()].map((item) => (
              <View key={item.producto.idProducto} style={{
                backgroundColor: "#0F0F1A", borderRadius: 10,
                paddingHorizontal: 12, paddingVertical: 8, marginRight: 8,
                flexDirection: "row", alignItems: "center", gap: 6,
              }}>
                <Text style={{ color: "white", fontSize: 13 }}>{item.producto.nombre}</Text>
                <View style={{ backgroundColor: "#7C3AED", borderRadius: 10, paddingHorizontal: 6, paddingVertical: 2 }}>
                  <Text style={{ color: "white", fontSize: 11, fontWeight: "700" }}>x{item.cantidad}</Text>
                </View>
              </View>
            ))}
          </ScrollView>

          <TouchableOpacity
            onPress={handlePedir}
            disabled={enviando}
            style={{
              backgroundColor: "#7C3AED", borderRadius: 14,
              paddingVertical: 16, flexDirection: "row",
              alignItems: "center", justifyContent: "center", gap: 8,
            }}
          >
            {enviando ? (
              <ActivityIndicator color="white" />
            ) : (
              <>
                <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>
                  Realizar pedido
                </Text>
                <View style={{ backgroundColor: "rgba(255,255,255,0.2)", borderRadius: 10, paddingHorizontal: 10, paddingVertical: 4 }}>
                  <Text style={{ color: "white", fontWeight: "700" }}>${totalCarrito.toLocaleString()}</Text>
                </View>
              </>
            )}
          </TouchableOpacity>
        </View>
      )}

      {/* Botón ver mis pedidos (cuando no hay carrito) */}
      {cantidadItems === 0 && (
        <View style={{ position: "absolute", bottom: 36, left: 24, right: 24 }}>
          <TouchableOpacity
            onPress={() => router.push({ pathname: "/(client)/pedido-estado", params: { idReserva, idSala, fechaHoraFin } })}
            style={{ backgroundColor: "#1A1A2E", borderRadius: 14, paddingVertical: 14, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 }}
          >
            <Ionicons name="time-outline" size={18} color="#7C3AED" />
            <Text style={{ color: "#7C3AED", fontWeight: "600" }}>Ver mis pedidos</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}