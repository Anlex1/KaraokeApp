import { BASE_URL, getToken } from "./authService";

async function headers() {
  const token = await getToken();
  return { "Content-Type": "application/json", Authorization: `Bearer ${token}` };
}

export async function getProductos() {
  const res = await fetch(`${BASE_URL}/Producto`, { headers: await headers() });
  if (!res.ok) throw new Error("Error al obtener productos");
  return res.json();
}

export async function crearProducto(data: { nombre: string; precio: number; stock: number }) {
  const res = await fetch(`${BASE_URL}/Producto`, { method: "POST", headers: await headers(), body: JSON.stringify(data) });
  if (!res.ok) throw new Error("Error al crear producto");
  return res.json();
}

export async function actualizarProducto(id: number, data: { nombre?: string; precio?: number; stock?: number; estadoActivo?: boolean }) {
  const res = await fetch(`${BASE_URL}/Producto/${id}`, { method: "PUT", headers: await headers(), body: JSON.stringify(data) });
  if (!res.ok) throw new Error("Error al actualizar producto");
}

export async function desactivarProducto(id: number) {
  const res = await fetch(`${BASE_URL}/Producto/${id}/desactivar`, { method: "PATCH", headers: await headers() });
  if (!res.ok) throw new Error("Error al desactivar producto");
}