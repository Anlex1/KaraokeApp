namespace KaraokeApp.Core.DTOs.Pedido
{
    /// <summary>
    /// DTO utilizado para modificar el progreso de un pedido en el sistema.
    /// </summary>
    public class ActualizarEstadoPedidoDto
    {
        /// <summary>
        /// Nuevo estado que se asignará al pedido.
        /// </summary>
        /// <example>En preparación</example>
        /// <remarks>
        /// Los valores permitidos son: 'Pendiente', 'En preparación', 'Entregado'.
        /// </remarks>
        public string EstadoPedido { get; set; } = null!;
    }
}
