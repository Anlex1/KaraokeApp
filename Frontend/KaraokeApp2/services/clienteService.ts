import { BASE_URL } from "./authService";

// Sin autenticación — el cliente no hace login

export async function getReservaActivaPorSala(idSala: number) {
  const res = await fetch(`${BASE_URL}/Reserva/sala/${idSala}/activa`);
  if (!res.ok) throw new Error("No hay reserva activa en esta sala");
  return res.json();
}

export async function getProductosActivos() {
  const res = await fetch(`${BASE_URL}/Producto/activos`);
  if (!res.ok) throw new Error("Error al cargar el menú");
  return res.json();
}

export async function crearPedido(idReserva: number, detalles: { idProducto: number; cantidad: number }[]) {
  const res = await fetch(`${BASE_URL}/Pedido`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idReserva, detalles }),
  });
  if (!res.ok) {
    const texto = await res.text();
    throw new Error(texto || "Error al crear el pedido");
  }
  return res.json();
}

export async function getPedidosPorReserva(idReserva: number) {
  const res = await fetch(`${BASE_URL}/Pedido/reserva/${idReserva}`);
  if (!res.ok) throw new Error("Error al obtener pedidos");
  return res.json();
}