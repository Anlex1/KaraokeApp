namespace KaraokeApp.Core.DTOs.Pedido
{
    /// <summary>
    /// Estructura de datos requerida para registrar un nuevo pedido dentro de una reserva.
    /// </summary>
    public class CrearPedidoDto
    {
        /// <summary>
        /// Identificador único de la reserva activa a la cual se cargará el consumo.
        /// </summary>
        /// <example>10</example>
        public int IdReserva { get; set; }

        /// <summary>
        /// Listado de productos y sus respectivas cantidades solicitadas por el cliente.
        /// </summary>
        public List<CrearDetallePedidoDto> Detalles { get; set; } = [];
    }

    /// <summary>
    /// Representa el detalle individual de un producto dentro de la solicitud de pedido.
    /// </summary>
    public class CrearDetallePedidoDto
    {
        /// <summary>
        /// ID del producto que se desea pedir.
        /// </summary>
        /// <example>5</example>
        public int IdProducto { get; set; }

        /// <summary>
        /// Cantidad de unidades del producto. Debe ser mayor a cero y estar disponible en stock.
        /// </summary>
        /// <example>2</example>
        public int Cantidad { get; set; }
    }
}