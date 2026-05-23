import * as SecureStore from "expo-secure-store";

export const BASE_URL = "http://192.168.18.38:5203/api";

export async function login(username: string, password: string) {
  const res = await fetch(`${BASE_URL}/Auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, contraseña: password }),
  });

  if (!res.ok) throw new Error("Credenciales incorrectas");

  const data = await res.json();
  // data = { token, idUsuario, nombre, rol }

    // Intenta obtener idUsuario del response, si no lo decodifica del JWT
  let idUsuario = data.idUsuario as number;
  if (!idUsuario) {
    const payload = decodeJwtPayload(data.token);
    // El claim es ClaimTypes.NameIdentifier
    idUsuario = parseInt(
      payload?.["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] ?? "0"
    );
  }

const usuario = {
  nombre: data.nombre,
  rol: (data.rol as string).toLowerCase(),
  idUsuario,  // ya viene del backend
};

  await SecureStore.setItemAsync("token", data.token);
  await SecureStore.setItemAsync("usuario", JSON.stringify(usuario));

  return { token: data.token, usuario };
}

export async function logout() {
  await SecureStore.deleteItemAsync("token");
  await SecureStore.deleteItemAsync("usuario");
}

export async function getUsuario(): Promise<{
  nombre: string;
  rol: string;
  idUsuario: number;
} | null> {
  const str = await SecureStore.getItemAsync("usuario");
  return str ? JSON.parse(str) : null;
}

export async function getToken() {
  return await SecureStore.getItemAsync("token");
}

function decodeJwtPayload(token: string): any {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
}