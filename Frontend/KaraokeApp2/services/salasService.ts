import { getToken } from "./authService";

const BASE_URL = "http://192.168.20.21:5203/api";

async function headers() {
  const token = await getToken();
  return { "Content-Type": "application/json", Authorization: `Bearer ${token}` };
}

export async function getSalas() {
  const res = await fetch(`${BASE_URL}/Sala`, { headers: await headers() });
  if (!res.ok) throw new Error("Error al obtener salas");
  return res.json();
}

export async function crearSala(data: { numeroSala: number; precioHora: number; capacidad: number }) {
  const body = {
    numeroSala: data.numeroSala.toString(),
    precioHora: data.precioHora,
    capacidad: data.capacidad,
  };
  const res = await fetch(`${BASE_URL}/Sala`, { method: "POST", headers: await headers(), body: JSON.stringify(body) });
  const texto = await res.text();
  if (!res.ok) throw new Error(texto);
  return JSON.parse(texto);
}

export async function actualizarSala(id: number, data: { precioHora?: number; capacidad?: number; estado?: string }) {
  const res = await fetch(`${BASE_URL}/Sala/${id}`, { method: "PUT", headers: await headers(), body: JSON.stringify(data) });
  if (!res.ok) throw new Error("Error al actualizar sala");
}

export async function desactivarSala(id: number) {
  const res = await fetch(`${BASE_URL}/Sala/${id}/desactivar`, { method: "PATCH", headers: await headers() });
  if (!res.ok) throw new Error("Error al desactivar sala");
}