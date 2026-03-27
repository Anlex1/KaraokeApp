namespace KaraokeApp.Core.DTOs.Producto
{
    public class ProductoResponseDto
    {
        public int IdProducto { get; set; }
        public string Nombre { get; set; } = null!;
        public decimal Precio { get; set; }
        public bool EstadoActivo { get; set; }
        public int Stock { get; set; }
    }
}
