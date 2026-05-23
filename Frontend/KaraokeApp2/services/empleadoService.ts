import { BASE_URL, getToken, getUsuario } from "./authService";

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

/**
 * BUG 1 & 8 FIXED:
 * El backend (CrearReservaDto) requiere:
 *   - idSala, idUsuario, fechaHoraInicio, fechaHoraFin, cantidadPersonas
 *
 * El frontend original solo enviaba idSala y cantidadPersonas.
 * Ahora se obtiene el idUsuario del token guardado en SecureStore,
 * y se calculan las fechas (inicio = ahora, fin = inicio + 2h por defecto).
 */
export async function crearReserva(data: {
  idSala: number;
  cantidadPersonas: number;
  horasFin?: number; // opcional — por defecto 2 horas
}) {
  const usuario = await getUsuario();
  if (!usuario?.idUsuario) {
    throw new Error("No se encontró el usuario autenticado");
  }

  const ahora = new Date();
  const fin = new Date(ahora.getTime() + (data.horasFin ?? 2) * 60 * 60 * 1000);

  const body = {
    idSala: data.idSala,
    idUsuario: usuario.idUsuario,
    fechaHoraInicio: ahora.toISOString(),
    fechaHoraFin: fin.toISOString(),
    cantidadPersonas: data.cantidadPersonas,
  };

  const res = await fetch(`${BASE_URL}/Reserva`, {
    method: "POST",
    headers: await headers(),
    body: JSON.stringify(body),
  });
  const texto = await res.text();
  if (!res.ok) throw new Error(texto || "Error al crear la reserva");
  return JSON.parse(texto);
}

/**
 * BUG 3 & 9 FIXED:
 * El backend (CerrarReservaDto) requiere { horaSalida } en el body.
 * El frontend original hacía un PATCH sin body → 400 / null reference.
 */
export async function cerrarReserva(idReserva: number) {
  const body = {
    horaSalida: new Date().toISOString(),
  };

  const res = await fetch(`${BASE_URL}/Reserva/${idReserva}/cerrar`, {
    method: "PATCH",
    headers: await headers(),
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const texto = await res.text();
    throw new Error(texto || "Error al cerrar la reserva");
  }
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

/**
 * BUG 2 & 5 FIXED:
 * El DTO del backend (ActualizarEstadoPedidoDto) tiene la propiedad "EstadoPedido".
 * El frontend enviaba { estado } → el backend lo ignoraba → 400 estado no válido.
 *
 * Además, el backend valida contra: "Pendiente", "En preparación", "Entregado"
 * (con tilde). El frontend enviaba "En preparacion" (sin tilde) → siempre 400.
 */
export async function actualizarEstadoPedido(
  idPedido: number,
  estado: "En preparación" | "Entregado"
) {
  const res = await fetch(`${BASE_URL}/Pedido/${idPedido}/estado`, {
    method: "PATCH",
    headers: await headers(),
    body: JSON.stringify({ estadoPedido: estado }),
  });
  if (!res.ok) {
    const texto = await res.text();
    throw new Error(texto || "Error al actualizar el estado del pedido");
  }
}

export async function liberarSala(idSala: number) {
  const res = await fetch(`${BASE_URL}/Sala/${idSala}`, {
    method: "PUT",
    headers: await headers(),
    body: JSON.stringify({ estado: "Disponible" }),
  });
  if (!res.ok) {
    const texto = await res.text();
    throw new Error(texto || "Error al liberar la sala");
  }
}