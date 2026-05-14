import { Stack } from "expo-router";

export default function ClientLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="scan" />
      <Stack.Screen name="menu" />
      <Stack.Screen name="pedido-estado" />
      <Stack.Screen name="resumen" />
    </Stack>
  );
}