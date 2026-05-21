import { Stack } from "expo-router";

export default function AdminLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="salas" />
      <Stack.Screen name="productos" />
      <Stack.Screen name="empleados" />
    </Stack>
  );
}