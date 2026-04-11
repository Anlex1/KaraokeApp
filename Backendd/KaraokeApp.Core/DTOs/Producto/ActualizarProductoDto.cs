namespace KaraokeApp.Core.DTOs.Producto
{
    /// <summary>
    /// Objeto de transferencia para la actualización parcial o total de un producto existente.
    /// </summary>
    /// <remarks>
    /// Todos los campos son opcionales. Si un campo se envía como nulo, su valor actual en la base de datos no será modificado.
    /// </remarks>
    public class ActualizarProductoDto
    {
        /// <summary>
        /// Nuevo nombre para el producto.
        /// </summary>
        /// <example>Cerveza Importada 330ml</example>
        public string? Nombre { get; set; }

        /// <summary>
        /// Precio de venta actualizado.
        /// </summary>
        /// <example>12.50</example>
        public decimal? Precio { get; set; }

        /// <summary>
        /// Cantidad disponible en inventario.
        /// </summary>
        /// <example>50</example>
        public int? Stock { get; set; }

        /// <summary>
        /// Define si el producto está disponible para la venta (true) o fuera de catálogo (false).
        /// </summary>
        /// <example>true</example>
        public bool? EstadoActivo { get; set; }
    }
}
