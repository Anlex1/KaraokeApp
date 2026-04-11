namespace KaraokeApp.Core.DTOs.Producto
{
    /// <summary>
    /// Estructura de datos requerida para el registro de un nuevo producto en el catálogo.
    /// </summary>
    public class CrearProductoDto
    {
        /// <summary>
        /// Nombre descriptivo del producto.
        /// </summary>
        /// <example>Nachos con Queso Grande</example>
        public string Nombre { get; set; } = null!;

        /// <summary>
        /// Precio de venta al público.
        /// </summary>
        /// <example>15.00</example>
        public decimal Precio { get; set; }

        /// <summary>
        /// Cantidad inicial de unidades disponibles en el inventario.
        /// </summary>
        /// <example>100</example>
        public int Stock { get; set; }
    }
}
