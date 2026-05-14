import { Ionicons } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { getReservaActivaPorSala } from "../../services/clienteService";

export default function ScanScreen() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [scaneando, setScaneando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const cooldown = useRef(false);

  useEffect(() => {
    if (!permission?.granted) requestPermission();
  }, []);

  async function handleScan({ data }: { data: string }) {
    if (cooldown.current || scaneando) return;
    cooldown.current = true;

    // Formato esperado: karaokeapp://sala/{idSala}
    const match = data.match(/karaokeapp:\/\/sala\/(\d+)/);
    if (!match) {
      setError("QR no válido. Escanea el código de tu sala.");
      setTimeout(() => {
        setError(null);
        cooldown.current = false;
      }, 2500);
      return;
    }

    setScaneando(true);
    const idSala = parseInt(match[1]);

    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      const reserva = await getReservaActivaPorSala(idSala);
      router.push({
        pathname: "/(client)/menu",
        params: {
          idReserva: reserva.idReserva,
          idSala: idSala,
          fechaHoraInicio: reserva.fechaHoraInicio,
          fechaHoraFin: reserva.fechaHoraFin,
        },
      });
    } catch (e: any) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setError(e.message || "No hay reserva activa en esta sala.");
      setTimeout(() => {
        setError(null);
        cooldown.current = false;
        setScaneando(false);
      }, 2500);
    }
  }

  if (!permission) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color="#7C3AED" />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Ionicons name="camera-outline" size={48} color="#6B7280" />
        <Text style={styles.permText}>Se necesita acceso a la cámara</Text>
        <TouchableOpacity style={styles.btn} onPress={requestPermission}>
          <Text style={styles.btnText}>Permitir cámara</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#0F0F1A" }}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        onBarcodeScanned={scaneando ? undefined : handleScan}
        barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
      />

      {/* Overlay oscuro con recorte */}
      <View style={styles.overlay}>
        {/* Top */}
        <View style={styles.overlayDark} />

        {/* Middle row */}
        <View style={{ flexDirection: "row" }}>
          <View style={[styles.overlayDark, { flex: 1 }]} />
          {/* Marco del QR */}
          <View style={styles.qrFrame}>
            <View style={[styles.corner, styles.tl]} />
            <View style={[styles.corner, styles.tr]} />
            <View style={[styles.corner, styles.bl]} />
            <View style={[styles.corner, styles.br]} />
          </View>
          <View style={[styles.overlayDark, { flex: 1 }]} />
        </View>

        {/* Bottom */}
        <View style={[styles.overlayDark, { flex: 1, alignItems: "center", justifyContent: "flex-start", paddingTop: 32 }]}>
          {error ? (
            <View style={styles.errorBadge}>
              <Ionicons name="alert-circle-outline" size={18} color="#FCA5A5" />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : scaneando ? (
            <View style={styles.infoBadge}>
              <ActivityIndicator size="small" color="#7C3AED" />
              <Text style={styles.infoText}>Buscando reserva...</Text>
            </View>
          ) : (
            <Text style={styles.hint}>Apunta al código QR de tu sala</Text>
          )}
        </View>
      </View>

      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="mic" size={24} color="#7C3AED" />
        <Text style={styles.headerTitle}>KaraokeApp</Text>
      </View>
    </View>
  );
}

const FRAME = 240;
const CORNER = 24;
const THICKNESS = 3;

const styles = StyleSheet.create({
  center: { flex: 1, backgroundColor: "#0F0F1A", alignItems: "center", justifyContent: "center", gap: 16, padding: 32 },
  permText: { color: "white", fontSize: 16, textAlign: "center" },
  btn: { backgroundColor: "#7C3AED", paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12 },
  btnText: { color: "white", fontWeight: "600" },
  overlay: { flex: 1 },
  overlayDark: { height: FRAME * 0.7, backgroundColor: "rgba(0,0,0,0.6)" },
  qrFrame: { width: FRAME, height: FRAME, position: "relative" },
  corner: { position: "absolute", width: CORNER, height: CORNER, borderColor: "#7C3AED" },
  tl: { top: 0, left: 0, borderTopWidth: THICKNESS, borderLeftWidth: THICKNESS, borderTopLeftRadius: 4 },
  tr: { top: 0, right: 0, borderTopWidth: THICKNESS, borderRightWidth: THICKNESS, borderTopRightRadius: 4 },
  bl: { bottom: 0, left: 0, borderBottomWidth: THICKNESS, borderLeftWidth: THICKNESS, borderBottomLeftRadius: 4 },
  br: { bottom: 0, right: 0, borderBottomWidth: THICKNESS, borderRightWidth: THICKNESS, borderBottomRightRadius: 4 },
  header: { position: "absolute", top: 52, left: 0, right: 0, flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 8 },
  headerTitle: { color: "white", fontSize: 20, fontWeight: "bold", letterSpacing: 2 },
  errorBadge: { flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: "#7F1D1D", paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12 },
  errorText: { color: "#FCA5A5", fontWeight: "600" },
  infoBadge: { flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: "#1A1A2E", paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12 },
  infoText: { color: "white" },
  hint: { color: "rgba(255,255,255,0.7)", fontSize: 14 },
});