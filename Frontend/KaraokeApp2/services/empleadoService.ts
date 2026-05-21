import { BASE_URL, getToken } from "./authService";

async function headers() {
  const token = await getToken();
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

// ─── Salas ───────────────────────────────────────────────────────────────────

export async function getSalas() {
  const res = await fetch(`${BASE_URL}/Sala`, { headers: await headers() });
  if (!res.ok) throw new Error("Error al obtener salas");
  return res.json();
}

// ─── Reservas ────────────────────────────────────────────────────────────────

export async function getReservaActivaPorSala(idSala: number) {
  const res = await fetch(`${BASE_URL}/Reserva/sala/${idSala}/activa`, {
    headers: await headers(),
  });
  if (!res.ok) throw new Error("No hay reserva activa en esta sala");
  return res.json();
}

export async function crearReserva(data: {
  idSala: number;
  cantidadPersonas: number;
}) {
  const res = await fetch(`${BASE_URL}/Reserva`, {
    method: "POST",
    headers: await headers(),
    body: JSON.stringify(data),
  });
  const texto = await res.text();
  if (!res.ok) throw new Error(texto || "Error al crear la reserva");
  return JSON.parse(texto);
}

export async function cerrarReserva(idReserva: number) {
  const res = await fetch(`${BASE_URL}/Reserva/${idReserva}/cerrar`, {
    method: "PATCH",
    headers: await headers(),
  });
  if (!res.ok) throw new Error("Error al cerrar la reserva");
  const texto = await res.text();
  return texto ? JSON.parse(texto) : null;
}

// ─── Pedidos ─────────────────────────────────────────────────────────────────

export async function getPedidosPorReserva(idReserva: number) {
  const res = await fetch(`${BASE_URL}/Pedido/reserva/${idReserva}`, {
    headers: await headers(),
  });
  if (!res.ok) throw new Error("Error al obtener pedidos");
  return res.json();
}

export async function actualizarEstadoPedido(
  idPedido: number,
  estado: "En preparacion" | "Entregado"
) {
  const res = await fetch(`${BASE_URL}/Pedido/${idPedido}/estado`, {
    method: "PATCH",
    headers: await headers(),
    body: JSON.stringify({ estado }),
  });
  if (!res.ok) throw new Error("Error al actualizar el estado del pedido");
}