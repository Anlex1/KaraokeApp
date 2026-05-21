import { BASE_URL, getToken } from "./authService";

async function headers() {
  const token = await getToken();
  return { "Content-Type": "application/json", Authorization: `Bearer ${token}` };
}

export async function getUsuarios() {
  const res = await fetch(`${BASE_URL}/Usuario`, { headers: await headers() });
  if (!res.ok) throw new Error("Error al obtener usuarios");
  return res.json();
}

export async function crearUsuario(data: { nombre: string; rol: string; username: string; contraseña: string; correo: string }) {
  const res = await fetch(`${BASE_URL}/Usuario`, { method: "POST", headers: await headers(), body: JSON.stringify(data) });
  if (!res.ok) throw new Error("Error al crear usuario");
  return res.json();
}

export async function actualizarUsuario(id: number, data: { nombre?: string; correo?: string; estado?: string }) {
  const res = await fetch(`${BASE_URL}/Usuario/${id}`, { method: "PUT", headers: await headers(), body: JSON.stringify(data) });
  if (!res.ok) throw new Error("Error al actualizar usuario");
}

export async function banearUsuario(id: number) {
  const res = await fetch(`${BASE_URL}/Usuario/${id}/banear`, { method: "PATCH", headers: await headers() });
  if (!res.ok) throw new Error("Error al banear usuario");
}