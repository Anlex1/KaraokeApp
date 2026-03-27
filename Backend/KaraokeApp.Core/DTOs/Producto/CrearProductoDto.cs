namespace KaraokeApp.Core.DTOs.Producto
{
    public class CrearProductoDto
    {
        public string Nombre { get; set; } = null!;
        public decimal Precio { get; set; }
        public int Stock { get; set; }
    }
}
