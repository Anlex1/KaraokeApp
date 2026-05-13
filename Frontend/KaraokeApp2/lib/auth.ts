import * as SecureStore from "expo-secure-store";
import { Usuario } from "../types";

export async function saveSession(token: string, usuario: Usuario) {
  await SecureStore.setItemAsync("token", token);
  await SecureStore.setItemAsync("usuario", JSON.stringify(usuario));
}

export async function getSession(): Promise<{ token: string; usuario: Usuario } | null> {
  const token = await SecureStore.getItemAsync("token");
  const usuarioStr = await SecureStore.getItemAsync("usuario");
  if (!token || !usuarioStr) return null;
  return { token, usuario: JSON.parse(usuarioStr) };
}

export async function clearSession() {
  await SecureStore.deleteItemAsync("token");
  await SecureStore.deleteItemAsync("usuario");
}