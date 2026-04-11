namespace KaraokeApp.Core.DTOs.Producto
{
    /// <summary>
    /// Objeto de transferencia que representa la información detallada de un producto en las respuestas de la API.
    /// </summary>
    public class ProductoResponseDto
    {
        /// <summary>
        /// Identificador único del producto en la base de datos.
        /// </summary>
        /// <example>1</example>
        public int IdProducto { get; set; }

        /// <summary>
        /// Nombre del producto tal como se mostrará al cliente.
        /// </summary>
        /// <example>Refresco de Cola 500ml</example>
        public string Nombre { get; set; } = null!;

        /// <summary>
        /// Precio unitario de venta.
        /// </summary>
        /// <example>2.50</example>
        public decimal Precio { get; set; }

        /// <summary>
        /// Indica si el producto está disponible para la venta inmediata.
        /// </summary>
        /// <example>true</example>
        public bool EstadoActivo { get; set; }

        /// <summary>
        /// Cantidad actual disponible en el almacén.
        /// </summary>
        /// <example>24</example>
        public int Stock { get; set; }
    }
}