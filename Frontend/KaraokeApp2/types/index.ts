export type Rol = "admin" | "empleado";

export interface Usuario {
  id_Usuario: number;
  nombre: string;
  rol: Rol;
  username: string;
  correo: string;
  estado: boolean;
}

export interface Sala {
  id_Sala: number;
  numero_Sala: number;
  estado: "Disponible" | "Ocupada" | "Inactiva";
  precio_Hora: number;
  capacidad: number;
}

export interface Reserva {
  id_Reserva: number;
  id_Sala: number;
  id_Usuario: number;
  fecha_Hora_Inicio: string;
  fecha_Hora_Fin: string;
  estado_Reserva: "Activa" | "Cerrada" | "Cancelada";
  cantidad_Personas: number;
  valor_Total: number;
  hora_Llegada: string;
  hora_Salida: string;
}

export interface Producto {
  id_Producto: number;
  nombre: string;
  precio: number;
  estado_Activo: boolean;
  stock: number;
}

export interface DetallePedido {
  id_DetallePedido: number;
  id_Pedido: number;
  id_Producto: number;
  cantidad: number;
  subtotal: number;
  producto?: Producto;
}

export interface Pedido {
  id_Pedido: number;
  id_Reserva: number;
  estado_Pedido: "Pendiente" | "En preparacion" | "Entregado";
  fecha_Hora: string;
  total: number;
  detalles?: DetallePedido[];
}

export interface AuthResponse {
  token: string;
  usuario: Usuario;
}