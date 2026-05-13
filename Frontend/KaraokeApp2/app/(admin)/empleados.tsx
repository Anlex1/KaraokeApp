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
  View
} from "react-native";
import { actualizarUsuario, banearUsuario, crearUsuario, getUsuarios } from "../../services/usuariosService";

interface Usuario {
  idUsuario: number;
  nombre: string;
  username: string;
  correo: string;
  rol: string;
  estado: string;
}

export default function EmpleadosScreen() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editando, setEditando] = useState<Usuario | null>(null);

  const [nombre, setNombre] = useState("");
  const [username, setUsername] = useState("");
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [rol, setRol] = useState<"Empleado" | "Admin">("Empleado");
  const [showPass, setShowPass] = useState(false);

  async function cargarUsuarios() {
    setLoading(true);
    try {
      const data = await getUsuarios();
      setUsuarios(data);
    } catch (e: any) {
      Alert.alert("Error", e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { cargarUsuarios(); }, []);

  function abrirCrear() {
    setEditando(null);
    setNombre("");
    setUsername("");
    setCorreo("");
    setContrasena("");
    setRol("Empleado");
    setModalVisible(true);
  }

  function abrirEditar(usuario: Usuario) {
    setEditando(usuario);
    setNombre(usuario.nombre);
    setUsername(usuario.username);
    setCorreo(usuario.correo);
    setContrasena("");
    setRol(usuario.rol as "Empleado" | "Admin");
    setModalVisible(true);
  }

  async function handleGuardar() {
    if (!nombre || !correo || (!editando && (!username || !contrasena))) {
      Alert.alert("Campos requeridos", "Completa todos los campos.");
      return;
    }
    try {
      if (editando) {
        await actualizarUsuario(editando.idUsuario, { nombre, correo });
      } else {
        await crearUsuario({ nombre, username, correo, contraseña: contrasena, rol });
      }
      setModalVisible(false);
      cargarUsuarios();
    } catch (e: any) {
      Alert.alert("Error", e.message);
    }
  }

  async function handleToggleEstado(usuario: Usuario) {
    const baneado = usuario.estado === "Baneado";
    Alert.alert(
      baneado ? "Activar usuario" : "Banear usuario",
      `¿Deseas ${baneado ? "activar" : "banear"} a "${usuario.nombre}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: baneado ? "Activar" : "Banear",
          style: baneado ? "default" : "destructive",
          onPress: async () => {
            try {
              if (baneado) {
                await actualizarUsuario(usuario.idUsuario, { estado: "Activo" });
              } else {
                await banearUsuario(usuario.idUsuario);
              }
              cargarUsuarios();
            } catch (e: any) {
              Alert.alert("Error", e.message);
            }
          },
        },
      ]
    );
  }

  const rolColor: Record<string, string> = {
    Admin: "#7C3AED",
    Empleado: "#06B6D4",
  };

  const estadoColor: Record<string, string> = {
    Activo: "#22C55E",
    Baneado: "#EF4444",
    Inactivo: "#6B7280",
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#0F0F1A", padding: 24 }}>

      {/* Header */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 48, marginBottom: 24 }}>
        <Text style={{ color: "white", fontSize: 24, fontWeight: "bold" }}>Empleados</Text>
        <TouchableOpacity
          onPress={abrirCrear}
          style={{ backgroundColor: "#06B6D4", paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, flexDirection: "row", alignItems: "center", gap: 6 }}
        >
          <Ionicons name="add" size={20} color="white" />
          <Text style={{ color: "white", fontWeight: "600" }}>Nuevo</Text>
        </TouchableOpacity>
      </View>

      {/* Lista */}
      {loading ? (
        <ActivityIndicator color="#06B6D4" size="large" style={{ marginTop: 40 }} />
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          {usuarios.map((usuario) => (
            <View key={usuario.idUsuario} style={{ backgroundColor: "#1A1A2E", borderRadius: 16, padding: 20, marginBottom: 12 }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                  <View style={{ backgroundColor: rolColor[usuario.rol] + "22", padding: 8, borderRadius: 10 }}>
                    <Ionicons name="person" size={18} color={rolColor[usuario.rol] ?? "#6B7280"} />
                  </View>
                  <View>
                    <Text style={{ color: "white", fontSize: 16, fontWeight: "600" }}>{usuario.nombre}</Text>
                    <Text style={{ color: "#6B7280", fontSize: 12 }}>@{usuario.username}</Text>
                  </View>
                </View>
                <View style={{ backgroundColor: estadoColor[usuario.estado] + "22", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 }}>
                  <Text style={{ color: estadoColor[usuario.estado] ?? "#6B7280", fontSize: 12, fontWeight: "600" }}>{usuario.estado}</Text>
                </View>
              </View>

              <View style={{ backgroundColor: "#0F0F1A", borderRadius: 10, padding: 12, marginBottom: 12, flexDirection: "row", alignItems: "center", gap: 8 }}>
                <Ionicons name="mail-outline" size={14} color="#6B7280" />
                <Text style={{ color: "#6B7280", fontSize: 13 }}>{usuario.correo}</Text>
                <View style={{ marginLeft: "auto", backgroundColor: rolColor[usuario.rol] + "22", paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 }}>
                  <Text style={{ color: rolColor[usuario.rol] ?? "#6B7280", fontSize: 11, fontWeight: "600" }}>{usuario.rol}</Text>
                </View>
              </View>

              <View style={{ flexDirection: "row", gap: 10 }}>
                <TouchableOpacity
                  onPress={() => abrirEditar(usuario)}
                  style={{ flex: 1, backgroundColor: "#06B6D422", borderRadius: 10, paddingVertical: 10, alignItems: "center", flexDirection: "row", justifyContent: "center", gap: 6 }}
                >
                  <Ionicons name="pencil-outline" size={16} color="#06B6D4" />
                  <Text style={{ color: "#06B6D4", fontWeight: "600" }}>Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleToggleEstado(usuario)}
                  style={{ flex: 1, backgroundColor: usuario.estado === "Baneado" ? "#22C55E22" : "#EF444422", borderRadius: 10, paddingVertical: 10, alignItems: "center", flexDirection: "row", justifyContent: "center", gap: 6 }}
                >
                  <Ionicons name={usuario.estado === "Baneado" ? "checkmark-circle-outline" : "ban-outline"} size={16} color={usuario.estado === "Baneado" ? "#22C55E" : "#EF4444"} />
                  <Text style={{ color: usuario.estado === "Baneado" ? "#22C55E" : "#EF4444", fontWeight: "600" }}>
                    {usuario.estado === "Baneado" ? "Activar" : "Banear"}
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
          <View style={{ backgroundColor: "#1A1A2E", borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: "90%" }}>
            <ScrollView contentContainerStyle={{ padding: 24, gap: 16 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
              <Text style={{ color: "white", fontSize: 20, fontWeight: "bold", marginBottom: 8 }}>
                {editando ? `Editar ${editando.nombre}` : "Nuevo Usuario"}
              </Text>

              <View style={{ backgroundColor: "#0F0F1A", borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12 }}>
                <Text style={{ color: "#6B7280", fontSize: 11, marginBottom: 4 }}>Nombre</Text>
                <TextInput style={{ color: "white", fontSize: 16 }} placeholder="Ej: Juan Pérez" placeholderTextColor="#6B7280" value={nombre} onChangeText={setNombre} />
              </View>

              {!editando && (
                <View style={{ backgroundColor: "#0F0F1A", borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12 }}>
                  <Text style={{ color: "#6B7280", fontSize: 11, marginBottom: 4 }}>Username</Text>
                  <TextInput style={{ color: "white", fontSize: 16 }} placeholder="Ej: juanp01" placeholderTextColor="#6B7280" autoCapitalize="none" value={username} onChangeText={setUsername} />
                </View>
              )}

              <View style={{ backgroundColor: "#0F0F1A", borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12 }}>
                <Text style={{ color: "#6B7280", fontSize: 11, marginBottom: 4 }}>Correo</Text>
                <TextInput style={{ color: "white", fontSize: 16 }} placeholder="Ej: juan@email.com" placeholderTextColor="#6B7280" keyboardType="email-address" autoCapitalize="none" value={correo} onChangeText={setCorreo} />
              </View>

              {!editando && (
                <>
                  <View style={{ backgroundColor: "#0F0F1A", borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, flexDirection: "row", alignItems: "center" }}>
                    <View style={{ flex: 1 }}>
                      <Text style={{ color: "#6B7280", fontSize: 11, marginBottom: 4 }}>Contraseña</Text>
                      <TextInput style={{ color: "white", fontSize: 16 }} placeholder="Contraseña" placeholderTextColor="#6B7280" secureTextEntry={!showPass} value={contrasena} onChangeText={setContrasena} />
                    </View>
                    <TouchableOpacity onPress={() => setShowPass(!showPass)}>
                      <Ionicons name={showPass ? "eye-off-outline" : "eye-outline"} size={20} color="#6B7280" />
                    </TouchableOpacity>
                  </View>

                  {/* Selector de rol */}
                  <View>
                    <Text style={{ color: "#6B7280", fontSize: 11, marginBottom: 8 }}>Rol</Text>
                    <View style={{ flexDirection: "row", gap: 10 }}>
                      {(["Empleado", "Admin"] as const).map((r) => (
                        <TouchableOpacity
                          key={r}
                          onPress={() => setRol(r)}
                          style={{ flex: 1, backgroundColor: rol === r ? "#06B6D4" : "#0F0F1A", borderRadius: 10, paddingVertical: 12, alignItems: "center" }}
                        >
                          <Text style={{ color: rol === r ? "white" : "#6B7280", fontWeight: "600" }}>{r}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                </>
              )}

              <TouchableOpacity
                onPress={handleGuardar}
                style={{ backgroundColor: "#06B6D4", borderRadius: 12, paddingVertical: 16, alignItems: "center" }}
              >
                <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>
                  {editando ? "Guardar cambios" : "Crear usuario"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => setModalVisible(false)} style={{ alignItems: "center", paddingVertical: 8 }}>
                <Text style={{ color: "#6B7280" }}>Cancelar</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}