import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
// IMPORTANTE: Agregamos "logout" a la importación
import { getUsuario, logout } from "../../services/authService";

export default function EmployeeDashboard() {
  const router = useRouter();
  
  // Estado dinámico para el nombre
  const [nombreEmpleado, setNombreEmpleado] = useState("Cargando...");

  // Efecto para obtener el usuario al cargar la pantalla
  useEffect(() => {
    getUsuario().then((user) => {
      if (user) {
        setNombreEmpleado(user.nombre || user.username || "Empleado");
      }
    });
  }, []);

  // Función para cerrar sesión
  const handleLogout = async () => {
    try {
      await logout();
      router.replace("/(auth)/login" as any);
    } catch (error) {
      Alert.alert("Error", "Hubo un problema al cerrar la sesión.");
    }
  };

  return (
    <View style={styles.container}>
      {/* Header Profile */}
      <View style={styles.headerContainer}>
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person" size={24} color="#7C3AED" />
          </View>
          <View>
            <Text style={styles.greetingText}>¡Hola, {nombreEmpleado}!</Text>
            <Text style={styles.roleText}>Panel de Trabajo</Text>
          </View>
        </View>
        
        {/* NUEVO BOTÓN DE CERRAR SESIÓN */}
        <TouchableOpacity 
          style={styles.logoutBtn} 
          onPress={handleLogout}
          activeOpacity={0.7}
        >
          <Ionicons name="log-out-outline" size={22} color="#EF4444" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Módulos Operativos</Text>
        
        <View style={styles.gridMenu}>
          
          {/* BOTÓN 1: SALAS Y RESERVAS */}
          <TouchableOpacity 
            onPress={() => router.push("/(employee)/salas" as any)}
            style={styles.menuCard}
            activeOpacity={0.7}
          >
            <View style={[styles.iconContainer, { backgroundColor: "#10B98115" }]}>
              <Ionicons name="grid-outline" size={28} color="#10B981" />
            </View>
            <Text style={styles.cardTitle}>Salas y Reservas</Text>
            <Text style={styles.cardSubtitle}>Gestionar disponibilidad y tiempos</Text>
          </TouchableOpacity>

          {/* BOTÓN 2: PEDIDOS EN ESPERA */}
          <TouchableOpacity 
            onPress={() => router.push("/(employee)/pedidos" as any)}
            style={styles.menuCard}
            activeOpacity={0.7}
          >
            <View style={[styles.iconContainer, { backgroundColor: "#EC489915" }]}>
              <Ionicons name="fast-food-outline" size={28} color="#EC4899" />
            </View>
            <Text style={styles.cardTitle}>Pedidos en Espera</Text>
            <Text style={styles.cardSubtitle}>Comandas y entregas a salas</Text>
          </TouchableOpacity>

          {/* BOTÓN 3: CIERRE DE CUENTAS */}
          <TouchableOpacity 
            onPress={() => router.push("/(employee)/cuentas" as any)}
            style={styles.menuCard}
            activeOpacity={0.7}
          >
            <View style={[styles.iconContainer, { backgroundColor: "#06B6D415" }]}>
              <Ionicons name="receipt-outline" size={28} color="#06B6D4" />
            </View>
            <Text style={styles.cardTitle}>Cierre de Cuentas</Text>
            <Text style={styles.cardSubtitle}>Facturación y cobro final</Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F0F1A",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: "#1A1A2E",
    borderBottomWidth: 1,
    borderBottomColor: "#2A2A40",
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#7C3AED15",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#7C3AED30",
  },
  greetingText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  roleText: {
    color: "#6B7280",
    fontSize: 13,
  },
  // Estilo actualizado para el botón de logout
  logoutBtn: {
    padding: 10,
    backgroundColor: "#EF444415", 
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#EF444430",
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: {
    padding: 24,
  },
  sectionTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  gridMenu: {
    gap: 16,
  },
  menuCard: {
    backgroundColor: "#1A1A2E",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#7C3AED20",
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  cardTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  cardSubtitle: {
    color: "#9CA3AF",
    fontSize: 14,
  },
});