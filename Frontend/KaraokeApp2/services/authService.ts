import * as SecureStore from "expo-secure-store";

export const BASE_URL = "http://192.168.101.80:5203/api";

export async function login(username: string, password: string) {
  const res = await fetch(`${BASE_URL}/Auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, contraseña: password }),
  });

  if (!res.ok) throw new Error("Credenciales incorrectas");

  const data = await res.json();

  const usuario = {
    nombre: data.nombre,
    rol: data.rol.toLowerCase(),
  };

  await SecureStore.setItemAsync("token", data.token);
  await SecureStore.setItemAsync("usuario", JSON.stringify(usuario));
  return { token: data.token, usuario };
}

export async function logout() {
  await SecureStore.deleteItemAsync("token");
  await SecureStore.deleteItemAsync("usuario");
}

export async function getUsuario() {
  const str = await SecureStore.getItemAsync("usuario");
  return str ? JSON.parse(str) : null;
}

export async function getToken() {
  return await SecureStore.getItemAsync("token");
}