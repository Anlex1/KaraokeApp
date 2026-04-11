namespace KaraokeApp.Core.DTOs.Pedido
{
    /// <summary>
    /// Estructura de respuesta que contiene la información detallada de un pedido realizado.
    /// </summary>
    public class PedidoResponseDto
    {
        /// <summary>Identificador único del pedido en el sistema.</summary>
        /// <example>101</example>
        public int IdPedido { get; set; }

        /// <summary>ID de la reserva a la que pertenece este pedido.</summary>
        /// <example>10</example>
        public int IdReserva { get; set; }

        /// <summary>Estado actual del pedido (Pendiente, En preparación, Entregado).</summary>
        /// <example>Entregado</example>
        public string EstadoPedido { get; set; } = null!;

        /// <summary>Fecha y hora exacta en la que se registró el pedido.</summary>
        public DateTime FechaHora { get; set; }

        /// <summary>Monto total acumulado del pedido (suma de todos los subtotales).</summary>
        /// <example>45.50</example>
        public decimal Total { get; set; }

        /// <summary>Lista detallada de los productos incluidos en el pedido.</summary>
        public List<DetallePedidoResponseDto> Detalles { get; set; } = [];
    }

    /// <summary>
    /// Información detallada de un producto específico dentro de la respuesta de un pedido.
    /// </summary>
    public class DetallePedidoResponseDto
    {
        /// <summary>Identificador del detalle de línea del pedido.</summary>
        public int IdDetallePedido { get; set; }

        /// <summary>Nombre descriptivo del producto solicitado.</summary>
        /// <example>Cerveza Artesanal</example>
        public string NombreProducto { get; set; } = null!;

        /// <summary>Cantidad de unidades entregadas.</summary>
        /// <example>3</example>
        public int Cantidad { get; set; }

        /// <summary>Cálculo de (Precio Unitario * Cantidad) para este producto.</summary>
        /// <example>15.00</example>
        public decimal Subtotal { get; set; }
    }
}
